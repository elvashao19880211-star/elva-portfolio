import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// 需要登录才能访问的路径
const PROTECTED_PATHS = ['/patterns', '/materials', '/member'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 检查是否是需要保护的路径
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // 验证 token
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/patterns/:path*',
    '/materials/:path*',
    '/member/:path*',
  ],
};
