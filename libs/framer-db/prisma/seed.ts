import { seedSubscriptionPlans, signupUser } from '@framer/FramerServerSDK';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const createSubscriptionPlansData = await seedSubscriptionPlans(prisma);
  console.log('Created subscription plans:', createSubscriptionPlansData);

  const createdUser = await signupUser(
    prisma,
    {
      firstName: 'Blayne',
      lastName: 'Marjama',
      displayName: 'blayne.marjama',
    },
    {
      id: '123',
      email: 'blayne.marjama@gmail.com',
    }
  );
  if ('error' in createdUser) {
    console.error('Error creating user:', createdUser.error);
    return;
  }
  console.log('Created user:', createdUser);
  // Create the contract
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
