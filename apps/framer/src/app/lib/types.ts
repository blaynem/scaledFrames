import { Frame } from '@prisma/client';
import { FrameResponseType } from 'libs/FramerServerSDK/src/lib/client/types/frames';

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
  '1.91:1': '1.91',
  '1:1': '1.0',
} as const;

export type FrameAspectRatio =
  (typeof FrameAspectRatios)[keyof typeof FrameAspectRatios];

export type TFrameEditorContext = {
  frames: FrameResponseType[];
  selectedFrame: FrameResponseType | null;
  setFrameEditorContext: (
    frames: FrameResponseType[],
    selectedFrame: FrameResponseType | null
  ) => void;
};
