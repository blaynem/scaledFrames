import styles from './FramePreview.module.css';

/* eslint-disable-next-line */
export interface FramePreviewProps {
  imageUrl: string;
  title: string;
}

export function FramePreview(props: FramePreviewProps) {
  return (
    <div className="m-1">
      <img
        className="rounded-md"
        style={{ aspectRatio: 1.91 }}
        src={props.imageUrl}
      />
      <h2 className="text-center">{props.title}</h2>
    </div>
  );
}

export default FramePreview;
