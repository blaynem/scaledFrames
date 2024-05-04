import { SubscriptionType, IntentType, PrismaClient } from '@prisma/client';
import { UserSignupRequestBody, UserSignupResponse } from '../client/types';
import { convertToUrlSafe } from './utils';
import {
  LOG_ERROR_TYPES,
  LOG_ACTIONS,
  logActivity,
  logError,
  LOG_DESCRIPTIONS,
} from './logging';

/**
 * Signs up a user.
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
  body: UserSignupRequestBody
): Promise<UserSignupResponse | { error: string }> => {
  try {
    // NOTE: This is in a transaction. So these all must pass or none will.
    const data = await prismaClient.$transaction(async (_prisma) => {
      const _displayName = convertToUrlSafe(body.displayName);
      const _teamName = `${_displayName}'s Team`;
      const _projectTitle = `${_displayName}'s Project`;
      // If there is no subscriptionType, default to Free.
      const _subscriptionType = body.subscriptionType || SubscriptionType.Free;

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
          email: body.email,
          firstName: body.firstName || '',
          lastName: body.lastName || '',
          displayName: _displayName,
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
              name: _teamName,
              // We can set this, but we don't display it unless they have a subscription.
              customSubDomain: _displayName,
            },
          },
        },
      });

      const createdProject = await _prisma.project.create({
        data: {
          title: _projectTitle,
          description: 'Placeholder description.',
          notes: 'This is where you can add notes about your project.',
          isProjectLive: false,
          customBasePath: `/${convertToUrlSafe(_projectTitle)}`,
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
        select: {
          project: true,
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
