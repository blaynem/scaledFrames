import { IntentClickTracking, IntentType, PrismaClient } from '@prisma/client';

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
    const intentTrackingData = await prisma.$transaction(async (_prisma) => {
      // Fetch the consumer data and the active session, or create the data.
      const consumerData = await _prisma.consumerKnownData.upsert({
        where: {
          id: farcasterUserId,
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

      let activeSession = consumerData.sessions[0];

      const THIRTY_MINUTES_AGO = Date.now() - 30 * 60 * 1000;
      const FIVE_SECONDS_AGO = Date.now() - 5 * 1000;

      // If the session was active within the last 30 minutes,
      // AND the session was not created within the last 5 seconds,
      // we consider the session active, and update the "lastActiveAt" field.
      // Otherwise, we should create a new session.
      const sessionIsActive =
        activeSession?.lastActiveAt.getTime() > THIRTY_MINUTES_AGO &&
        activeSession?.startedAt.getTime() < FIVE_SECONDS_AGO;

      if (sessionIsActive) {
        activeSession = await _prisma.session.update({
          where: {
            id: activeSession.id,
          },
          data: {
            lastActiveAt: new Date(),
          },
        });
      } else {
        activeSession = await _prisma.session.create({
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

      return { intentTracking, activeSession };
    });
    console.log('Intent tracking data: ', intentTrackingData);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
