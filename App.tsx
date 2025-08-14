
import React, { useState, useMemo } from 'react';
import type { HvacInputs, HvacResults } from './types';
import { calculateHvacPerformance } from './services/hvacCalculator';
import { InputSlider } from './components/InputSlider';
import { ResultCard } from './components/ResultCard';
import { PowerIcon, WaterFlowIcon, HumidityIcon, TemperatureIcon, EfficiencyIcon, PipeDiameterIcon } from './components/icons';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<HvacInputs>({
    outsideTemp: 10,
    outsideHumidity: 60,
    volumeFlow: 2000,
    targetTemp: 22,
    supplyTemp: 60,
    returnTemp: 40,
  });

  const [results, setResults] = useState<HvacResults | null>(null);

  const handleInputChange = (field: keyof HvacInputs) => (value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  // Perform calculation on any input change for real-time feedback
  React.useEffect(() => {
    const calculatedResults = calculateHvacPerformance(inputs);
    setResults(calculatedResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const operationType = useMemo(() => {
    if (!results) return 'Berechnung';
    return results.isHeating ? 'Heizbetrieb' : 'Kühlbetrieb';
  }, [results]);

  const operationColor = useMemo(() => {
      if (!results) return 'bg-gray-500';
      return results.isHeating ? 'bg-red-500' : 'bg-blue-500';
  }, [results])

  return (
    <div className="min-h-screen p-4 text-gray-800 font-sans sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                HVAC Leistungsrechner
            </h1>
            <p className="mt-2 text-lg text-gray-600">
                Berechnung der Leistung von Erhitzern und Kühlern in Lüftungsanlagen.
            </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Input Section */}
              <div className="p-6 space-y-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Eingabeparameter</h2>
                
                <h3 className="text-md font-semibold text-gray-600 pt-2">Luftzustand & Volumenstrom</h3>
                <InputSlider label="Außenlufttemperatur" value={inputs.outsideTemp} onChange={handleInputChange('outsideTemp')} min={-30} max={50} step={0.5} unit="°C" />
                <InputSlider label="Relative Außenluftfeuchte" value={inputs.outsideHumidity} onChange={handleInputChange('outsideHumidity')} min={0} max={100} step={1} unit="%" />
                <InputSlider label="Luftvolumenstrom" value={inputs.volumeFlow} onChange={handleInputChange('volumeFlow')} min={100} max={150000} step={500} unit="m³/h" />
                <InputSlider label="Gemessene Temperatur nach Gerät" value={inputs.targetTemp} onChange={handleInputChange('targetTemp')} min={-10} max={60} step={0.5} unit="°C" />

                <h3 className="text-md font-semibold text-gray-600 pt-4">Heiz-/Kühlmedium (Wasser)</h3>
                 <InputSlider label="Vorlauftemperatur" value={inputs.supplyTemp} onChange={handleInputChange('supplyTemp')} min={0} max={100} step={1} unit="°C" />
                 <InputSlider label="Rücklauftemperatur" value={inputs.returnTemp} onChange={handleInputChange('returnTemp')} min={0} max={100} step={1} unit="°C" />
              </div>

              {/* Results Section */}
              <div className="p-6 space-y-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-800">Ergebnisse</h2>
                    <span className={`px-3 py-1 text-sm font-medium text-white rounded-full ${operationColor}`}>
                        {operationType}
                    </span>
                </div>
                
                {!results ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Ergebnisse werden hier angezeigt...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ResultCard
                      icon={<PowerIcon className="w-6 h-6" />}
                      label={results.isHeating ? 'Heizleistung' : 'Gesamt-Kühlleistung'}
                      value={Math.abs(results.totalPower).toFixed(2)}
                      unit="kW"
                      colorClass={results.isHeating ? "bg-red-500" : "bg-blue-500"}
                      tooltip={
                        results.isHeating 
                          ? "Die dem Luftstrom zugeführte thermische Energie." 
                          : `Sensible Leistung: ${results.sensiblePower.toFixed(2)} kW | Latente Leistung: ${results.latentPower.toFixed(2)} kW`
                      }
                    />
                    <ResultCard
                      icon={<WaterFlowIcon className="w-6 h-6" />}
                      label="Volumenstrom Wasser"
                      value={isFinite(results.waterVolumeFlow) ? results.waterVolumeFlow.toFixed(3) : 'N/A'}
                      unit="m³/h"
                      colorClass="bg-teal-500"
                      tooltip="Benötigter Volumenstrom des Wassers, um die Leistung zu übertragen. 'N/A' bei Vorlauf=Rücklauf."
                    />
                     <ResultCard
                      icon={<PipeDiameterIcon className="w-6 h-6" />}
                      label="Empf. Rohr-DN"
                      value={isFinite(results.recommendedPipeDiameter) ? results.recommendedPipeDiameter.toFixed(0) : 'N/A'}
                      unit="mm"
                      colorClass="bg-purple-500"
                      tooltip="Empfohlener Rohr-Innendurchmesser bei einer angenommenen Wassergeschwindigkeit von 1.5 m/s. 'N/A' bei Vorlauf=Rücklauf."
                    />
                    <ResultCard
                      icon={<EfficiencyIcon className="w-6 h-6" />}
                      label="Wirkungsgrad"
                      value={(results.efficiency * 100).toFixed(1)}
                      unit="%"
                      colorClass="bg-green-500"
                      tooltip="Das Verhältnis der tatsächlichen zur maximal möglichen Temperaturänderung."
                    />
                    <ResultCard
                      icon={<HumidityIcon className="w-6 h-6" />}
                      label="Result. rel. Feuchte"
                      value={results.finalHumidity.toFixed(1)}
                      unit="%"
                      colorClass="bg-sky-500"
                      tooltip="Die relative Feuchtigkeit der Luft nach der Temperaturänderung."
                    />
                    <ResultCard
                      icon={<TemperatureIcon className="w-6 h-6" />}
                      label="Taupunkttemperatur"
                      value={results.dewPoint.toFixed(1)}
                      unit="°C"
                      colorClass="bg-indigo-500"
                      tooltip="Die Temperatur, bei der Wasserdampf kondensieren würde."
                    />
                    <ResultCard
                      icon={<HumidityIcon className="w-6 h-6" />}
                      label="Abs. Feuchte (vorher)"
                      value={results.initialAbsoluteHumidity.toFixed(2)}
                      unit="g/kg"
                      colorClass="bg-gray-400"
                      tooltip="Die absolute Feuchtigkeit der Luft VOR der Behandlung. Dieser Wert basiert auf den Eingabewerten für Außenluft."
                    />
                     <ResultCard
                      icon={<HumidityIcon className="w-6 h-6" />}
                      label="Abs. Feuchte (nachher)"
                      value={results.finalAbsoluteHumidity.toFixed(2)}
                      unit="g/kg"
                      colorClass="bg-gray-500"
                      tooltip="Die absolute Feuchtigkeit der Luft NACH der Behandlung. Der Wert sinkt, wenn die Luft unter den Taupunkt gekühlt wird (Entfeuchtung)."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

         <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} HVAC Leistungsrechner. Alle Berechnungen sind Näherungswerte für Standardbedingungen.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;