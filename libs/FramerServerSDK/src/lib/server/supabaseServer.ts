/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use server';
import { createServerClient, CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
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
): Promise<{ email: string }> => {
  const token = access_token.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env['SUPABASE_JWT_SECRET']!);
    if (!decoded.email) {
      throw new Error('Could not get email from JWT.');
    }
    return {
      email: decoded.email,
    };
  } catch (err) {
    console.error('Error decoding token', err);
    throw new Error('User not authenticated.');
  }
};
