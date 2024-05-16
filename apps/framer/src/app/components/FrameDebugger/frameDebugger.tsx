'use client';

import { useContext, useEffect, useState } from 'react';
import { FrameAspectRatios, IntentTypes } from '../../lib/types';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { AspectRatio, Frame } from '@prisma/client';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
/* eslint-disable-next-line */

export function FrameDebugger() {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [intents, setIntents] = useState(
    selectedFrame ? selectedFrame.intents : []
  );
  useEffect(() => {
    if (selectedFrame) {
      setFrameEditorContext(frames, selectedFrame);
      setIntents(selectedFrame.intents);
    }
  }, [selectedFrame, frames]);

  return (
    <div className="rounded-lg bg-white p-4 m-4 max-h-fit flex-shrink-1 max-w-fit flex flex-col items-center justify-center">
      <FrameImage
        aspectRatio={
          selectedFrame && selectedFrame.aspectRatio == AspectRatio.STANDARD
            ? '1.0'
            : '1.91'
        }
        imageUrl={
          selectedFrame
            ? selectedFrame.imageUrl
            : 'https://picsum.photos/1080/565'
        }
      />
      <IntentContainer intents={intents} />
    </div>
  );
}

export default FrameDebugger;
