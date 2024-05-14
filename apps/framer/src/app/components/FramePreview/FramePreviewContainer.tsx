import React from 'react';
import './FramePreviewContainer.css';
import FramePreview from './FramePreview';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
const FramePreviewContainer = async () => {
  const { frames, selectedFrame, setFrameEditorContext } =
    React.useContext(FrameEditorContext);

  return (
    <div className="frame-preview-container">
      <div className="frame-preview-wrapper">
        {frames.map((frame) => (
          <FramePreview
            key={frame.title}
            imageUrl={frame.imageUrl}
            title={frame.title}
            onClick={() => {
              setFrameEditorContext(frames, frame);
            }}
            isSelected={selectedFrame?.id === frame.id}
          />
        ))}
      </div>
    </div>
  );
};

export default FramePreviewContainer;
