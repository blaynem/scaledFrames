import { Project, SubscriptionType, Team, User } from '@prisma/client';

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
 *
 * If a user is already signed up, we will return the first team and project we find.
 */
export type UserSignupResponse =
  | {
      userId: string;
      teamId: string;
      projectId: string;
    }
  | { error: string };

export type GetUserResponseType = User & {
  teams: Team[];
  projects: Project[];
};

export type GetUserResponse = GetUserResponseType | { error: string };

/**
 * Exposed methods for the user SDK.
 */
export type UserSDKType = {
  /**
   * Get all user data for the signed in user.
   */
  get: () => Promise<GetUserResponse>;
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
