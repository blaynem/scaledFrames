import {
  FindUsersRequestQueries,
  FindUsersResponse,
  FindUsersResponseType,
  decodeJwt,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';

// Instantiate a new Frog instance that we export to be used in the router above.
const usersInstance = new Frog();

usersInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const _ = await decodeJwt(token);

    const id = c.req.query('id');
    const email = c.req.query('email');
    const queries: FindUsersRequestQueries = { id, email };
    // throw if no queries
    if (!id && !email) {
      return c.json<FindUsersResponse>({ error: 'No query provided' });
    }

    const users = await prisma.user.findMany({
      where: {
        ...queries,
      },
    });

    if (!users) {
      return c.json<FindUsersResponse>({ error: 'No Users found' });
    }

    const response: FindUsersResponseType[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
    }));

    return c.json<FindUsersResponse>(response);
  } catch (error) {
    console.error('Get Users Error: ', error);
    return c.json<FindUsersResponse>({ error: 'Error fetching user' });
  }
});

export default usersInstance;
