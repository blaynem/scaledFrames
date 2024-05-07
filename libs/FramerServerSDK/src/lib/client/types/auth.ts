export type RequestOTPRequestBody = {
  email: string;
};

export type VerifyOTPRequestBody = {
  email: string;
  otp: string;
};

export type RequestOTPResponseBody = { message: string } | { error: string };
export type VerifyOTPResponseBody =
  | {
      session: {
        accessToken: string;
        expiresIn: number;
        refreshToken: string;
      };
      user: {
        id: string;
        email: string;
      };
    }
  | { error: string };

export type AuthSDKType = {
  /**
   * Request an OTP to be sent to the user's email.
   */
  requestOTP: (body: RequestOTPRequestBody) => Promise<RequestOTPResponseBody>;
  /**
   * Verify the OTP sent to the user's email.
   */
  verifyOTP: (body: VerifyOTPRequestBody) => Promise<VerifyOTPResponseBody>;
};
