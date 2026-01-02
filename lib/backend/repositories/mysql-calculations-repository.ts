import { ResultSetHeader } from "mysql2/promise";
import { getDbPool } from "./db";
import type {
  CalculationInfo,
  CalculationWithInput,
  CarbonFootprintInput,
  CarbonFootprintOutput,
} from "@/lib/models/calculation";
import type { CalculationsRepository } from "../interfaces/calculations-repository";

/**
 * MySQL implementation of CalculationsRepository
 */
export class MySqlCalculationsRepository implements CalculationsRepository {
  private static readonly pool = getDbPool();

  async saveCalculation(
    userId: number,
    name: string,
    inputData: CarbonFootprintInput,
    resultData: CarbonFootprintOutput
  ): Promise<CalculationWithInput> {
    const [result] =
      await MySqlCalculationsRepository.pool.execute<ResultSetHeader>(
        `INSERT INTO calculations (user_id, name, input_data, result_data)
       VALUES (?, ?, ?, ?)`,
        [userId, name, JSON.stringify(inputData), JSON.stringify(resultData)]
      );

    if (!result.insertId) {
      throw new Error("Failed to save calculation");
    }

    return {
      id: result.insertId,
      user_id: userId,
      name: name,
      input_data: inputData,
      result_data: resultData,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async getCalculationsByUserId(userId: number): Promise<CalculationInfo[]> {
    const [rows] = await MySqlCalculationsRepository.pool.execute(
      `SELECT id, user_id, name, result_data, created_at, updated_at
       FROM calculations
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const calculations = rows as CalculationInfo[];
    return calculations;
  }

  async getCalculationById(
    id: number,
    userId: number
  ): Promise<CalculationWithInput | null> {
    const [rows] = await MySqlCalculationsRepository.pool.execute(
      `SELECT id, user_id, name, input_data, result_data, created_at, updated_at
       FROM calculations
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    const calculations = rows as CalculationWithInput[];
    if (calculations.length === 0) return null;

    return calculations[0];
  }
}
