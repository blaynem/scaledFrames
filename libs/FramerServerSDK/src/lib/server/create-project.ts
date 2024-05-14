import { AspectRatio, IntentType, Prisma, PrismaClient } from '@prisma/client';
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
import { AuthUser } from './types';

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
  { teamId, title, notes, description }: CreateProjectRequestBody,
  authUser: AuthUser
): Promise<CreateProjectResponse | { error: string }> => {
  try {
    const createdProject = await prismaClient.$transaction(async (_prisma) => {
      const createdProject = await _prisma.project.create({
        data: {
          title,
          description,
          notes,
          isProjectLive: false,
          // TODO: Need to ensure this is unique.
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
              id: authUser.id,
            },
          },
        },
      });

      const updatedProjectData = await _prisma.frame.create({
        data: {
          path: '/home',
          title: 'Home',
          imageUrl: 'https://placehold.co/600x400',
          aspectRatio: AspectRatio.STANDARD,
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
              id: authUser.id,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: authUser.id,
            },
          },
        },
        select: {
          project: {
            include: {
              rootFrame: {
                include: {
                  intents: true,
                },
              },
              frames: {
                include: {
                  intents: true,
                },
              },
            },
          },
        },
      });
      return updatedProjectData.project;
    });
    logActivity(prismaClient, {
      action: LOG_ACTIONS.ProjectCreated,
      description: LOG_DESCRIPTIONS.ProjectCreated,
      userId: createdProject.lastUpdatedById,
    });
    return createdProject;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        const fields = ((error.meta?.['target'] as string[]) ?? []).join(', ');
        return { error: `Project needs unique fields: ${fields}` };
      }
    }
    console.error('server Create Project Error: ', error);
    logError({
      prisma: prismaClient,
      error,
      errorType: LOG_ERROR_TYPES.PROJECT_CREATE,
    });
    return { error: 'Error creating project' };
  }
};
