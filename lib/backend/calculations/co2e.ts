/**
 * Global CO2e formula
 * Total CO2e = CO2 + (CH4 * 28) + (N2O * 265)
 */
export function calculateCO2e(
  co2: number,
  ch4: number,
  n2o: number
): number {
  return co2 + ch4 * 28 + n2o * 265;
}
