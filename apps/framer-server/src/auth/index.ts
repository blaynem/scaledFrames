import { Frog } from 'frog';
import { createClient } from '../supabaseClient';
import {
  Session as AuthSession,
  User as AuthUser,
} from '@supabase/supabase-js';

const authApi = new Frog();

type RequestOTPRequestBody = {
  email: string;
};

type VerifyOTPRequestBody = {
  email: string;
  otp: string;
};

type RequestOTPResponseBody = { message: string } | { error: string };
//  TODO: Determine what should actually be returned here.
type VerifyOTPResponseBody =
  | {
      session: AuthSession | null;
      user: AuthUser | null;
    }
  | { error: string };

authApi.post('/request-otp', async (c) => {
  try {
    const supabase = createClient(c);
    const { email } = await c.req.json<RequestOTPRequestBody>();
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      throw new Error('Error requesting OTP');
    }
    return c.json<RequestOTPResponseBody>({ message: 'Request OTP' });
  } catch (error) {
    console.log('Error requesting OTP: ', error);
    return c.json<RequestOTPResponseBody>({ error: 'Error requesting OTP' });
  }
});

authApi.post('/verify-otp', async (c) => {
  try {
    const body = await c.req.json<VerifyOTPRequestBody>();
    const supabase = createClient(c);
    const { data, error } = await supabase.auth.verifyOtp({
      email: body.email,
      token: body.otp,
      type: 'magiclink',
    });

    // TODO: Run through Create user flow if they don't exist.
    console.log('---data', data);

    if (error) {
      throw new Error('Error verifying OTP');
    }
    return c.json<VerifyOTPResponseBody>({
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.log('Error verifying OTP: ', error);
    return c.json<VerifyOTPResponseBody>({ error: 'Error verifying OTP' });
  }
});

export default authApi;
