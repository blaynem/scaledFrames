import { Frog } from 'frog';
import { createClient } from '../supabaseClient';
import {
  LOG_ERROR_TYPES,
  logError,
} from 'libs/FramerServerSDK/src/lib/server/logging';
import prisma from '../prismaClient';
import {
  RequestOTPRequestBody,
  RequestOTPResponseBody,
  VerifyOTPRequestBody,
  VerifyOTPResponseBody,
} from '@framer/FramerServerSDK';

const authApi = new Frog();

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
    console.error('Error requesting OTP: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.OTP_REQUEST,
    });
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

    if (error || !data.session || !data.user) {
      throw new Error('Error verifying OTP');
    }

    const response: VerifyOTPResponseBody = {
      session: {
        accessToken: data.session.access_token,
        expiresIn: data.session.expires_in,
        refreshToken: data.session.refresh_token,
      },
      user: {
        id: data.user.id,
        email: data.user.email ?? body.email,
      },
    };
    return c.json<VerifyOTPResponseBody>(response);
  } catch (error) {
    console.error('Error verifying OTP: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.OTP_VERIFY,
    });
    return c.json<VerifyOTPResponseBody>({ error: 'Error verifying OTP' });
  }
});

export default authApi;
