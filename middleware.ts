import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('cm_auth_token')?.value;

  // 1. Redirect legacy /court/admin/* to /admin/*
  if (pathname.startsWith('/court/admin')) {
    const newPath = pathname.replace(/^\/court\/admin/, '/admin') || '/admin';
    const redirectUrl = new URL(newPath, req.url);
    if (search) {
      redirectUrl.search = search;
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // Allow unauthenticated access to admin login
      return NextResponse.next();
    }

    if (!token) {
      const redirectUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      const rawPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(rawPayload);

      if (payload.role !== 'admin') {
        // Non-admin attempting to access /admin -> redirect to admin login
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
  }

  // 3. Protect citizen /court routes
  if (pathname.startsWith('/court')) {
    if (!token) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname + search);
        return NextResponse.redirect(redirectUrl);
      }
      const rawPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(rawPayload);
      if (!payload.userId) {
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname + search);
        return NextResponse.redirect(redirectUrl);
      }
    } catch {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/court/:path*', '/admin/:path*'],
};
