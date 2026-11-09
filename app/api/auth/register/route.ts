import { NextRequest, NextResponse } from 'next/server';
import { usersRepo, activityRepo } from '@/app/lib/repository';
import { hashPassword, createToken, setAuthCookie } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await usersRepo.findByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = 'ver_' + Math.random().toString(36).substring(2, 10);

    const newUser = await usersRepo.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'citizen',
      emailVerified: true,
      accountStatus: 'active',
      verificationToken,
    });

    await activityRepo.log({
      userId: newUser._id,
      userEmail: newUser.email,
      userName: newUser.name,
      action: 'USER_REGISTERED',
      metadata: { method: 'email' },
    });

    const token = createToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json(
      {
        message: 'Account registered successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
          accountStatus: newUser.accountStatus,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to complete registration' }, { status: 500 });
  }
}

