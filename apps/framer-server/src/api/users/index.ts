import {
  GetUsersRequestQueries,
  GetUsersResponse,
  UserSignupRequestBody,
  signupUser,
  UserSignupResponse,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersFrogInstance = new Frog();

usersFrogInstance.get('/', async (c) => {
  const id = c.req.query('id');
  const email = c.req.query('email');
  const queries: GetUsersRequestQueries = { id, email };
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: queries.id,
        email: queries.email,
      },
    });

    if (!user) {
      return c.json<GetUsersResponse>({ error: 'User not found' });
    }

    return c.json<GetUsersResponse>(user);
  } catch (error) {
    console.log('Get Users Error: ', error);
    return c.json<GetUsersResponse>({ error: 'Error fetching user' });
  }
});

usersFrogInstance.post('/signup', async (c) => {
  const body = await c.req.json<UserSignupRequestBody>();
  try {
    const returnedData = await signupUser(prisma, body);

    return c.json<UserSignupResponse>(returnedData);
  } catch (error) {
    console.log('Create User Error: ', error);
    return c.json<UserSignupResponse>({ error: 'Error creating user' });
  }
});

export default usersFrogInstance;
