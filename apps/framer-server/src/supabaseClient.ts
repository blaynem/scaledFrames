import dotenv from 'dotenv';
import { createServerClient } from '@supabase/ssr';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

dotenv.config();

// TODO: Fix this typing later. But for now yolo.
// As long as we pass in the Frog / Hono context it works.
export const createClient = (context: any) => {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
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
