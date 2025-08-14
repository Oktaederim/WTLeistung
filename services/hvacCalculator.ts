
import type { HvacInputs, HvacResults } from '../types';

// Constants for calculation
const AIR_DENSITY = 1.204; // kg/m³ at 20°C
const SPECIFIC_HEAT_AIR = 1.005; // kJ/(kg·K)
const SPECIFIC_HEAT_WATER = 4.186; // kJ/(kg·K)
const WATER_DENSITY = 1000; // kg/m³
const ATMOSPHERIC_PRESSURE = 1013.25; // hPa
const LATENT_HEAT_VAPORIZATION = 2260; // kJ/kg of water (latent heat)
const RECOMMENDED_WATER_VELOCITY = 1.5; // m/s for pipe sizing

/**
 * Calculates saturation vapor pressure using the Magnus formula.
 * @param temp - Temperature in Celsius.
 * @returns Saturation vapor pressure in hPa.
 */
const calculateSaturationVaporPressure = (temp: number): number => {
  return 6.112 * Math.exp((17.67 * temp) / (temp + 243.5));
};

/**
 * Calculates the dew point temperature.
 * @param vaporPressure - Actual vapor pressure in hPa.
 * @returns Dew point temperature in Celsius.
 */
const calculateDewPoint = (vaporPressure: number): number => {
    const numerator = 243.5 * Math.log(vaporPressure / 6.112);
    const denominator = 17.67 - Math.log(vaporPressure / 6.112);
    return numerator / denominator;
};


/**
 * Calculates absolute humidity.
 * @param vaporPressure - Actual vapor pressure in hPa.
 * @returns Absolute humidity in g/kg.
 */
const calculateAbsoluteHumidity = (vaporPressure: number): number => {
    return (622 * vaporPressure) / (ATMOSPHERIC_PRESSURE - vaporPressure);
}


export const calculateHvacPerformance = (inputs: HvacInputs): HvacResults | null => {
  try {
    const {
      outsideTemp,
      outsideHumidity,
      volumeFlow,
      targetTemp,
      supplyTemp,
      returnTemp,
    } = inputs;

    const airMassFlow_kg_per_s = (volumeFlow * AIR_DENSITY) / 3600;

    // 2. Power Calculation
    const deltaT_air = targetTemp - outsideTemp;
    const isHeating = deltaT_air > 0;
    const sensiblePower_kW = airMassFlow_kg_per_s * SPECIFIC_HEAT_AIR * deltaT_air;
    
    let latentPower_kW = 0;

    // 3. Humidity Calculation
    const initialSatPressure = calculateSaturationVaporPressure(outsideTemp);
    const initialVaporPressure = (outsideHumidity / 100) * initialSatPressure;
    const dewPoint = calculateDewPoint(initialVaporPressure);
    
    const initialAbsoluteHumidity = calculateAbsoluteHumidity(initialVaporPressure);
    let finalAbsoluteHumidity = initialAbsoluteHumidity; // By default, it remains constant

    let finalHumidity: number;

    if (isHeating) {
      // Heating: Absolute humidity remains constant. Relative humidity decreases.
      const finalSatPressure = calculateSaturationVaporPressure(targetTemp);
      finalHumidity = (initialVaporPressure / finalSatPressure) * 100;
    } else {
      // Cooling: Check for condensation
      if (targetTemp >= dewPoint) {
        // Sensible cooling (no condensation)
        const finalSatPressure = calculateSaturationVaporPressure(targetTemp);
        finalHumidity = (initialVaporPressure / finalSatPressure) * 100;
      } else {
        // Cooling with dehumidification (condensation occurs)
        finalHumidity = 100; // Air is saturated at the target temperature.
        const finalSatPressure = calculateSaturationVaporPressure(targetTemp);
        finalAbsoluteHumidity = calculateAbsoluteHumidity(finalSatPressure); // Update final absolute humidity
        
        const deltaAbsoluteHumidity_g_per_kg = initialAbsoluteHumidity - finalAbsoluteHumidity;
        const waterCondensed_kg_per_s = airMassFlow_kg_per_s * (deltaAbsoluteHumidity_g_per_kg / 1000);
        
        // Latent power is negative as it's a cooling effect
        latentPower_kW = -Math.abs(waterCondensed_kg_per_s * LATENT_HEAT_VAPORIZATION);
      }
    }
    
    finalHumidity = Math.max(0, Math.min(finalHumidity, 100));
    const totalPower_kW = sensiblePower_kW + latentPower_kW;

    // 4. Water Volume Flow & Pipe Diameter
    const deltaT_water = Math.abs(supplyTemp - returnTemp);
    let waterVolumeFlow_m3_per_h = Infinity;
    let recommendedPipeDiameter = Infinity;

    if (deltaT_water > 0) {
      // Base water flow on TOTAL power required
      const waterMassFlow_kg_per_s = Math.abs(totalPower_kW) / (SPECIFIC_HEAT_WATER * deltaT_water);
      waterVolumeFlow_m3_per_h = (waterMassFlow_kg_per_s * 3600) / WATER_DENSITY;
      
      // Calculate pipe diameter if flow is finite
      if (isFinite(waterVolumeFlow_m3_per_h)) {
        const waterFlow_m3_per_s = waterVolumeFlow_m3_per_h / 3600;
        const area_m2 = waterFlow_m3_per_s / RECOMMENDED_WATER_VELOCITY;
        const diameter_m = Math.sqrt((4 * area_m2) / Math.PI);
        recommendedPipeDiameter = diameter_m * 1000; // Convert to mm
      }
    }

    // 5. Efficiency Calculation
    let efficiency = 0;
    const potential_deltaT = supplyTemp - outsideTemp;
    const validScenario = (isHeating && potential_deltaT > 0) || (!isHeating && potential_deltaT < 0);
    if (validScenario && Math.abs(potential_deltaT) > 1e-6) {
        efficiency = (targetTemp - outsideTemp) / potential_deltaT;
    }
    efficiency = Math.max(0, Math.min(efficiency, 1));


    return {
      sensiblePower: sensiblePower_kW,
      latentPower: latentPower_kW,
      totalPower: totalPower_kW,
      waterVolumeFlow: waterVolumeFlow_m3_per_h,
      finalHumidity,
      isHeating,
      dewPoint,
      initialAbsoluteHumidity,
      finalAbsoluteHumidity,
      efficiency,
      recommendedPipeDiameter,
    };
  } catch (error) {
    console.error("Error in HVAC calculation:", error);
    return null;
  }
};