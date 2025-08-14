
export interface HvacInputs {
  outsideTemp: number;
  outsideHumidity: number;
  volumeFlow: number;
  targetTemp: number;
  supplyTemp: number;
  returnTemp: number;
}

export interface HvacResults {
  sensiblePower: number; // Renamed from 'power' for clarity
  latentPower: number; // Added for cooling dehumidification
  totalPower: number; // Sum of sensible and latent power
  waterVolumeFlow: number; 
  finalHumidity: number;
  isHeating: boolean;
  dewPoint: number;
  initialAbsoluteHumidity: number; // Renamed from absoluteHumidity
  finalAbsoluteHumidity: number; // Added for after treatment
  efficiency: number;
  recommendedPipeDiameter: number; // Added recommended pipe inner diameter in mm
}