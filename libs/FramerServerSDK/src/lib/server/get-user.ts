import { PrismaClient, User } from '@prisma/client';

/**
 * Returns the User object from our database, given the user's email.
 */
export const getUserFromEmail = async (
  prisma: PrismaClient,
  userEmail: string
): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
