import { NextRequest, NextResponse } from 'next/server';
import { usersRepo, activityRepo } from '@/app/lib/repository';
import { verifyPassword, createToken, setAuthCookie } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await usersRepo.findByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.accountStatus === 'suspended') {
      return NextResponse.json(
        { error: 'Your account has been suspended. Please contact legal administrative support.' },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update lastLoginAt
    await usersRepo.update(user._id, { lastLoginAt: new Date() });

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      action: 'USER_LOGIN',
      metadata: { ip: req.headers.get('x-forwarded-for') || 'local' },
    });

    const token = createToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}

