import { PrismaClient, User } from '@prisma/client';

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
