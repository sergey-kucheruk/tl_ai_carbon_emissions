import type { Scope2Input } from '../../models/calculation';
import { PURCHASED_ENERGY_EMISSIONS } from './constants';

/**
 * Scope 2: Indirect Emissions (Purchased Energy)
 */

// Electricity
function calculateElectricity(electricity?: number): number {
  if (!electricity || electricity === 0) return 0;
  
  // Convert kWh to MWh
  const mwh = electricity / 1000;
  // MWh * emission factor = kg CO2e (only CO2 counted)
  return mwh * PURCHASED_ENERGY_EMISSIONS.ELECTRICITY_KG_CO2E_PER_MWH;
}

// District Heating
function calculateDistrictHeating(districtHeating?: number): number {
  if (!districtHeating || districtHeating === 0) return 0;
  
  // GJ * emission factor = kg CO2e (only CO2 counted)
  return districtHeating * PURCHASED_ENERGY_EMISSIONS.DISTRICT_HEATING_KG_CO2E_PER_GJ;
}

// Total Scope 2
function calculateScope2(input: Scope2Input): number {
  const electricity = calculateElectricity(input.electricity);
  const districtHeating = calculateDistrictHeating(input.districtHeating);

  return electricity + districtHeating;
}

// Scope 2 with breakdown
export function calculateScope2WithBreakdown(input: Scope2Input): {
  total: number;
  breakdown: {
    electricity: number;
    districtHeating: number;
  };
} {
  const electricity = calculateElectricity(input.electricity);
  const districtHeating = calculateDistrictHeating(input.districtHeating);

  return {
    total: electricity + districtHeating,
    breakdown: {
      electricity: Math.round(electricity * 100) / 100,
      districtHeating: Math.round(districtHeating * 100) / 100,
    },
  };
}
