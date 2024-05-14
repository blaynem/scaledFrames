import {
  GetUserResponse,
  GetUserResponseType,
  UserSignupRequestBody,
  UserSignupResponse,
} from '@framer/FramerServerSDK/client';
import {
  decodeJwt,
  getUserFromEmail,
  signupUser,
} from '@framer/FramerServerSDK/server';
import { Frog } from 'frog';
import prisma from '../../prismaClient';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersInstance = new Frog();

usersInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        teams: {
          include: {
            team: {
              include: {
                _count: {
                  select: {
                    users: true,
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
              },
            },
          },
        },
      },
    });

    if (!user) {
      return c.json<GetUserResponse>({ error: 'User not found' });
    }

    const response: GetUserResponseType = {
      ...user,
      teams: user.teams.map((t) => ({
        ...t.team,
        projects: t.team.Projects,
        userCount: Number(t.team._count.users),
      })),
      projects: user.teams.map((t) => t.team.Projects).flat(),
    };

    return c.json<GetUserResponse>(response);
  } catch (error) {
    console.error('Get Users Error: ', error);
    return c.json<GetUserResponse>({ error: 'Error fetching user' });
  }
});

usersInstance.post('/signup', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email, id } = await decodeJwt(token);

    const body = await c.req.json<UserSignupRequestBody>();

    const returnedData = await signupUser(prisma, body, { email, id });
    return c.json<UserSignupResponse>(returnedData);
  } catch (error) {
    console.error('Create User Error: ', error);
    return c.json<UserSignupResponse>({ error: 'Error creating user' });
  }
});

export default usersInstance;
