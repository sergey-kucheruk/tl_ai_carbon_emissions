import type {
  CalculationInfo,
  CalculationWithInput,
  CarbonFootprintInput,
  CarbonFootprintOutput,
} from '@/lib/models/calculation';

/**
 * Repository interface for calculation operations
 */
export interface CalculationsRepository {
  /**
   * Save a new calculation
   */
  saveCalculation(
    userId: number,
    name: string,
    inputData: CarbonFootprintInput,
    resultData: CarbonFootprintOutput
  ): Promise<CalculationWithInput>;

  /**
   * Get all calculations for a user
   */
  getCalculationsByUserId(userId: number): Promise<CalculationInfo[]>;

  /**
   * Get a specific calculation by ID and user ID
   */
  getCalculationById(
    id: number,
    userId: number
  ): Promise<CalculationWithInput | null>;
}
