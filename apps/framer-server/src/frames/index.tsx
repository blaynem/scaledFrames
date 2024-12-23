import { Frog } from 'frog';
import {
  LOG_ERROR_TYPES,
  logError,
  logIntentTrackingFarcaster,
} from '@framer/FramerServerSDK/server';
import prisma from '../prismaClient';
import { FrameImageAspectRatio } from 'node_modules/frog/_lib/types/frame';
import {
  getCustomFallbackUrl,
} from './utils';
import { getFrameIntents } from './getIntents';
import { IntentConversionType } from '@prisma/client';
import { parseFramerUrl } from '@framer/FramerServerSDK';

const routeApp = new Frog({
  title: "What's a title?",
  origin: process.env.NEXT_PUBLIC_CLIENT_URL, 
  verifyOrigin: false
});

// Catch for ALL paths from the frames endpoint.
routeApp.frame('/*', async (frameContext) => {
  const initialPath = frameContext.req.url;
  try {
    const frameParams = parseFramerUrl(initialPath);
    if (!frameParams) {
      throw new Error(
        `Could not parse frame params. Initial path: ${initialPath}`
      );
    }

    // Fetching the frame data based on the parsed URL.
    // Including select fields for the project's team's subscription plan.
    const frameData = await prisma.frame.findFirstOrThrow({
      where: {
        path: frameParams.framePath,
        project: {
          customBasePath: frameParams.projectBasePath,
        },
      },
      include: {
        intents: true,
        project: {
          select: {
            customFallbackUrl: true,
            team: {
              select: {
                customSubDomain: true,
                subscription: {
                  select: {
                    status: true,
                    plan: {
                      select: {
                        subscriptionType: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const subscriptionType =
      frameData.project.team.subscription.plan.subscriptionType;
    // If the interaction is from farcaster.
    const interactionFromFarcaster = frameContext.frameData;

    // If a link is using a custom subdomain, we need to ensure it's validity.
    // We do this both as a gating mechanism, as well as security.
    // We accept a wildcard subdomain, so we want to ensure that if a subdomain IS being used, it's valid.
    //
    // For example, let's say some random user creates a link: `nike.scaledframes.com/f/project/frameid`
    // That link will correctly redirect to the frame, regarldess of the subdomain (nike).
    // So we want to ensure that if a subdomain is being used, it's valid.
    // The simplest this is by checking the subscription type of the team.
    //
    // NOTE: This doesn't work as expected right now because of reverse proxying, ned to find out a better solution.
    // if (isUsingCustomSubdomain(frameParams)) {
    //   if (!canUseCustomSubdomain(subscriptionType)) {
    //     const messages = [
    //       'Link to custom subdomain, but team does not have a Pro or Enterprise subscription.',
    //       `Initial path: ${initialPath}.`,
    //       `Farcaster Cast Hash: ${interactionFromFarcaster?.castId.hash}, Caster ID: ${interactionFromFarcaster?.castId.fid}`,
    //     ];
    //     throw new Error(messages.join('\n'));
    //   }
    // }

    const intents = getFrameIntents(
      frameParams.projectBasePath,
      frameData.intents
    );

    // If intent is from farcaster, we should have all the needed data.
    if (interactionFromFarcaster) {
      // We set the value of buttons to be the intentId.
      const buttonId = frameContext.buttonValue || '';
      // Input text will only be set if the intent is from an input.
      const inputText = frameContext.inputText || null;

      // If it's a redirect, we know it's an external link.
      const conversionType =
        frameContext.status === 'redirect'
          ? IntentConversionType.ExternalLink
          : IntentConversionType.None;

      logIntentTrackingFarcaster({
        farcasterUserId: interactionFromFarcaster.fid.toString(),
        prisma,
        isInputIntent: inputText !== null,
        intentData: {
          conversionType,
          frameId: frameData.id,
          intentId: buttonId,
          intentTextValue: inputText,
          farcasterCastHash: interactionFromFarcaster?.castId.hash,
          projectId: frameData.projectId,
        },
      });
    }

    return frameContext.res({
      // If a user opens a frame in a browser, we will redirect them to a different location.
      browserLocation: getCustomFallbackUrl(
        subscriptionType,
        frameData.project.customFallbackUrl
      ),
      imageAspectRatio: frameData.aspectRatio as FrameImageAspectRatio,
      title: frameData.title,
      image: frameData.imageUrl,
      intents,
    });
  } catch (error) {
    console.error('Error fetching frame data: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.CONSUMER_FETCH_FRAME,
    });
    return frameContext.error({
      message: 'Error fetching frame data.',
      statusCode: 404,
    });
  }
});

export default routeApp;
