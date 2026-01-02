import { calculateCO2e } from './co2e';
import type { Scope1Input } from '../../models/calculation';
import {
  ENERGY_CONVERSION,
  NATURAL_GAS_EMISSIONS,
  HEATING_OIL_EMISSIONS,
  COAL_EMISSIONS,
  GASOLINE_EMISSIONS,
  DIESEL_EMISSIONS,
  REFRIGERANT_GWP,
} from './constants';

/**
 * Scope 1: Direct Emissions
 */

// Energy Carriers
function calculateEnergyCarriers(
  input: Scope1Input['energyCarriers']
): number {
  if (!input) return 0;

  let totalCO2e = 0;

  // Natural Gas (m3)
  if (input.naturalGas) {
    const gj = input.naturalGas * ENERGY_CONVERSION.NATURAL_GAS_M3_TO_GJ;
    const co2 = gj * NATURAL_GAS_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * NATURAL_GAS_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * NATURAL_GAS_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  // Heating Oil (liters)
  if (input.heatingOil) {
    const gj = input.heatingOil * ENERGY_CONVERSION.HEATING_OIL_L_TO_GJ;
    const co2 = gj * HEATING_OIL_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * HEATING_OIL_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * HEATING_OIL_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  // Coal (tonnes)
  if (input.coal) {
    const gj = input.coal * ENERGY_CONVERSION.COAL_TONNES_TO_GJ;
    const co2 = gj * COAL_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * COAL_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * COAL_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  return totalCO2e;
}

// Fleet & Generators
function calculateFleet(input: Scope1Input['fleet']): number {
  if (!input) return 0;

  let totalCO2e = 0;

  // Gasoline (liters)
  if (input.gasoline) {
    const gj = input.gasoline * ENERGY_CONVERSION.GASOLINE_L_TO_GJ;
    const co2 = gj * GASOLINE_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * GASOLINE_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * GASOLINE_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  // Diesel - Fleet Vehicles (liters)
  if (input.diesel) {
    const gj = input.diesel * ENERGY_CONVERSION.DIESEL_L_TO_GJ;
    const co2 = gj * DIESEL_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * DIESEL_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * DIESEL_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  // Diesel - Generators (liters)
  if (input.dieselGenerators) {
    const gj = input.dieselGenerators * ENERGY_CONVERSION.DIESEL_L_TO_GJ;
    const co2 = gj * DIESEL_EMISSIONS.CO2_KG_PER_GJ;
    const ch4 = gj * DIESEL_EMISSIONS.CH4_KG_PER_GJ;
    const n2o = gj * DIESEL_EMISSIONS.N2O_KG_PER_GJ;
    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  return totalCO2e;
}

// Refrigerants
function calculateRefrigerants(
  input: Scope1Input['refrigerants']
): number {
  if (!input) return 0;

  let totalCO2e = 0;

  // R407C
  if (input.r407c) {
    totalCO2e += input.r407c * REFRIGERANT_GWP.R407C;
  }

  // R32
  if (input.r32) {
    totalCO2e += input.r32 * REFRIGERANT_GWP.R32;
  }

  // R410A
  if (input.r410a) {
    totalCO2e += input.r410a * REFRIGERANT_GWP.R410A;
  }

  return totalCO2e;
}

// Total Scope 1
function calculateScope1(input: Scope1Input): number {
  const energyCarriers = calculateEnergyCarriers(input.energyCarriers);
  const fleet = calculateFleet(input.fleet);
  const refrigerants = calculateRefrigerants(input.refrigerants);

  return energyCarriers + fleet + refrigerants;
}

// Scope 1 with breakdown
export function calculateScope1WithBreakdown(input: Scope1Input): {
  total: number;
  breakdown: {
    energyCarriers: number;
    fleet: number;
    refrigerants: number;
  };
} {
  const energyCarriers = calculateEnergyCarriers(input.energyCarriers);
  const fleet = calculateFleet(input.fleet);
  const refrigerants = calculateRefrigerants(input.refrigerants);

  return {
    total: energyCarriers + fleet + refrigerants,
    breakdown: {
      energyCarriers: Math.round(energyCarriers * 100) / 100,
      fleet: Math.round(fleet * 100) / 100,
      refrigerants: Math.round(refrigerants * 100) / 100,
    },
  };
}
