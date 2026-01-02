// Input types for carbon footprint calculation
export interface EnergyCarrierInput {
  naturalGas?: number; // m3
  heatingOil?: number; // liters
  coal?: number; // tonnes
}

export interface FleetInput {
  gasoline?: number; // liters
  diesel?: number; // liters (fleet vehicles)
  dieselGenerators?: number; // liters (generators)
}

export interface RefrigerantInput {
  r407c?: number; // kg
  r32?: number; // kg
  r410a?: number; // kg
}

export interface Scope1Input {
  energyCarriers?: EnergyCarrierInput;
  fleet?: FleetInput;
  refrigerants?: RefrigerantInput;
}

export interface Scope2Input {
  electricity?: number; // kWh
  districtHeating?: number; // GJ
}

export interface AirTravelItem {
  name?: string; // Flight name/description
  distance?: number; // km
}

export interface TrainTravelItem {
  name?: string; // Route name/description
  distance?: number; // km
}

export interface Scope3Input {
  water?: number; // m3
  sewage?: number; // m3
  paperEcoLabeled?: number; // kg
  paperStandard?: number; // kg
  waste?: number; // kg (Paper/Electronics/Toners)
  airTravel?: AirTravelItem[]; // Array of air travel items (name and distance)
  trainTravel?: TrainTravelItem[]; // Array of train travel items (name and distance)
}

export interface CarbonFootprintInput {
  scope1?: Scope1Input;
  scope2?: Scope2Input;
  scope3?: Scope3Input;
}

// Scope breakdown types
export interface Scope1Breakdown {
  energyCarriers: number; // kg CO2e
  fleet: number; // kg CO2e
  refrigerants: number; // kg CO2e
}

export interface Scope2Breakdown {
  electricity: number; // kg CO2e
  districtHeating: number; // kg CO2e
}

export interface Scope3Breakdown {
  waterAndSewage: number; // kg CO2e
  paperAndWaste: number; // kg CO2e
  airTravel: number; // kg CO2e
  trainTravel: number; // kg CO2e
}

// Output types
export interface CarbonFootprintOutput {
  scope1Total: number; // kg CO2e
  scope2Total: number; // kg CO2e
  scope3Total: number; // kg CO2e
  totalFootprint: number; // kg CO2e
  scope1Breakdown?: Scope1Breakdown;
  scope2Breakdown?: Scope2Breakdown;
  scope3Breakdown?: Scope3Breakdown;
}

export type CalculationInfo = {
  id: number;
  user_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  result_data: CarbonFootprintOutput;
};

export type CalculationWithInput = CalculationInfo & {
  input_data: CarbonFootprintInput;
};
