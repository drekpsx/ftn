import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: '/connexion' },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/admin/:path*'],
};
