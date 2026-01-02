import { getDbPool } from "./db";
import type { User } from "@/lib/models/user";
import type { UsersRepository } from "../interfaces/users-repository";
import { ResultSetHeader } from "mysql2/promise";

/**
 * MySQL implementation of UsersRepository
 */
export class MySqlUsersRepository implements UsersRepository {
  private static readonly pool = getDbPool();

  async findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await MySqlUsersRepository.pool.execute(
      "SELECT id, email, password_hash, user_type, first_name, last_name, business_name, business_description, created_at, updated_at FROM users WHERE email = ?",
      [email]
    );

    const users = rows as User[];
    if (users.length === 0) return null;

    return users[0];
  }

  async createPersonalUser(
    email: string,
    password_hash: string,
    first_name: string,
    last_name: string
  ): Promise<User> {
    const [result] = await MySqlUsersRepository.pool.execute<ResultSetHeader>(
      `INSERT INTO users (email, password_hash, user_type, first_name, last_name)
       VALUES (?, ?, 'personal', ?, ?)`,
      [email, password_hash, first_name, last_name]
    );

    if (!result.insertId) {
      throw new Error("Failed to create user");
    }

    return {
      id: result.insertId,
      email,
      password_hash,
      user_type: "personal",
      first_name,
      last_name,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async createBusinessUser(
    email: string,
    password_hash: string,
    business_name: string,
    business_description: string
  ): Promise<User> {
    const [result] = await MySqlUsersRepository.pool.execute<ResultSetHeader>(
      `INSERT INTO users (email, password_hash, user_type, business_name, business_description)
       VALUES (?, ?, 'business', ?, ?)`,
      [email, password_hash, business_name, business_description]
    );

    if (!result.insertId) {
      throw new Error("Failed to create user");
    }

    return {
      id: result.insertId,
      email,
      password_hash,
      user_type: "business",
      business_name,
      business_description,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}
