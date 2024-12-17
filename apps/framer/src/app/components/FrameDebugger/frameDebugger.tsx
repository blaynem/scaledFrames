'use client';

import { useContext, useEffect, useState } from 'react';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import { AspectRatio } from '@prisma/client';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
/* eslint-disable-next-line */

export function FrameDebugger() {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [intents, setIntents] = useState(
    selectedFrame ? selectedFrame.intents : []
  );
  const aspectRatio =
    frames[0] && frames[0].aspectRatio == AspectRatio.STANDARD ? '1.0' : '1.91';
  useEffect(() => {
    if (selectedFrame) {
      setFrameEditorContext(frames, selectedFrame);
      setIntents(selectedFrame.intents);
    }
  }, [selectedFrame, frames, setFrameEditorContext]);

  return (
    selectedFrame && (
      <>
        <h2 className="text-center text-lg font-bold">Live Preview</h2>
        <div className="rounded-lg bg-white m-4 max-h-fit flex-shrink-1 w-9/12 h-9/12 flex flex-col items-center justify-center">
          <FrameImage
            aspectRatio={aspectRatio}
            imageUrl={
              selectedFrame
                ? selectedFrame.imageUrl
                : 'https://picsum.photos/1080/565'
            }
          />
          <IntentContainer intents={intents} />
        </div>
      </>
    )
  );
}

export default FrameDebugger;
