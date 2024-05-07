import { FrameAspectRatio } from '../../lib/types';
import styles from './FrameImage.module.css';

/* eslint-disable-next-line */
export interface FrameImageProps {
  aspectRatio: FrameAspectRatio;
  imageUrl: string;
}

export function FrameImage({ aspectRatio, imageUrl }: FrameImageProps) {
  return (
    <div className={styles['container']}>
      <img
        className={styles['image']}
        src={imageUrl}
        alt="frame"
        style={{ aspectRatio: aspectRatio.width / aspectRatio.height }}
      />
    </div>
  );
}

export default FrameImage;
