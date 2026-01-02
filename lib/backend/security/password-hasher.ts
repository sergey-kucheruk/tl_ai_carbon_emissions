import bcrypt from 'bcryptjs';

/**
 * Static utility class for password hashing and verification
 */
export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   * @param password - The plain text password to hash
   * @returns A promise that resolves to the hashed password
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordHasher.SALT_ROUNDS);
  }

  /**
   * Verify a plain text password against a hash
   * @param password - The plain text password to verify
   * @param hash - The hashed password to compare against
   * @returns A promise that resolves to true if the password matches, false otherwise
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
