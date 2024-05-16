import styles from './FramePreview.module.css';

/* eslint-disable-next-line */
export interface FramePreviewProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
  aspectRatio: number;
}

export function FramePreview({
  imageUrl,
  title,
  onClick,
  isSelected,
  aspectRatio,
}: FramePreviewProps) {
  return (
    <div
      className={
        isSelected
          ? 'm-1 p-1 rounded-lg bg-gradient-to-tl from-orange-100  border-2 border-blue-500'
          : 'm-1 p-1 rounded-lg bg-gradient-to-tl from-blue-100  border-1 border-white'
      }
      onClick={() => onClick()}
    >
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
