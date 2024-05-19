import { Role } from '@prisma/client';

type PermissionsType = {
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

const lowestPermissions: PermissionsType = {
  canRemoveTarget: () => false,
  canEditTargetsRole: () => false,
  canEditTeam: false,
  canEditSubscription: false,
  canEditProject: false,
  canDeleteProject: false,
};

export const getPermissions = (callersRole: Role): PermissionsType => {
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
      } satisfies PermissionsType;
    case Role.Admin:
      return {
        canRemoveTarget: (targetRole: Role) =>
          ([Role.Member, Role.Viewer] as Role[]).includes(targetRole),
        canEditTargetsRole: (role: Role) => role !== Role.Owner,
        canEditTeam: true,
        canEditProject: true,
        canEditSubscription: false,
        canDeleteProject: false,
      } satisfies PermissionsType;
    case Role.Member:
      return {
        ...lowestPermissions,
        canEditProject: true,
      } satisfies PermissionsType;
    default:
      return {
        ...lowestPermissions,
      } satisfies PermissionsType;
  }
};
