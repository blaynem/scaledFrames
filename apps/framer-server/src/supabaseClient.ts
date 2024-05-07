import dotenv from 'dotenv';
import { createServerClient } from '@supabase/ssr';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { AuthUser } from '@framer/FramerServerSDK';

dotenv.config();

// TODO: Fix this typing later. But for now yolo.
// As long as we pass in the Frog / Hono context it works.
export const createClient = (context: any) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: any) => {
          const cookie = getCookie(context, key) ?? '';
          return decodeURIComponent(cookie);
        },
        set: (key: any, value: any, options: any) => {
          const _maxAge = 34560000;
          if (!context.res) return;
          setCookie(context, key, encodeURIComponent(value), {
            ...options,
            maxAge: options.maxAge > _maxAge ? _maxAge : options.maxAge,
            sameSite: 'Lax',
            httpOnly: true,
          });
        },
        remove: (key: any, options: any) => {
          if (!context.res) return;
          deleteCookie(context, key, { ...options, httpOnly: true });
        },
      },
    }
  );
};

/**
 * If there is an active auth session, this function will return the user object from Auth.
 *
 * Otherwise it will throw an error.
 *
 * @param context - The context from the Hono / Frog instance request.
 * @returns - { id: string, email: string }
 */
export const getAuthUser = async (context: any): Promise<AuthUser> => {
  const supabase = createClient(context);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data || !data.user) {
    throw new Error('User not authenticated.');
  }
  return {
    id: data.user.id,
    email: data.user.email!,
  };
};

/**
 * If the email is valid, this function will send an OTP to the email.
 * @param context - The context from the Hono / Frog instance request.
 * @param email
 * @returns
 */
export const signInWithOtp = async (context: any, email: string) => {
  const supabase = createClient(context);
  return await supabase.auth.signInWithOtp({
    email,
  });
};

/**
 * If the OTP is valid, this function will return the session and user object from Auth.
 * @param context - The context from the Hono / Frog instance request.
 * @param email
 * @param otp
 * @returns
 */
export const verifyOtp = async (context: any, email: string, otp: string) => {
  const supabase = createClient(context);
  return await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'magiclink',
  });
};
