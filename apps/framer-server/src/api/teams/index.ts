import { decodeJwt } from '@framer/FramerServerSDK/server';
import prisma from '../../prismaClient';
import { Frog } from 'frog';
import {
  GetTeamResponseType,
  GetTeamsResponse,
} from 'libs/FramerServerSDK/src/lib/client/types/teams';

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
      ...u.team,
      userCount: u.team._count.users,
      members: u.team.users.map((u) => u.user),
      projects: u.team.Projects,
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
      ...data.team,
      userCount: data.team._count.users,
      members: data.team.users.map((u) => u.user),
      projects: data.team.Projects,
    };

    return c.json<GetTeamResponseType>(response);
  } catch (error) {
    console.error('Get Team Error: ', error);
    return c.json<GetTeamsResponse>({ error: 'Error fetching team' });
  }
});

export default teamsInstance;
