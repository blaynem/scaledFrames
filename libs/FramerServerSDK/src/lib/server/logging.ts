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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  errorType: LOG_ERROR_TYPES;
}) => {
  const message = (error as Error)?.message || '_message not available_';
  const stackTrace = (error as Error)?.stack || '_stack trace not available_';
  return await prisma.errorLog.create({
    data: {
      errorType,
      message,
      stackTrace,
    },
  });
};

export enum LOG_ERROR_TYPES {
  INTENT_TRACKING = 'Intent Tracking Error',
  CONSUMER_FETCH_FRAME = 'Consumer Fetch Frame Error',
  FRAME_CREATE = 'Frame Create Error',
  FRAME_UPDATE = 'Frame Update Error',
  PROJECT_CREATE = 'Project Create Error',
  PROJECT_UPDATE = 'Project Update Error',
  USER_SIGNUP = 'User Signup Error',
  USER_CREATE = 'User Create Error',
  OTP_REQUEST = 'OTP Request Error',
  OTP_VERIFY = 'OTP Verify Error',
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
