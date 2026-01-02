import { calculateScope1WithBreakdown } from './scope1';
import { calculateScope2WithBreakdown } from './scope2';
import { calculateScope3WithBreakdown } from './scope3';
import type {
  CarbonFootprintInput,
  CarbonFootprintOutput,
} from '../../models/calculation';

/**
 * Main function to calculate total carbon footprint with detailed breakdowns
 */
export function calculateCarbonFootprint(
  input: CarbonFootprintInput
): CarbonFootprintOutput {
  const scope1 = calculateScope1WithBreakdown(input.scope1 || {});
  const scope2 = calculateScope2WithBreakdown(input.scope2 || {});
  const scope3 = calculateScope3WithBreakdown(input.scope3 || {});

  const totalFootprint = scope1.total + scope2.total + scope3.total;

  return {
    scope1Total: scope1.total,
    scope2Total: scope2.total,
    scope3Total: scope3.total,
    totalFootprint: Math.round(totalFootprint * 100) / 100,
    scope1Breakdown: scope1.breakdown,
    scope2Breakdown: scope2.breakdown,
    scope3Breakdown: scope3.breakdown,
  };
}
