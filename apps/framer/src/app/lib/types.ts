export const IntentTypes = {
  REDIRECT: 'REDIRECT',
  RESET: 'RESET',
  INTERNAL_LINK: 'INTERNAL_LINK',
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  MINT: 'MINT',
  TEXT_INPUT: 'TEXT_INPUT',
  TRANSACTION: 'TRANSACTION',
  WEBHOOK: 'WEBHOOK',
} as const;

export type IntentType = (typeof IntentTypes)[keyof typeof IntentTypes];

export const FrameAspectRatios = {
  standard: { width: 1.9, height: 1 },
  square: { width: 1, height: 1 },
} as const;

export type FrameAspectRatio =
  (typeof FrameAspectRatios)[keyof typeof FrameAspectRatios];
