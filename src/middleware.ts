import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'ethio_gemini_admin_session';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value || request.cookies.get('admin_session_token')?.value;

  // 1. If user is already logged in and attempts to access /admin/login -> redirect to /admin
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. Protect /admin and /admin/* routes (except /admin/login)
  if ((pathname === '/admin' || pathname.startsWith('/admin/')) && pathname !== '/admin/login') {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
