/**
 * Conversion factors and emission factors for Scope 1, Scope 2, and Scope 3 calculations
 * All factors are based on standard GHG Protocol methodologies
 */

// Energy conversion factors (to GJ)
export const ENERGY_CONVERSION = {
  NATURAL_GAS_M3_TO_GJ: 0.039492, // m³ to GJ
  HEATING_OIL_L_TO_GJ: 0.0344, // liters to GJ
  COAL_TONNES_TO_GJ: 22.55, // tonnes to GJ
  GASOLINE_L_TO_GJ: 0.0319, // liters to GJ
  DIESEL_L_TO_GJ: 0.0353, // liters to GJ
} as const;

// Emission factors for Natural Gas (per GJ)
export const NATURAL_GAS_EMISSIONS = {
  CO2_KG_PER_GJ: 57.65,
  CH4_KG_PER_GJ: 0.0009479,
  N2O_KG_PER_GJ: 0.0000948,
} as const;

// Emission factors for Heating Oil (per GJ)
export const HEATING_OIL_EMISSIONS = {
  CO2_KG_PER_GJ: 74.10,
  CH4_KG_PER_GJ: 0.0028,
  N2O_KG_PER_GJ: 0.0006,
} as const;

// Emission factors for Coal (per GJ)
export const COAL_EMISSIONS = {
  CO2_KG_PER_GJ: 94.78,
  CH4_KG_PER_GJ: 0.0104,
  N2O_KG_PER_GJ: 0.0015,
} as const;

// Emission factors for Gasoline (per GJ)
export const GASOLINE_EMISSIONS = {
  CO2_KG_PER_GJ: 69.30,
  CH4_KG_PER_GJ: 0.0028,
  N2O_KG_PER_GJ: 0.0006,
} as const;

// Emission factors for Diesel (per GJ)
export const DIESEL_EMISSIONS = {
  CO2_KG_PER_GJ: 74.10,
  CH4_KG_PER_GJ: 0.0028,
  N2O_KG_PER_GJ: 0.0006,
} as const;

// Global Warming Potential (GWP) factors for refrigerants
export const REFRIGERANT_GWP = {
  R407C: 1624,
  R32: 677,
  R410A: 1924,
} as const;

// Scope 2: Indirect Emissions (Purchased Energy)
export const PURCHASED_ENERGY_EMISSIONS = {
  ELECTRICITY_KG_CO2E_PER_MWH: 698, // kg CO2e per MWh (only CO2 counted)
  DISTRICT_HEATING_KG_CO2E_PER_GJ: 95.05, // kg CO2e per GJ (only CO2 counted)
} as const;

// Distance conversion factors
export const DISTANCE_CONVERSION = {
  KM_TO_MILES: 0.6214, // kilometers to miles conversion factor
} as const;

// Air travel distance thresholds (in km)
export const AIR_TRAVEL_THRESHOLDS = {
  SHORT_HAUL_MAX_KM: 480, // < 480 km
  MEDIUM_HAUL_MIN_KM: 480, // >= 480 km
  MEDIUM_HAUL_MAX_KM: 3680, // < 3680 km
  LONG_HAUL_MIN_KM: 3680, // >= 3680 km
} as const;

// Scope 3: Water & Sewage emission factors
export const WATER_SEWAGE_EMISSIONS = {
  WATER_KG_CO2E_PER_M3: 0.149, // kg CO2e per m³
  SEWAGE_KG_CO2E_PER_M3: 0.272, // kg CO2e per m³
} as const;

// Scope 3: Paper & Waste emission factors (per tonne)
export const PAPER_WASTE_EMISSIONS = {
  PAPER_ECO_LABELED_KG_CO2E_PER_TONNE: 739.4, // kg CO2e per tonne
  PAPER_STANDARD_KG_CO2E_PER_TONNE: 919.4, // kg CO2e per tonne
  WASTE_KG_CO2E_PER_TONNE: 21.29, // kg CO2e per tonne
} as const;

// Scope 3: Air Travel emission factors (per mile)
export const AIR_TRAVEL_EMISSIONS = {
  SHORT_HAUL: {
    CO2_KG_PER_MILE: 0.215,
    CH4_G_PER_MILE: 0.0077, // grams per mile
    N2O_G_PER_MILE: 0.0068, // grams per mile
  },
  MEDIUM_HAUL: {
    CO2_KG_PER_MILE: 0.133,
    CH4_G_PER_MILE: 0.0006, // grams per mile
    N2O_G_PER_MILE: 0.0042, // grams per mile
  },
  LONG_HAUL: {
    CO2_KG_PER_MILE: 0.165,
    CH4_G_PER_MILE: 0.0006, // grams per mile
    N2O_G_PER_MILE: 0.0052, // grams per mile
  },
} as const;

// Scope 3: Train Travel emission factors
export const TRAIN_TRAVEL_EMISSIONS = {
  CO2_KG_PER_KM: 0.028, // kg CO2 per km
  CH4_KG_PER_MILE: 0.0000092, // kg CH4 per mile
  N2O_KG_PER_MILE: 0.0000026, // kg N2O per mile
} as const;
