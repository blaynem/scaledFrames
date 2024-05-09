import { createSupabaseReqResClient } from '@framer/FramerServerSDK/server';
import { NextResponse, type NextRequest } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';
import { AUTHED_PATHS, DEV_ONLY_PATHS } from './app/lib/constants';

/**
 * Checks if the current path is in the list of paths.
 */
const checkPaths = (nextUrl: NextURL, paths: string[]): boolean => {
  return paths.some((path) => {
    const devPaths = path.toLowerCase();
    const pathname = nextUrl.pathname.toLowerCase();
    return pathname.startsWith(devPaths);
  });
};

const checkDevPaths = (nextUrl: NextURL): boolean => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  // If we're in dev mode, we can skip the check
  if (isDevelopment) {
    return false;
  }
  return checkPaths(nextUrl, DEV_ONLY_PATHS);
};

export async function middleware(request: NextRequest) {
  const devPathCheck = checkDevPaths(request.nextUrl);
  if (devPathCheck) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not logged in, we're going to redirect them to the home page.
  if (!user) {
    const authCheck = checkPaths(request.nextUrl, AUTHED_PATHS);
    if (authCheck) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
