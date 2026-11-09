import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { usersRepo, UserRecord } from './repository';

const JWT_SECRET = process.env.JWT_SECRET || 'consumer_mitra_jwt_super_secure_secret_key_2026_cpa19';
const TOKEN_NAME = 'cm_auth_token';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'citizen' | 'user' | 'admin';
  name: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 12);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the secure HTTP-only authentication cookie on a response.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears the auth cookie.
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}

/**
 * Server-side helper to authenticate request in Route Handlers.
 */
export async function getAuthUser(req: NextRequest): Promise<UserRecord | null> {
  let token = req.cookies.get(TOKEN_NAME)?.value;

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || !payload.userId) {
    return null;
  }

  const user = await usersRepo.findById(payload.userId);
  if (!user || user.accountStatus === 'suspended') {
    return null;
  }

  return user;
}

/**
 * Server-side helper for Server Components to get current user.
 */
export async function getCurrentUserFromCookies(): Promise<UserRecord | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await usersRepo.findById(payload.userId);
    if (!user || user.accountStatus === 'suspended') return null;

    return user;
  } catch {
    return null;
  }
}

