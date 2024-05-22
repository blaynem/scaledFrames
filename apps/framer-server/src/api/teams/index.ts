import prisma from '../../prismaClient';
import { Frog } from 'frog';
import { Role } from '@prisma/client';
import { getRolePermissions } from '@framer/FramerServerSDK';
import {
  GetTeamsResponse,
  GetTeamResponseType,
  ProjectIncludeRootFrame,
  RemoveMemberResponse,
  RemoveUserRequest,
  InviteUserRequest,
  InvitedUserResponse,
  EditUserRoleRequest,
  EditUserRoleResponse,
} from '@framer/FramerServerSDK/client';
import { decodeJwt } from '@framer/FramerServerSDK/server';

// Instantiate a new Frog instance that we export to be used in the router above.
const teamsInstance = new Frog();

teamsInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const teams = await prisma.userTeam.findMany({
      where: {
        user: {
          email,
        },
      },
      include: {
        team: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
            Projects: {
              include: {
                rootFrame: {
                  include: {
                    intents: true,
                  },
                },
              },
            },
            users: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
      },
    });

    if (!teams) {
      return c.json<GetTeamsResponse>({ error: 'No Teams found' });
    }

    const response: GetTeamResponseType[] = teams.map((u) => ({
      id: u.team.id,
      name: u.team.name,
      createdAt: u.team.createdAt,
      customSubDomain: u.team.customSubDomain,
      updatedAt: u.team.updatedAt,
      subscriptionId: u.team.subscriptionId,
      isDeleted: u.team.isDeleted,
      ownerId: u.team.ownerId,
      userCount: u.team._count.users,
      members: u.team.users.map((_m) => {
        return {
          ..._m.user,
          role: _m.role,
        };
      }),
      subscription: u.team.subscription,
      projects: u.team.Projects as ProjectIncludeRootFrame[], // Overrides the rootFrame type being null.
    }));

    return c.json<GetTeamsResponse>(response);
  } catch (error) {
    console.error('Get Teams Error: ', error);
    return c.json<GetTeamsResponse>({ error: 'Error fetching teams' });
  }
});

teamsInstance.get('/:teamId', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);
    const teamId = c.req.param('teamId');

    const data = await prisma.userTeam.findFirst({
      where: {
        user: {
          email,
        },
        teamId,
      },
      include: {
        team: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
            Projects: {
              include: {
                rootFrame: {
                  include: {
                    intents: true,
                  },
                },
              },
            },
            users: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return c.json<GetTeamsResponse>({ error: 'No Team found' });
    }

    const response: GetTeamResponseType = {
      id: data.team.id,
      name: data.team.name,
      createdAt: data.team.createdAt,
      customSubDomain: data.team.customSubDomain,
      updatedAt: data.team.updatedAt,
      subscriptionId: data.team.subscriptionId,
      isDeleted: data.team.isDeleted,
      ownerId: data.team.ownerId,
      userCount: data.team._count.users,
      members: data.team.users.map((u) => {
        return {
          ...u.user,
          role: u.role,
        };
      }),
      subscription: data.team.subscription,
      projects: data.team.Projects as ProjectIncludeRootFrame[], // Overrides the rootFrame type being null.
    };

    return c.json<GetTeamResponseType>(response);
  } catch (error) {
    console.error('Get Team Error: ', error);
    return c.json<GetTeamsResponse>({ error: 'Error fetching team' });
  }
});

teamsInstance.post('/:teamId/leave', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { id: userId } = await decodeJwt(token);
    const teamId = c.req.param('teamId');

    const userTeam = await prisma.userTeam.findFirst({
      where: {
        user: {
          id: userId,
        },
        teamId,
      },
      include: {
        team: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!userTeam) {
      return c.json<RemoveMemberResponse>({ error: 'Team or user not found.' });
    }

    // If is owner, return error.
    if (userTeam.role === Role.Owner) {
      return c.json<RemoveMemberResponse>({
        error: 'Owner cannot leave team. Transfer ownership first.',
      });
    }

    await prisma.userTeam.deleteMany({
      where: {
        userId,
        teamId,
      },
    });

    return c.json<RemoveMemberResponse>({ bye: 'felicia' });
  } catch (error) {
    console.error('Leave Team Error: ', error);
    return c.json<RemoveMemberResponse>({ error: 'Error leaving team' });
  }
});

teamsInstance.post('/:teamId/remove', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email, id } = await decodeJwt(token);
    const teamId = c.req.param('teamId');
    const { userId: targetUserId } = await c.req.json<RemoveUserRequest>();

    // If the user is trying to remove themselves, they should use the leave endpoint.
    if (id === targetUserId) {
      return c.json<RemoveMemberResponse>({
        error: 'Please use the leave endpoint instead.',
      });
    }

    const userTeamData = await prisma.userTeam.findFirst({
      where: {
        user: {
          email,
        },
        teamId,
      },
      include: {
        user: true,
        team: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
            owner: true,
          },
        },
      },
    });
    if (!userTeamData) {
      return c.json<RemoveMemberResponse>({ error: 'Team or user not found.' });
    }

    // If the target user is not found, return an error.
    const targetUser = userTeamData.team.users.find(
      (u) => u.user.id === targetUserId
    );
    if (!targetUser) {
      return c.json<RemoveMemberResponse>({ error: 'Target not found' });
    }

    // Now that we have the users role, we can determine what they can do.
    const permissions = getRolePermissions(userTeamData.role);

    // If the user is not allowed to remove the target, return an error.
    if (!permissions.canRemoveTarget(targetUser.role)) {
      return c.json<RemoveMemberResponse>({
        error: 'You do not have permission to remove this user.',
      });
    }

    await prisma.userTeam.deleteMany({
      where: {
        userId: targetUserId,
        teamId,
      },
    });

    return c.json<RemoveMemberResponse>({ bye: 'felicia' });
  } catch (error) {
    console.error('Remove User Error: ', error);
    const message =
      error instanceof Error ? error.message : 'Error removing user';
    return c.json<RemoveMemberResponse>({
      error: `Error removing user: ${message}`,
    });
  }
});

teamsInstance.post('/:teamId/invite', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);
    const teamId = c.req.param('teamId');
    const { email: targetEmail, role: targetRole } =
      await c.req.json<InviteUserRequest>();

    const userTeamData = await prisma.userTeam.findFirst({
      where: {
        user: {
          email,
        },
        teamId,
      },
      include: {
        user: true,
        team: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
            owner: true,
          },
        },
      },
    });

    if (!userTeamData) {
      return c.json<RemoveMemberResponse>({ error: 'Team or user not found.' });
    }

    // If target user is already in the team, return success
    if (userTeamData.team.users.find((u) => u.user.email === targetEmail)) {
      return c.json<InvitedUserResponse>({
        email: targetEmail,
        role: targetRole,
      });
    }

    // Now that we have the users role, we can determine what they can do.
    const permissions = getRolePermissions(userTeamData.role);

    // If the user is not allowed to invite, return an error.
    if (!permissions.canEditTeam) {
      return c.json<InvitedUserResponse>({
        error: 'You do not have permission to invite users.',
      });
    }

    const targetUserDb = await prisma.user.findFirst({
      where: {
        email: targetEmail,
      },
    });

    if (!targetUserDb) {
      return c.json<InvitedUserResponse>({
        error: 'User not found in database. Please ask them to sign up first.',
      });
    }

    // TODO: Set up the actual invite flow, replacing the direct add.

    // TEMP: We add the user to the team directly for now.
    await prisma.userTeam.create({
      data: {
        role: targetRole,
        teamId,
        userId: targetUserDb.id,
      },
    });
    // // Add the user to the invites for the team.
    // await prisma.invites.create({
    //   data: {
    //     role: targetRole,
    //     teamId,
    //     email: targetEmail,
    //   },
    // });
    // // Send out the email invite.

    return c.json<InvitedUserResponse>({
      email: targetEmail,
      role: targetRole,
    });
  } catch (error) {
    console.error('Invite User Error: ', error);
    return c.json<InvitedUserResponse>({ error: 'Error inviting user' });
  }
});

teamsInstance.post('/:teamId/edit-role', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);
    const teamId = c.req.param('teamId');
    const { userId: targetUserId, role: targetRole } =
      await c.req.json<EditUserRoleRequest>();

    const userTeamData = await prisma.userTeam.findFirst({
      where: {
        user: {
          email,
        },
        teamId,
      },
      include: {
        user: true,
        team: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
            owner: true,
          },
        },
      },
    });

    if (!userTeamData?.team.users) {
      return c.json<EditUserRoleResponse>({ error: 'User or team not found' });
    }

    // Find the target user in the team.
    const targetUser = userTeamData.team.users.find(
      (u) => u.user.id === targetUserId
    );
    if (!targetUser) {
      return c.json<EditUserRoleResponse>({ error: 'Target user not found' });
    }

    // Get permissions for the user based on their role
    const userPermissions = getRolePermissions(userTeamData.role);

    // Whether the user can edit the target user's role.
    if (!userPermissions.canEditTargetsRole(targetUser.role)) {
      return c.json<EditUserRoleResponse>({
        error: 'You do not have permission to edit this user.',
      });
    }

    await prisma.userTeam.updateMany({
      where: {
        userId: targetUserId,
        teamId,
      },
      data: {
        role: targetRole,
      },
    });

    return c.json<EditUserRoleResponse>({ role: targetRole });
  } catch (error) {
    console.error('Edit User Role Error: ', error);
    return c.json<EditUserRoleResponse>({ error: 'Error editing user role' });
  }
});

export default teamsInstance;
