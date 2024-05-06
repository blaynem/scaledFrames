import { seedSubscriptionPlans, signupUser } from '@framer/FramerServerSDK';
import prisma from './prismaClient';
import supabase from './supabaseClient';

const usersToCreate = [
  {
    firstName: 'Blayne',
    lastName: 'Marjama',
    displayName: 'blayne.marjama',
    email: 'blayne.marjama@gmail.com',
  },
  {
    firstName: 'Alex',
    lastName: 'Bergvall',
    displayName: 'bergvall95',
    email: 'alex.bergvall@gmail.com',
  },
];

const getOrCreateUser = async (email: string) => {
  const supabaseUser = await supabase.auth.admin.createUser({
    email,
  });

  if (supabaseUser.error?.code === 'email_exists') {
    const users = await supabase.auth.admin.listUsers();
    const existingUser = users.data.users.find((user) => user.email === email);
    if (!existingUser) {
      throw new Error(`Could not find user with email ${email}`);
    }
    return existingUser;
  }

  const user = supabaseUser.data.user;
  if (!user) {
    throw new Error('No user returned from Supabase');
  }

  return user;
};

async function main() {
  const createSubscriptionPlansData = await seedSubscriptionPlans(prisma);
  console.log('Created subscription plans:', createSubscriptionPlansData);
  for (const user of usersToCreate) {
    // We need to create the user in Supabase Auth, or get it if it already exists so we can map the id.
    const authUser = await getOrCreateUser(user.email);
    console.log('Created user:', authUser);

    // This creates a user in the public database, and maps it to the one in the supabase auth.
    const createdUser = await signupUser(prisma, user, {
      id: authUser.id,
      email: user.email,
    });
    if ('error' in createdUser) {
      console.error('Error creating user:', createdUser.error);
      return;
    }
    console.log('Created user:', createdUser);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
