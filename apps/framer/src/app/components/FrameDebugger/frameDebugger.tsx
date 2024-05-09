import { FrameAspectRatios, IntentTypes } from '../../lib/types';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import styles from './frameDebugger.module.css';
import {
  FramerClientSDK,
  GetFrameResponse,
} from '@framer/FramerServerSDK/client';
/* eslint-disable-next-line */
export interface FrameDebuggerProps {
  frameId: string;
}

export async function FrameDebugger({ frameId }: FrameDebuggerProps) {
  const framerClientSDK = FramerClientSDK();
  let frame = {} as GetFrameResponse;
  try {
    frame = await framerClientSDK.frames.getById(frameId);
  } catch {
    console.error('Failed to get frame');
  }
  if ('error' in frame) {
    console.error(frame.error);
    return null;
  }

  return (
    <div
      className="rounded-lg bg-white p-4 m-4
    "
    >
      <FrameImage
        aspectRatio={frame.aspectRatio ?? FrameAspectRatios['1.91:1']}
        imageUrl={frame.imageLinkUrl ?? 'https://picsum.photos/1080/565'}
      />
      <IntentContainer
        intents={[
          { intentType: IntentTypes.EXTERNAL_LINK, text: 'link' },
          { text: 'internal link', intentType: IntentTypes.INTERNAL_LINK },
          { text: 'internal link', intentType: IntentTypes.INTERNAL_LINK },
          { text: 'internal link', intentType: IntentTypes.INTERNAL_LINK },
        ]}
      />
    </div>
  );
}

export default FrameDebugger;
