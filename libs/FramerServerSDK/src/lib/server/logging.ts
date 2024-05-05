import { PrismaClient } from '@prisma/client';

/**
 * Logs an error to the database.
 *
 * Should be fired and forgotten.
 */
export const logError = async ({
  prisma,
  error,
  errorType,
}: {
  prisma: PrismaClient;
  error: any;
  errorType: LOG_ERROR_TYPES;
}) => {
  const message = (error as Error)?.message || 'Error signing up user.';
  const stackTrace = (error as Error)?.stack || '';
  return await prisma.errorLog.create({
    data: {
      errorType,
      message,
      stackTrace,
    },
  });
};

export enum LOG_ERROR_TYPES {
  CONSUMER_FETCH_FRAME = 'Consumer Fetch Frame Error',
  FRAME_CREATE = 'Frame Create Error',
  FRAME_UPDATE = 'Frame Update Error',
  PROJECT_CREATE = 'Project Create Error',
  PROJECT_UPDATE = 'Project Update Error',
  USER_SIGNUP = 'User Signup Error',
  USER_CREATE = 'User Create Error',
}

export const LOG_ACTIONS = {
  FrameCreated: 'Frame created',
  FrameUpdated: 'Frame updated',
  ProjectCreated: 'Project created',
  ProjectUpdated: 'Project updated',
  UserCreated: 'User created',
};
export const LOG_DESCRIPTIONS = {
  FrameCreated: 'User created a frame',
  FrameUpdated: 'User updated a frame',
  ProjectCreated: 'User created a project',
  ProjectUpdated: 'User updated a project',
  UserCreated: 'User created their account',
};

/**
 * Logs an activity to the database.
 *
 * Should be fired and forgotten.
 */
export const logActivity = async (
  prisma: PrismaClient,
  {
    action,
    description,
    userId,
  }: {
    action: string;
    description: string;
    userId: string;
  }
) => {
  return await prisma.activityLog.create({
    data: {
      userId,
      action,
      description,
    },
  });
};
