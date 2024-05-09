'use client';

import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSession } from '@framer/FramerServerSDK/client';

export default function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const doFetch = async () => {
      const session = await getSession();
      console.log('---session', session);

      setSession(session);
    };

    doFetch();
  }, []);

  return session;
}
