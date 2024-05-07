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

export const isUsingCustomSubdomain = (teamSubdomain: string): boolean => {
  // TODO: is `framer` our subdomain?
  return (
    teamSubdomain !== 'localhost' &&
    teamSubdomain !== 'www' &&
    teamSubdomain !== 'framer'
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
