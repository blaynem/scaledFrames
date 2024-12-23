import {
  GetUserResponse,
  UserSignupRequestBody,
  UserSignupResponse,
} from '@framer/FramerServerSDK/client';
import { decodeJwt, signupUser } from '@framer/FramerServerSDK/server';
import { Frog } from 'frog';
import prisma from '../../prismaClient';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersInstance = new Frog({
  title: "What's a title?",
  origin: process.env.NEXT_PUBLIC_CLIENT_URL, 
  verifyOrigin: false
});

usersInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return c.json<GetUserResponse>({ error: 'User not found' });
    }

    return c.json<GetUserResponse>(user);
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
