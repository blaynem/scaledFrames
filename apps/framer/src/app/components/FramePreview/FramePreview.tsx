import styles from './FramePreview.module.css';

/* eslint-disable-next-line */
export interface FramePreviewProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
}

export function FramePreview({
  imageUrl,
  title,
  onClick,
  isSelected,
}: FramePreviewProps) {
  return (
    <div
      className={isSelected ? 'm-1 border-2 border-blue-500' : 'm-1'}
      onClick={() => onClick()}
    >
      <img
        className="rounded-md"
        style={{ aspectRatio: 1.91 }}
        src={imageUrl}
      />
      <h2 className="text-center">{title}</h2>
    </div>
  );
}

export default FramePreview;
