import { FrameAspectRatio } from '../../lib/types';
import styles from './FrameImage.module.css';

/* eslint-disable-next-line */
export interface FrameImageProps {
  aspectRatio: string;
  imageUrl: string;
}

export function FrameImage({ aspectRatio, imageUrl }: FrameImageProps) {
  return (
    <div className={styles['container']}>
      <img
        className={'image rounded-md'}
        src={imageUrl}
        alt="frame"
        style={{ aspectRatio: aspectRatio }}
      />
    </div>
  );
}

export default FrameImage;
