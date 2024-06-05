import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { loggedIn, response } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!loggedIn && pathname.split('/')[1] !== 'auth') {
    const url = new URL(request.url);
    const afterLogin = encodeURIComponent(`${url.pathname}${url.search}`);
    console.log('redirecting to', afterLogin);
    return NextResponse.redirect(new URL(`/auth/login?redirect=${afterLogin}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (font files)
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts).*)',
  ],
};
