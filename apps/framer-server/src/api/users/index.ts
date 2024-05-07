import {
  GetUsersRequestQueries,
  GetUsersResponse,
  UserSignupRequestBody,
  signupUser,
  UserSignupResponse,
  decodeJwt,
  getUserFromEmail,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersInstance = new Frog();

usersInstance.get('/', async (c) => {
  try {
    const id = c.req.query('id');
    const email = c.req.query('email');
    const queries: GetUsersRequestQueries = { id, email };

    const user = await prisma.user.findMany({
      where: {
        ...queries,
      },
    });

    if (!user) {
      return c.json<GetUsersResponse>({ error: 'User not found' });
    }

    const response: GetUsersResponse = user.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
    }));

    return c.json<GetUsersResponse>(response);
  } catch (error) {
    console.error('Get Users Error: ', error);
    return c.json<GetUsersResponse>({ error: 'Error fetching user' });
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
