import { PrismaClient } from '@prisma/client';

/**
 * Logs an error to the database.
 *
 * Should be fired and forgotten.
 */
export const logError = async (
  {
    errorType,
    message,
    stackTrace,
  }: {
    errorType: string;
    message: string;
    stackTrace?: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.errorLog.create({
    data: {
      errorType,
      message,
      stackTrace,
    },
  });
};

export const LogActions = {
  UserCreated: 'User created',
  ProjectCreated: 'Project created',
  FrameCreated: 'Frame created',
};
export const LogDescriptions = {
  UserCreated: 'User created their account',
  ProjectCreated: 'User created a project',
  FrameCreated: 'User created a frame',
};

/**
 * Logs an activity to the database.
 *
 * Should be fired and forgotten.
 */
export const logActivity = async (
  {
    action,
    description,
    userId,
  }: {
    action: string;
    description: string;
    userId: string;
  },
  prisma: PrismaClient
) => {
  return await prisma.activityLog.create({
    data: {
      userId,
      action,
      description,
    },
  });
};
