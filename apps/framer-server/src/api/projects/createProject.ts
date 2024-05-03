import { IntentType } from '@prisma/client';
import prisma from '../../prismaClient';
import {
  CreateProjectRequestBody,
  CreateProjectResponse,
} from 'libs/FramerServerSDK/src/types';

// Create Project builds the initial project and frame for the user.
export const createProject = async ({
  teamId,
  userId,
  title,
  notes,
  description,
}: CreateProjectRequestBody): Promise<CreateProjectResponse> => {
  const createdProject = await prisma.project.create({
    data: {
      title,
      description,
      notes,
      isProjectLive: false,
      customBasePath: '/custom',
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

  const updatedProjectData = await prisma.frame.create({
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
};
