import { Role, Team, User } from '@prisma/client';
import { ProjectIncludeRootFrame } from './project';

export type TeamMemberType = User & { role: Role };
export type GetTeamResponseType = Team & {
  /**
   * The number of users in the team.
   */
  userCount: number;
  members: TeamMemberType[];
  projects: ProjectIncludeRootFrame[];
};

export type GetTeamResponse = GetTeamResponseType | { error: string };
export type GetTeamsResponse = GetTeamResponseType[] | { error: string };

export type InviteUserRequest = {
  teamId: string;
  email: string;
  role: Role;
};
export type RemoveUserRequest = { teamId: string; userId: string };
export type InvitedUserResponse =
  | Pick<TeamMemberType, 'email' | 'role'>
  | { error: string };
export type RemoveMemberResponse = { bye: 'felicia' } | { error: string };

export type EditUserRoleRequest = {
  teamId: string;
  userId: string;
  role: Role;
};
export type EditUserRoleResponse =
  | Pick<TeamMemberType, 'role'>
  | { error: string };

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
  /**
   * Leave the team.
   * @param teamId The ID of the team to leave.
   * @returns An error message if there was an error leaving the team.
   */
  leaveTeam: (teamId: string) => Promise<RemoveMemberResponse>;
  /**
   * Invite a user to the team.
   */
  inviteUser: (body: InviteUserRequest) => Promise<InvitedUserResponse>;
  /**
   * Remove a user from the team.
   */
  removeUser: (body: RemoveUserRequest) => Promise<RemoveMemberResponse>;
  /**
   * Edit the role of a user in the team.
   */
  editUserRole: (body: EditUserRoleRequest) => Promise<EditUserRoleResponse>;
};
