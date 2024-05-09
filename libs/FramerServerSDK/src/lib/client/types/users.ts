import { User } from '@prisma/client';

export type FindUsersRequestQueries = {
  id?: string;
  email?: string;
};

export type FindUsersResponseType = Pick<User, 'id' | 'email' | 'displayName'>;

export type FindUsersResponse = FindUsersResponseType[] | { error: string };

/**
 * Exposed methods for the users SDK.
 */
export type UsersSDKType = {
  /**
   * Return all users by either their id or email. One must be supplied.
   *
   * @param queries id, email
   * @returns User | { error: string}
   */
  find: (queries: FindUsersRequestQueries) => Promise<FindUsersResponse>;
};
