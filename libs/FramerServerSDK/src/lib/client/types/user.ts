import { SubscriptionType, User } from '@prisma/client';

/**
 * Required fields for a user signup.
 *
 * Id and email are not required as they are grabbed via the Supabase auth client.
 */
export type UserSignupRequestBody = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  /**
   * Defaults to SubscriptionType.Free
   */
  subscriptionType?: SubscriptionType;
};

/**
 * On a user signup, we want to return everything that was created.
 */
export type UserSignupResponse =
  | {
      userId: string;
      teamId: string;
      projectId: string;
    }
  | { error: string };

export type GetUsersRequestQueries = {
  id?: string;
  email?: string;
};

export type GetUsersResponse = User | { error: string };

/**
 * Exposed methods for the users SDK.
 */
export type UsersSDKType = {
  /**
   * Get a user by either the id or email. One must be supplied.
   * @param queries id, email
   * @returns User | { error: string}
   */
  get: (queries: GetUsersRequestQueries) => Promise<GetUsersResponse>;
  /**
   * Signup a user. Creates a user, team, and project.
   *
   * Notes: Signup can only happen after a user has been authenticated via Supabase.
   *       On verify-otp, supabase saves cookies that are used to authenticate the user.
   *
   * @returns UserSignupResponse | { error: string}
   */
  signup: (body: UserSignupRequestBody) => Promise<UserSignupResponse>;
};
