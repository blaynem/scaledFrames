import { AspectRatio, IntentType, Prisma, PrismaClient } from '@prisma/client';
import {
  CreateProjectRequestBody,
  CreateProjectResponse,
} from '../../client/types';
import { convertToUrlSafe, getRandomColor } from '../../utils';
import {
  logActivity,
  LOG_ACTIONS,
  logError,
  LOG_ERROR_TYPES,
  LOG_DESCRIPTIONS,
} from '../logging';
import { AuthUser } from '../types';

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
    let customBasePath = `/${convertToUrlSafe(title)}`;
    const checkUniqueProject = await prismaClient.project.findFirst({
      where: {
        customBasePath,
      },
    });
    // If the customBasePath is not unique, add a random string to the end of it
    if (checkUniqueProject) {
      customBasePath = `/${convertToUrlSafe(title)}-${Math.random()
        .toString(36) // Convert to base 36 - ex: '0.g7blh43egv4'
        .slice(2, 6)}`; // Slice to get the first 4 characters - ex: 'g7bl'
    }

    const createdProject = await prismaClient.$transaction(async (_prisma) => {
      const createdProject = await _prisma.project.create({
        data: {
          customBasePath,
          title,
          description,
          notes,
          isProjectLive: false,
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
          path: '/',
          title: 'Home',
          imageUrl: `https://placehold.co/600x600/${getRandomColor()}/white.png`,
          aspectRatio: AspectRatio.STANDARD,
          intents: {
            createMany: {
              data: [
                {
                  type: IntentType.InternalLink,
                  linkUrl: '/',
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
    const response: CreateProjectResponse = {
      ...createdProject,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rootFrame: createdProject.rootFrame!,
      frames: createdProject.frames,
    };
    return response;
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
