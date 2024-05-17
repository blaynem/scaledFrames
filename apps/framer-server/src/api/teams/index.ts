import { decodeJwt } from '@framer/FramerServerSDK/server';
import prisma from '../../prismaClient';
import { Frog } from 'frog';
import {
  GetTeamResponseType,
  GetTeamsResponse,
} from 'libs/FramerServerSDK/src/lib/client/types/teams';
import { ProjectIncludeRootFrame } from '@framer/FramerServerSDK/client';

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
      projects: data.team.Projects as ProjectIncludeRootFrame[], // Overrides the rootFrame type being null.
    };

    return c.json<GetTeamResponseType>(response);
  } catch (error) {
    console.error('Get Team Error: ', error);
    return c.json<GetTeamsResponse>({ error: 'Error fetching team' });
  }
});

export default teamsInstance;
