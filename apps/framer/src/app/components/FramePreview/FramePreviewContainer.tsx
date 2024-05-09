import React from 'react';
import './FramePreviewContainer.css';
import {
  FramerClientSDK,
  GetFramesResponse,
} from '@framer/FramerServerSDK/client';
import FramePreview, { FramePreviewProps } from './FramePreview';
const FramePreviewContainer = async () => {
  const framerSDK = FramerClientSDK();
  let frames: GetFramesResponse;
  try {
    frames = await framerSDK.frames.get({
      projectId: 'your-project-id',
      title: 'your-frame-title',
    });
    if ('error' in frames) {
      console.error(frames.error);
    }
  } catch {
    console.error('Failed to get frames');
  }

  const framesTemp: FramePreviewProps[] = [
    { imageUrl: 'https://picsum.photos/1080/565', title: 'frame1' },
    { imageUrl: 'https://picsum.photos/1080/565', title: 'frame2' },
    { imageUrl: 'https://picsum.photos/1080/565', title: 'frame3' },
  ];
  return (
    <div className="frame-preview-container">
      <div className="frame-preview-wrapper">
        {framesTemp.map((frame) => (
          <FramePreview
            key={frame.title}
            imageUrl={frame.imageUrl}
            title={frame.title}
          />
        ))}
      </div>
    </div>
  );
};

export default FramePreviewContainer;
