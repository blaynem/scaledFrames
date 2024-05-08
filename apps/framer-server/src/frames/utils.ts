import { ParsedFrameUrl } from '@framer/FramerServerSDK';
import { SubscriptionType } from '@prisma/client';

/**
 * Checks the subscription type of the team to determine if they can use a custom subdomain.
 *
 * @param teamSubdomain
 * @returns
 */
export const canUseCustomSubdomain = (
  subscriptionType: SubscriptionType
): boolean => {
  return (
    subscriptionType === SubscriptionType.Pro ||
    subscriptionType === SubscriptionType.Enterprise
  );
};

export const isUsingCustomSubdomain = (
  parsedFrameUrl: ParsedFrameUrl
): boolean => {
  // If we're in development mode AND we're going through ngrok, we can ignore this check.
  if (
    process.env.NODE_ENV === 'development' &&
    parsedFrameUrl.url.includes('ngrok-free')
  ) {
    return false;
  }
  // TODO: is `framer` our subdomain?
  return (
    parsedFrameUrl.teamSubdomain !== 'localhost' &&
    parsedFrameUrl.teamSubdomain !== 'www' &&
    parsedFrameUrl.teamSubdomain !== 'framer'
  );
};

/**
 * Gets the correct fallback URL for the team based on their subscription type.
 *
 * @param subscriptionType The subscription type of the team.
 * @param customFallbackUrl The custom fallback URL of the team.
 * @returns
 */
export const getCustomFallbackUrl = (
  subscriptionType: SubscriptionType,
  customFallbackUrl: string
): string => {
  // If the team has a pro or enterprise subscription.
  if (
    subscriptionType === SubscriptionType.Pro ||
    subscriptionType === SubscriptionType.Enterprise
  ) {
    // AND they have a custom fallback URL that is not empty.
    if (!!customFallbackUrl) {
      return customFallbackUrl;
    }
  }
  return '/defaultFallback';
};
