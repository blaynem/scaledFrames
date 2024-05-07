/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseClient() {
  return createBrowserClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!
  );
}

/**
 * Client side helper to get the supabase session.
 * @returns Session | null
 */
export const getSession = async () => {
  const supabase = createSupabaseClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    return null;
  }
  return data.session;
};
