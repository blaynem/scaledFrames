import { PrismaClient, SubscriptionType } from '@prisma/client';

/**
 * Creates the subscription plans in the database.
 *
 * Mostly used for seeding the database.
 * @param prisma
 * @returns
 */
export const seedSubscriptionPlans = async (prisma: PrismaClient) => {
  const freePlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Free',
      description: 'Free plan',
      price: 0,
      subscriptionType: SubscriptionType.Free,
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Pro',
      description: 'Pro plan',
      price: 10,
      subscriptionType: SubscriptionType.Pro,
    },
  });

  const enterprisePlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Enterprise',
      description: 'Enterprise plan',
      price: 100,
      subscriptionType: SubscriptionType.Enterprise,
    },
  });

  return { freePlan, proPlan, enterprisePlan };
};
