import { Role, SubscriptionType } from '@prisma/client';

type RolePermissionsType = {
  /**
   * A function that will be called to determine if the users role has permissions to remove the member with the target role.
   * @param targetRole - The role of the team member to be removed.
   */
  canRemoveTarget: (targetRole: Role) => boolean;
  /**
   * A method to determine if the user can edit a role of a team member.
   * @param targetRole - The role of the team member.
   */
  canEditTargetsRole: (targetRole: Role) => boolean;
  /**
   * If true, the user is able to alter anything team related.
   *
   * Includes
   * - Inviting, removing, and editing roles of team members.
   * - Changing team settings.
   * -
   * This includes changing the team name, custom subdomain, etc.
   *
   */
  canEditTeam: boolean;
  /**
   * If true, the user is able to alter anything subscription related.
   */
  canEditSubscription: boolean;
  /**
   * If true, the user is able to alter anything project related.
   *
   * This includes creating, editing, and deleting projects. Editing settings.
   * Does not include team member permissions.
   */
  canEditProject: boolean;
  /**
   * If true, the user is able to delete the project.
   */
  canDeleteProject: boolean;
};

const lowestRolePermissions: RolePermissionsType = {
  canRemoveTarget: () => false,
  canEditTargetsRole: () => false,
  canEditTeam: false,
  canEditSubscription: false,
  canEditProject: false,
  canDeleteProject: false,
};

export const getRolePermissions = (callersRole: Role): RolePermissionsType => {
  switch (callersRole) {
    case Role.Owner:
      return {
        canDeleteProject: true,
        canRemoveTarget: (targetRole: Role) =>
          ([Role.Admin, Role.Member, Role.Viewer] as Role[]).includes(
            targetRole
          ),
        canEditTargetsRole: (role: Role) => true,
        canEditTeam: true,
        canEditSubscription: true,
        canEditProject: true,
      } satisfies RolePermissionsType;
    case Role.Admin:
      return {
        canRemoveTarget: (targetRole: Role) =>
          ([Role.Member, Role.Viewer] as Role[]).includes(targetRole),
        canEditTargetsRole: (role: Role) => role !== Role.Owner,
        canEditTeam: true,
        canEditProject: true,
        canEditSubscription: false,
        canDeleteProject: false,
      } satisfies RolePermissionsType;
    case Role.Member:
      return {
        ...lowestRolePermissions,
        canEditProject: true,
      } satisfies RolePermissionsType;
    default:
      return {
        ...lowestRolePermissions,
      } satisfies RolePermissionsType;
  }
};

export type SubscriptionGatedFeatures = {
  /**
   * If true, then the team is allowed to have and edit the custom subdomain.
   */
  canHaveCustomSubdomain: boolean;
  /**
   * If true, then the team is allowed to have and edit the custom project paths.
   */
  canHaveCustomProjectPaths: boolean;
  /**
   * If true, then the team is allowed to have and edit the custom project fallback.
   */
  canHaveCustomProjectFallback: boolean;
  /**
   * The maximum number of team members that can be in a team.
   */
  maxTeamMembers: number;
  /**
   * If true then only the Teams Owner can edit any project information.
   *
   * This is reserved for non-Free tier customers.
   */
  readonlyMembers: boolean;
  /**
   * If true, then the team has access to the analytics dashboard.
   */
  canViewAnalytics: boolean;
};

/**
 * Gets subscription gated features based on the subscription type.
 * @param subscription
 * @returns
 */
export const getAllowedFeatures = (
  subscription: SubscriptionType
): SubscriptionGatedFeatures => {
  switch (subscription) {
    case SubscriptionType.Pro || SubscriptionType.Enterprise:
      return {
        canHaveCustomSubdomain: true,
        canHaveCustomProjectPaths: true,
        canHaveCustomProjectFallback: true,
        maxTeamMembers: 10,
        readonlyMembers: false,
        canViewAnalytics: true,
      } satisfies SubscriptionGatedFeatures;
    default:
      return {
        canHaveCustomSubdomain: false,
        canHaveCustomProjectPaths: false,
        canHaveCustomProjectFallback: false,
        maxTeamMembers: 3,
        readonlyMembers: true,
        canViewAnalytics: false,
      } satisfies SubscriptionGatedFeatures;
  }
};
