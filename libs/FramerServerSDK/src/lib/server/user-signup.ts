import { SubscriptionType, IntentType, PrismaClient } from '@prisma/client';
import { UserSignupRequestBody, UserSignupResponse } from '../client/types';
import { convertToUrlSafe, createUniqueName } from './utils';
import {
  LOG_ERROR_TYPES,
  LOG_ACTIONS,
  logActivity,
  logError,
  LOG_DESCRIPTIONS,
} from './logging';
import { AuthUser } from './types';

/**
 * Signs up a user. If a user already exists, it will return the first team and project they have.
 *
 * Goes through a flow of:
 * - Creating a user
 * - Creating a team
 * - Creating a project
 * - Creating a frame
 *
 *
 * Is a Transaction. Will complete fully or not at all.
 */
export const signupUser = async (
  prismaClient: PrismaClient,
  reqBody: UserSignupRequestBody,
  authUser: Pick<AuthUser, 'id' | 'email'>
): Promise<UserSignupResponse | { error: string }> => {
  try {
    const userAlreadyExists = await prismaClient.user.findUnique({
      where: {
        id: authUser.id,
        email: authUser.email,
      },
      select: {
        id: true,
        teams: {
          include: {
            team: {
              select: {
                id: true,
                Projects: {
                  select: {
                    id: true,
                  },
                  take: 1,
                },
              },
            },
          },
          take: 1,
        },
      },
    });

    if (userAlreadyExists) {
      return {
        teamId: userAlreadyExists.teams[0].team.id,
        projectId: userAlreadyExists.teams[0].team.Projects[0].id,
        userId: userAlreadyExists.id,
      } satisfies UserSignupResponse;
    }

    // NOTE: This is in a transaction. So these all must pass or none will.
    const data = await prismaClient.$transaction(async (_prisma) => {
      const userId = authUser.id;

      const uniqueName = await createUniqueName(_prisma as PrismaClient);
      if (!uniqueName) {
        throw new Error('Could not create unique name.');
      }
      const teamName = uniqueName;
      const projectTitle = `${uniqueName}'s Project`;

      const customSubDomain = convertToUrlSafe(uniqueName);
      const customBasePath = `/${convertToUrlSafe(uniqueName)}`;
      // If there is no subscriptionType, default to Free.
      const _subscriptionType =
        reqBody.subscriptionType || SubscriptionType.Free;

      if (!userId) {
        throw new Error('No id provided.');
      }

      // TODO: This should be cached somewhere, as it should never change.
      const freePlanId = await _prisma.subscriptionPlan.findFirst({
        where: {
          subscriptionType: _subscriptionType,
        },
      });

      if (!freePlanId) {
        throw new Error('No free plan found.');
      }

      const createdUserData = await _prisma.user.create({
        data: {
          id: userId,
          email: authUser.email,
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          displayName: reqBody.displayName,
        },
      });

      const createUserTeam = await _prisma.userTeam.create({
        data: {
          user: {
            connect: {
              id: createdUserData.id,
            },
          },
          team: {
            create: {
              owner: {
                connect: {
                  id: createdUserData.id,
                },
              },
              subscription: {
                create: {
                  endDate: new Date(),
                  autoRenew: true,
                  plan: {
                    connect: {
                      id: freePlanId.id,
                    },
                  },
                },
              },
              name: teamName,
              // We can set this, but we don't display it unless they have a subscription.
              customSubDomain,
            },
          },
        },
      });

      const createdProject = await _prisma.project.create({
        data: {
          title: projectTitle,
          description: 'Placeholder description.',
          notes: 'This is where you can add notes about your project.',
          isProjectLive: false,
          customBasePath,
          customFallbackUrl: '',
          unusedWebhooks: '',
          team: {
            connect: {
              id: createUserTeam.teamId,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: createUserTeam.userId,
            },
          },
        },
      });

      await _prisma.frame.create({
        data: {
          path: '/home',
          title: 'Home',
          imageUrl: 'https://i.imgur.com/CtgycuI.jpeg',
          aspectRatio: 'WIDE',
          intents: {
            createMany: {
              data: [
                {
                  type: IntentType.InternalLink,
                  linkUrl: '/home',
                  displayText: 'Go home',
                  displayOrder: 0,
                },
                {
                  type: IntentType.InternalLink,
                  linkUrl: '/frame2',
                  displayText: 'Frame 2',
                  displayOrder: 1,
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
              id: createUserTeam.teamId,
            },
          },
          createdBy: {
            connect: {
              id: createUserTeam.userId,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: createUserTeam.userId,
            },
          },
        },
      });
      // Create another frame
      await _prisma.frame.create({
        data: {
          path: '/frame2',
          title: 'Frame 2',
          aspectRatio: 'STANDARD',
          imageUrl: 'https://i.imgur.com/KDRXumd.jpeg',
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
              id: createUserTeam.teamId,
            },
          },
          createdBy: {
            connect: {
              id: createUserTeam.userId,
            },
          },
          lastUpdatedBy: {
            connect: {
              id: createUserTeam.userId,
            },
          },
        },
      });
      const returnedData: UserSignupResponse = {
        userId: createdUserData.id,
        teamId: createUserTeam.teamId,
        projectId: createdProject.id,
      };
      return returnedData;
    });
    logActivity(prismaClient, {
      action: LOG_ACTIONS.UserCreated,
      description: LOG_DESCRIPTIONS.UserCreated,
      userId: data.userId,
    });

    return data;
  } catch (error) {
    console.error('Signup User error: ', error);
    logError({
      prisma: prismaClient,
      error,
      errorType: LOG_ERROR_TYPES.USER_SIGNUP,
    });
    return { error: 'Error signing up user.' };
  }
};
