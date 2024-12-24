'use client';

import { useContext, useEffect, useState } from 'react';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import { AspectRatio } from '@prisma/client';
import { FrameEditorContext } from '../../lib/frame-context';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { HoverCardComponent } from '../ui/HoverCard';
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
        <div className="flex mb-1 items-center">
          <h2 className="mr-2 text-center text-lg font-bold">Live Preview</h2>
          <HoverCardComponent
            className="bg-white border-gray-300 border z-50"
            cardContent={`Warning: Different websites and applications may display the image differently.`}
            headerNode={<ExclamationTriangleIcon className="h-4 w-4" />}
          />
        </div>
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
        <small className='px-20'><b>Note:</b> Warpcaster caches the first image it sees, including some metadata like the aspect ratio.</small>
      </>
    )
  );
}

export default FrameDebugger;
