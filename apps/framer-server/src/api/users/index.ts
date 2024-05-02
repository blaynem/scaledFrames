import prisma from '../../prismaClient';
import { Frog } from 'frog';
import { GetUsersRequestQueries, GetUsersResponse } from '../../types';

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

    return c.json<GetUsersResponse>(user);
  } catch (error) {
    console.log('Get Users Error: ', error);
    return c.json<GetUsersResponse>(null);
  }
});

export default usersFrogInstance;
