import { Team, User } from '@prisma/client';
import { ProjectIncludeRootFrame } from './project';

export type GetTeamResponseType = Team & {
  /**
   * The number of users in the team.
   */
  userCount: number;
  members: User[];
  projects: ProjectIncludeRootFrame[];
};

export type GetTeamResponse = GetTeamResponseType | { error: string };
export type GetTeamsResponse = GetTeamResponseType[] | { error: string };

/**
 * Exposed methods for the Team SDK.
 */
export type TeamsSDKType = {
  /**
   * Get all Teams data for the signed in user.
   */
  getAll: () => Promise<GetTeamsResponse>;
  /**
   * Get a Team by ID.
   * @param teamId  The ID of the Team to get.
   * @returns The Team with the given ID.
   */
  getById: (teamId: string) => Promise<GetTeamResponse>;
};
