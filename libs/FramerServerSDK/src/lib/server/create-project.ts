import { IntentType, PrismaClient } from '@prisma/client';
import {
  CreateProjectRequestBody,
  CreateProjectResponse,
} from '../client/types';
import { convertToUrlSafe } from './utils';
import {
  logActivity,
  LOG_ACTIONS,
  logError,
  LOG_ERROR_TYPES,
  LOG_DESCRIPTIONS,
} from './logging';

/**
 * Creates a Project and Frame for the user.
 *
 * Is a Transaction. Will complete fully or not at all.
 * @param prismaClient
 * @param param1
 * @returns
 */
export const createProject = async (
  prismaClient: PrismaClient,
  { teamId, userId, title, notes, description }: CreateProjectRequestBody
): Promise<CreateProjectResponse | { error: string }> => {
  try {
    const createdProject = await prismaClient.$transaction(async (_prisma) => {
      const createdProject = await _prisma.project.create({
        data: {
          title,
          description,
          notes,
          isProjectLive: false,
          customBasePath: `/${convertToUrlSafe(title)}`,
          customFallbackUrl: '',
          unusedWebhooks: '',
          team: {
            connect: {
              id: teamId,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });

      const updatedProjectData = await _prisma.frame.create({
        data: {
          path: '/home',
          title: 'Home',
          imageUrl: 'https://placehold.co/600x400',
          intents: {
            createMany: {
              data: [
                {
                  type: IntentType.InternalLink,
                  linkUrl: '/home',
                  displayText: 'Go home',
                  displayOrder: 0,
                },
              ],
            },
          },
          rootFrameOfProjects: {
            connect: {
              id: createdProject.id,
            },
          },
          project: {
            connect: {
              id: createdProject.id,
            },
          },
          team: {
            connect: {
              id: teamId,
            },
          },
          createdBy: {
            connect: {
              id: userId,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          project: true,
        },
      });
      return updatedProjectData.project;
    });
    logActivity(prismaClient, {
      action: LOG_ACTIONS.UserCreated,
      description: LOG_DESCRIPTIONS.UserCreated,
      userId: createdProject.lastUpdatedById,
    });
    return createdProject;
  } catch (error) {
    console.error('Create Project Error: ', error);
    logError({
      prisma: prismaClient,
      error,
      errorType: LOG_ERROR_TYPES.USER_SIGNUP,
    });
    return { error: 'Error creating project' };
  }
};
