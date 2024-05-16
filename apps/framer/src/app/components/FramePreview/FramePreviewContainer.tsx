import React from 'react';
import './FramePreviewContainer.css';
import FramePreview from './FramePreview';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import {
  FrameResponseType,
  FramerClientSDK,
} from '@framer/FramerServerSDK/client';
import { AspectRatio } from '@prisma/client';
import { useToast } from '../Toasts/ToastProvider';
import { ToastTypes } from '../Toasts/GenericToast';

const FramePreviewContainer = () => {
  const { frames, selectedFrame, setFrameEditorContext } =
    React.useContext(FrameEditorContext);
  const clientSdk = FramerClientSDK();
  const { addToast } = useToast();

  const aspectRatio =
    frames[0] && frames[0].aspectRatio == AspectRatio.STANDARD ? 1.0 : 1.91;

  const handleCreateNewFrame = async () => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Loading', 'infinite');
    if (!selectedFrame) {
      loadingToast.clearToast();
      console.error('Error creating new project: selectedFrame is null');
      addToast(
        ToastTypes.ERROR,
        'Error creating new project: selectedFrame is null',
        5000
      );
      return;
    }

    const newFrame = await clientSdk.frames.create({
      projectId: selectedFrame.projectId,
      teamId: selectedFrame?.teamId,
      path: 'new-frame',
      title: 'New Frame',
      imageUrl: 'https://via.placeholder.com/1080x565',
      imageLinkUrl: 'https://via.placeholder.com/565/1080',
      aspectRatio: frames[0].aspectRatio,
      imageType: 'Static',
    });
    if ('error' in newFrame) {
      loadingToast.clearToast();
      console.error('Error creating new project: ', newFrame.error);
      addToast(ToastTypes.ERROR, newFrame.error, 5000);
      return;
    }
    setFrameEditorContext([...frames, newFrame], newFrame);
    loadingToast.clearToast();
  };

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
            aspectRatio={aspectRatio}
            isSelected={selectedFrame?.id === frame.id}
          />
        ))}

        <button
          className="width-full h-40 bg-gradient-to-b from-red-100 rounded-md"
          onClick={handleCreateNewFrame}
        >
          Create New Frame
        </button>
      </div>
    </div>
  );
};

const newFrame: FrameResponseType = {
  aspectRatio: AspectRatio.STANDARD,
  id: 'new-frame',
  imageUrl: 'https://via.placeholder.com/150',
  title: 'New Frame',
  intents: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  createdById: '1234',
  imageLinkUrl: 'https://via.placeholder.com/150',
  isDeleted: false,
  projectId: '1234',
  imageType: 'Static',
  lastUpdatedById: '1234',
  path: 'new-frame',
  teamId: '1234',
};
export default FramePreviewContainer;
