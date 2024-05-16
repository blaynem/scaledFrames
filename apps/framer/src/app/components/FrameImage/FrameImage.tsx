import { FrameAspectRatio } from '../../lib/types';
import styles from './FrameImage.module.css';

/* eslint-disable-next-line */
export interface FrameImageProps {
  aspectRatio: string;
  imageUrl: string;
}

export function FrameImage({ aspectRatio, imageUrl }: FrameImageProps) {
  return (
    <img
      className={'image rounded-md width-full height-full'}
      src={imageUrl}
      alt="frame"
      style={{ aspectRatio: aspectRatio }}
    />
  );
}

export default FrameImage;
