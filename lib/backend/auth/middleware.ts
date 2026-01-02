import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function verifyAuth(request: NextRequest): { userId: number; email: string } | null {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

export function requireAuth(request: NextRequest): { userId: number; email: string } | NextResponse {
  const auth = verifyAuth(request);
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return auth;
}
