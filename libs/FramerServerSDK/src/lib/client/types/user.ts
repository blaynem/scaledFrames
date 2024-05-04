import { SubscriptionType, User } from '@prisma/client';

/**
 * Required fields for a user signup
 */
export type UserSignupRequestBody = {
  displayName: string;
  email: string;
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
   * This login should only be called from the Supabase auth client I believe...
   * @param body
   * @returns UserSignupResponse | { error: string}
   */
  signup: (body: UserSignupRequestBody) => Promise<UserSignupResponse>;
};
