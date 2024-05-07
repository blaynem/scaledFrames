import { updateSession } from '@framer/FramerServerSDK';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Updates the supabase session
  const data = await updateSession(request as any);
  return data;
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
