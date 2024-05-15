/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from 'jsonwebtoken';
import { type NextRequest, type NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component = false) {
  cookies().getAll();
  return createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { cookies });
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          setCookie(name, value, { cookies, ...options });
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
          deleteCookie(name, { cookies, ...options });
        },
      },
    }
  );
}

export function createSupabaseServerComponentClient() {
  cookies().getAll();
  return createSupabaseServerClient(true);
}

export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  cookies().getAll();
  return createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { req, res });
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name: string, options: CookieOptions) {
          setCookie(name, '', { req, res, ...options });
        },
      },
    }
  );
}

/**
 * If there is an active auth session, this function will return the user object from Auth.
 *
 * Otherwise it will throw an error.
 *
 * @param context - The context from the Hono / Frog instance request.
 * @returns - { id: string, email: string }
 */
export const decodeJwt = async (
  access_token: string
): Promise<{ email: string; id: string }> => {
  const token = access_token.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env['SUPABASE_JWT_SECRET']!);
    if (!decoded.email) {
      throw new Error('Could not get email from JWT.');
    }
    if (!decoded.sub) {
      throw new Error('Could not get user id from JWT.');
    }
    return {
      email: decoded.email,
      id: decoded.sub,
    };
  } catch (err) {
    console.error('Error decoding token', err);
    throw new Error('User not authenticated.');
  }
};
