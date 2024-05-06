import {
  GetUsersRequestQueries,
  GetUsersResponse,
  UserSignupRequestBody,
  signupUser,
  UserSignupResponse,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';
import { createClient } from '../../supabaseClient';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersInstance = new Frog();

usersInstance.get('/', async (c) => {
  try {
    const id = c.req.query('id');
    const email = c.req.query('email');
    const queries: GetUsersRequestQueries = { id, email };
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
    console.error('Get Users Error: ', error);
    return c.json<GetUsersResponse>({ error: 'Error fetching user' });
  }
});

usersInstance.post('/signup', async (c) => {
  try {
    const supabase = createClient(c);
    // Gets the supabase auth user via headers on the request.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw new Error('Error getting auth user');
    }

    const { email, id } = data.user;
    if (!email || !id) {
      throw new Error('Missing email or id in auth user.');
    }

    const body = await c.req.json<UserSignupRequestBody>();
    if (!body.displayName) {
      throw new Error('Missing displayName in request body.');
    }

    const returnedData = await signupUser(prisma, body, {
      id,
      email,
    });

    return c.json<UserSignupResponse>(returnedData);
  } catch (error) {
    console.error('Create User Error: ', error);
    return c.json<UserSignupResponse>({ error: 'Error creating user' });
  }
});

export default usersInstance;
