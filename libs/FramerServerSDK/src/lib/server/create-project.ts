import { IntentType, PrismaClient } from '@prisma/client';
import {
  CreateProjectRequestBody,
  CreateProjectResponse,
} from '../client/types';
import { convertToUrlSafe } from './utils';

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
    return prismaClient.$transaction(async (_prisma) => {
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
    // TODO: Add success analytics event
  } catch (error) {
    // TODO: Add error analytics event
    console.error('Create Project Error: ', error);
    return { error: 'Error creating project' };
  }
};
