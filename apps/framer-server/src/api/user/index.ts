import {
  GetUserResponse,
  UserSignupRequestBody,
  signupUser,
  UserSignupResponse,
  decodeJwt,
  getUserFromEmail,
  GetUserResponseType,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';

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
                Projects: true,
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
      teams: user.teams.map((t) => t.team),
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
    const { email } = await decodeJwt(token);

    const authUser = await getUserFromEmail(prisma, email);

    const body = await c.req.json<UserSignupRequestBody>();
    if (!body.displayName) {
      throw new Error('Missing displayName in request body.');
    }

    const returnedData = await signupUser(prisma, body, authUser);
    return c.json<UserSignupResponse>(returnedData);
  } catch (error) {
    console.error('Create User Error: ', error);
    return c.json<UserSignupResponse>({ error: 'Error creating user' });
  }
});

export default usersInstance;
