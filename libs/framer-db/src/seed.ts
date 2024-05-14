import {
  seedSubscriptionPlans,
  signupUser,
} from '@framer/FramerServerSDK/server';
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

const getOrCreateUserSupabaseAuth = async (
  email: string
): Promise<{
  id: string;
  email: string;
}> => {
  const supabaseUser = await supabase.auth.admin.createUser({
    email,
  });

  if (supabaseUser.error?.code === 'email_exists') {
    const users = await supabase.auth.admin.listUsers();
    const existingUser = users.data.users.find((user) => user.email === email);
    if (!existingUser || !existingUser.email) {
      throw new Error(`Could not find user with email ${email}`);
    }
    return {
      id: existingUser.id,
      email: existingUser.email,
    };
  }

  const newUser = supabaseUser.data.user;
  if (!newUser || !newUser.email) {
    throw new Error('No user returned from Supabase');
  }

  return {
    id: newUser.id,
    email: newUser.email,
  };
};

const createPublicBucket = async () => {
  // TODO: If it already exists dont create it again
  // Note: The `frames` bucket NEEDS to match up directly with what we have in the migrations.sql files.
  // otherwise the RLS won't work.
  const { data, error } = await supabase.storage.createBucket('frames', {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/*'],
  });
  if (error) {
    console.error('Error creating bucket:', error);
    return;
  }
  return data;
};

async function main() {
  // Create a supabase bucket if it doesn't exist
  await createPublicBucket();

  const createSubscriptionPlansData = await seedSubscriptionPlans(prisma);
  console.log('Created subscription plans:', createSubscriptionPlansData);
  for (const user of usersToCreate) {
    // We need to create the user in Supabase Auth, or get it if it already exists so we can map the id.
    const supabaseAuth = await getOrCreateUserSupabaseAuth(user.email);

    // This creates a user in the public database, and maps it to the one in the supabase auth.
    const createdUser = await signupUser(prisma, user, {
      id: supabaseAuth.id,
      email: supabaseAuth.email,
    });
    if ('error' in createdUser) {
      console.error('Error creating user:', createdUser.error);
      return;
    }
  }

  const assignToTeam = async () => {
    // Assign Blayne to Alex's team
    const alex = await prisma.user.findUnique({
      where: {
        email: usersToCreate[1].email,
      },
      include: {
        teams: true,
      },
    });
    const blayne = await prisma.user.findUnique({
      where: {
        email: usersToCreate[0].email,
      },
      include: {
        teams: true,
      },
    });
    if (!alex || !blayne) {
      throw new Error('Could not find users');
    }
    const updatedTeam = await prisma.userTeam.upsert({
      where: {
        userId_teamId: {
          userId: blayne.id,
          teamId: alex.teams[0].teamId,
        },
      },
      create: {
        userId: blayne.id,
        teamId: alex.teams[0].teamId,
      },
      update: {},
    });
    console.log('--- updatedTeam', updatedTeam);

    const updatedTeam2 = await prisma.userTeam.upsert({
      where: {
        userId_teamId: {
          userId: alex.id,
          teamId: blayne.teams[0].teamId,
        },
      },
      create: {
        userId: alex.id,
        teamId: blayne.teams[0].teamId,
      },
      update: {},
    });
    console.log('--- updatedTeam2', updatedTeam2);
  };

  await assignToTeam();
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
