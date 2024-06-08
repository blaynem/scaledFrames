import { Intents } from '@prisma/client';
import styles from './IntentButton.module.css';
import { useContext } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';

/* eslint-disable-next-line */
export interface IntentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  intent: Intents;
}
export function IntentButton({ intent, ...props }: IntentButtonProps) {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  return (
    <button
      className={
        'flex bg-gray-200 items-center justify-center text-black h-12 rounded-lg flex-row grow flex-shrink-1 px-3 py-8  mx-1 border-2 border-gray-300 '
      }
      onClick={() => {
        if (intent.type === 'ExternalLink') {
          window.open(intent.linkUrl, '_blank');
        }
        if (intent.type === 'InternalLink') {
          const selectedFrame = frames.find(
            (frame) => intent.linkUrl === frame.path
          );
          if (selectedFrame) {
            setFrameEditorContext(frames, selectedFrame);
          }
        }
      }}
    >
      {intent ? intent.displayText : 'l bozo'}
    </button>
  );
}

export default IntentButton;
