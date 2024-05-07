import { FrameAspectRatios } from '../../lib/types';
import FrameImage from '../FrameImage/FrameImage';
import IntentContainer from '../IntentButton/IntentContainer';
import styles from './frameDebugger.module.css';

/* eslint-disable-next-line */
export interface FrameDebuggerProps {}

export function FrameDebugger(props: FrameDebuggerProps) {
  return (
    <div className={styles['container']}>
      <div>
        <FrameImage
          aspectRatio={FrameAspectRatios.standard}
          imageUrl="https://picsum.photos/1080/565"
        ></FrameImage>
        <IntentContainer></IntentContainer>
      </div>
    </div>
  );
}

export default FrameDebugger;
