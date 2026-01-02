import type { User } from "@/lib/models/user";

/**
 * Repository interface for user operations
 */
export interface UsersRepository {
  /**
   * Find a user and password hash by email address
   */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * Create a new personal user account
   */
  createPersonalUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ): Promise<User>;

  /**
   * Create a new business user account
   */
  createBusinessUser(
    email: string,
    password: string,
    business_name: string,
    business_description: string
  ): Promise<User>;
}
