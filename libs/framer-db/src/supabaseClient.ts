/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // NOTE THIS IS THE SERVICE ROLE. NEVER EXPOSE THIS TO THE CLIENT. AHHH!!!
  // The reason we can use it here is because this will only ever be run on the server.
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default supabase;
