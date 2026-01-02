import { NextRequest, NextResponse } from "next/server";
import { getUsersRepository } from "@/lib/backend/repositories";
import { signToken } from "@/lib/backend/auth/jwt";
import type { User } from "@/lib/models/user";
import { PasswordHasher } from "@/lib/backend/security/password-hasher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken(user);

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        first_name: user.first_name || undefined,
        last_name: user.last_name || undefined,
        business_name: user.business_name || undefined,
        business_description: user.business_description || undefined,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const usersRepository = getUsersRepository();

  const user = await usersRepository.findUserByEmail(email);
  if (!user) return null;

  const isValid = await PasswordHasher.verify(password, user.password_hash);
  if (!isValid) return null;

  return user;
}
