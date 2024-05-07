import { IntentClickTracking, IntentType, PrismaClient } from '@prisma/client';
import { LOG_ERROR_TYPES, logError } from './logging';

/**
 * Logs an intent tracking interaction to the database from a Farcaster app.
 *
 * Checks if there is an active session
 */
export const logIntentTrackingFarcaster = async ({
  farcasterUserId,
  prisma,
  intentData,
  isInputIntent,
}: {
  farcasterUserId: string;
  prisma: PrismaClient;
  isInputIntent: boolean;
  intentData: Pick<
    IntentClickTracking,
    | 'conversionType'
    | 'frameId'
    | 'intentId'
    | 'intentTextValue'
    | 'farcasterCastHash'
    | 'projectId'
  >;
}) => {
  try {
    await prisma.$transaction(async (_prisma) => {
      // Fetch the consumer data and the active session, or create the data.
      const consumerData = await _prisma.consumerKnownData.upsert({
        where: {
          farcasterId: farcasterUserId,
        },
        // We don't need to update anything. Just fetching the session.
        update: {},
        create: {
          farcasterId: farcasterUserId,
          sessions: {
            create: {
              projectId: intentData.projectId,
            },
          },
        },
        include: {
          sessions: {
            orderBy: {
              lastActiveAt: 'desc',
            },
            take: 1,
          },
        },
      });

      const activeSession = consumerData.sessions[0];
      const THIRTY_MINUTES_AGO = Date.now() - 30 * 60 * 1000;

      // We consider a session to be active if the lastActiveAt time is within the last 30 minutes.
      const sessionIsActive =
        activeSession?.lastActiveAt.getTime() > THIRTY_MINUTES_AGO;

      // In order to keep track of how Sessions are being used, we need to keep track of the last active time.
      // If the session is active, we update the lastActiveAt time.
      // If the session is not active, we create a new session.
      //
      // NOTE: Should we a do a check to not update a session that was just created in the CreateConsumerKnownData? Does it matter?
      if (sessionIsActive) {
        await _prisma.consumerSession.update({
          where: {
            id: activeSession.id,
          },
          data: {
            lastActiveAt: new Date(),
          },
        });
      } else {
        await _prisma.consumerSession.create({
          data: {
            consumerId: consumerData.id,
            projectId: intentData.projectId,
          },
        });
      }

      let inputDisplayText: string | null = null;
      if (isInputIntent) {
        // If the intent is from an input, we can't use the intentData.intentId.
        // We instead need to fetch the intent from the given frameId.
        const inputIntent = await _prisma.frame.findFirstOrThrow({
          where: {
            id: intentData.frameId,
          },
          select: {
            intents: {
              where: {
                type: IntentType.TextInput,
              },
            },
          },
        });

        // Will need to revisit this if we ever have multiple input intents.
        inputDisplayText = inputIntent.intents[0].displayText;
      }

      const intentTracking = await _prisma.intentClickTracking.create({
        data: {
          consumerId: consumerData.id,
          conversionType: intentData.conversionType,
          farcasterCastHash: intentData.farcasterCastHash,
          farcasterUserId: farcasterUserId,
          frameId: intentData.frameId,
          intentId: intentData.intentId,
          projectId: intentData.projectId,
          sessionId: consumerData.sessions[0].id,
          // If the intent is an input intent, we should store the context (displayed Text),
          // and the value (the actual text input).
          ...(inputDisplayText && {
            intentTextContext: inputDisplayText,
            intentTextValue: intentData.intentTextValue,
          }),
        },
      });

      return { intentTracking };
    });
    return { success: true };
  } catch (error) {
    console.error('Intent tracking failued: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.INTENT_TRACKING,
    });
    return { error: 'Failed to submit' };
  }
};
