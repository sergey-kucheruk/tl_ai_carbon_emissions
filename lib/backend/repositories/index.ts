import { MySqlUsersRepository } from './mysql-users-repository';
import { MySqlCalculationsRepository } from './mysql-calculations-repository';
import type { UsersRepository } from '../interfaces/users-repository';
import type { CalculationsRepository } from '../interfaces/calculations-repository';

/**
 * Factory function to get the users repository instance
 * Currently returns MySQL implementation, but can be easily swapped
 */
export function getUsersRepository(): UsersRepository {
  return new MySqlUsersRepository();
}

/**
 * Factory function to get the calculations repository instance
 * Currently returns MySQL implementation, but can be easily swapped
 */
export function getCalculationsRepository(): CalculationsRepository {
  return new MySqlCalculationsRepository();
}

// Export types
export type { UsersRepository } from '../interfaces/users-repository';
export type { CalculationsRepository } from '../interfaces/calculations-repository';