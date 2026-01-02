import { NextRequest, NextResponse } from 'next/server';
import { getUsersRepository } from '@/lib/backend/repositories';
import { signToken } from '@/lib/backend/auth/jwt';
import { PasswordHasher } from '@/lib/backend/security/password-hasher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, user_type, ...rest } = body;

    if (!email || !password || !user_type) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      );
    }

    const usersRepository = getUsersRepository();
    // Check if user already exists
    const existingUser = await usersRepository.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const password_hash = await PasswordHasher.hash(password);
    let user;
    if (user_type === 'personal') {
      const { first_name, last_name } = rest;
      if (!first_name || !last_name) {
        return NextResponse.json(
          { error: 'First name and last name are required for personal accounts' },
          { status: 400 }
        );
      }
      user = await usersRepository.createPersonalUser(email, password_hash, first_name, last_name);
    } else if (user_type === 'business') {
      const { business_name, business_description } = rest;
      if (!business_name) {
        return NextResponse.json(
          { error: 'Business name is required for business accounts' },
          { status: 400 }
        );
      }
      user = await usersRepository.createBusinessUser(
        email,
        password_hash,
        business_name,
        business_description || ''
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = signToken(user);

    // Return user data and token
    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
