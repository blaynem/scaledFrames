'use client';

import { useContext, useState } from 'react';
import { FrameAspectRatios, IntentTypes } from '../../lib/types';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { Frame } from '@prisma/client';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
/* eslint-disable-next-line */
export interface FrameDebuggerProps {
  frameId: string;
}

export function FrameDebugger({ frameId }: FrameDebuggerProps) {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  return (
    <div
      className="rounded-lg bg-white p-4 m-4
    "
    >
      <FrameImage
        aspectRatio={
          selectedFrame ? selectedFrame.imageUrl : FrameAspectRatios['1.91:1']
        }
        imageUrl={
          selectedFrame
            ? selectedFrame.imageUrl
            : 'https://picsum.photos/1080/565'
        }
      />
      <IntentContainer intents={selectedFrame ? selectedFrame.intents : []} />
    </div>
  );
}

export default FrameDebugger;
