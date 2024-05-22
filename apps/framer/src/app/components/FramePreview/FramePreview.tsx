import { TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import styles from './FramePreview.module.css';

/* eslint-disable-next-line */
export interface FramePreviewProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
  aspectRatio: number;
  handleRemove: () => void;
}

export function FramePreview({
  imageUrl,
  title,
  onClick,
  isSelected,
  aspectRatio,
  handleRemove,
}: FramePreviewProps) {
  return (
    <div
      className={
        isSelected
          ? 'm-1 p-1 rounded-lg bg-white border-2 border-blue-500 h-9/12 w-9/12 relative'
          : 'm-1 p-1 rounded-lg bg-white from-blue-100  border-1 border-white h-9/12 w-9/12 relative'
      }
      onClick={() => onClick()}
    >
      <button className="absolute" onClick={() => handleRemove()}>
        <XCircleIcon className="m-2 rounded-sm h-8 w-8 text-red-500" />
      </button>
      <img
        className="rounded-md"
        style={{ aspectRatio: aspectRatio }}
        src={imageUrl}
      />
      <h2 className="text-center">{title}</h2>
    </div>
  );
}

export default FramePreview;
