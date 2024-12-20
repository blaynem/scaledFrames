import React from 'react';
import FramePreview from './FramePreview';
import { FrameEditorContext } from '../../lib/frame-context';
import {
  EditFrameRequestBody,
  FramerClientSDK,
} from '@framer/FramerServerSDK/client';
import { AspectRatio } from '@prisma/client';
import { useToast } from '../Toasts/ToastProvider';
import { ToastTypes } from '../Toasts/GenericToast';
import { PlusIcon } from '@heroicons/react/24/outline';

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
      path: `new-frame ${frames.length + 1}`,
      title: `New Frame ${frames.length + 1}`,
      imageUrl: '',
      imageLinkUrl: '',
      aspectRatio: frames[0].aspectRatio,
      imageType: 'Static',
      isDeleted: false,
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

  const handleDeleteFrame = async (frameId: string) => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Loading', 'infinite');
    const currFrame = frames.find((frame) => frame.id === frameId);
    if (frames.length === 1) {
      loadingToast.clearToast();
      console.error('Error deleting frame: cannot delete the only frame');
      addToast(
        ToastTypes.ERROR,
        'Error deleting frame: cannot delete the only frame',
        5000
      );
      return;
    }
    if (!currFrame) {
      loadingToast.clearToast();
      console.error('Error deleting frame: frame not found');
      addToast(ToastTypes.ERROR, 'Error deleting frame: frame not found', 5000);
      return;
    }
    const body: EditFrameRequestBody = {
      projectId: currFrame.projectId,
      teamId: currFrame.teamId,
      intents: currFrame.intents,
      isDeleted: true,
    };
    const response = await clientSdk.frames.edit(frameId, body);
    if ('error' in response) {
      loadingToast.clearToast();
      console.error('Error deleting frame: ', response.error);
      addToast(ToastTypes.ERROR, response.error, 5000);
      return;
    }
    const newFrames = frames.filter((frame) => frame.id !== frameId);
    setFrameEditorContext(newFrames, newFrames[0]);
    loadingToast.clearToast();
  };

  return (
    <div className="flex flex-col  justify-items-center items-center">
      <h2 className='text-center text-lg font-bold mb-4'>All Frames</h2>
      <button
        className="w-9/12 h-10 bg-white rounded-md flex flex-row items-center justify-center mb-4"
        onClick={handleCreateNewFrame}
      >
        <PlusIcon className="lg:h-7 lg:w-7 p-1 md:w-4 md:h-4 sm:w-2 sm:h-2"></PlusIcon>
        Create New Frame
      </button>
      {frames.map((frame) =>
        frame.isDeleted ? null : (
          <FramePreview
            key={frame.title}
            imageUrl={frame.imageUrl}
            title={frame.title}
            onClick={() => {
              setFrameEditorContext(frames, frame);
            }}
            aspectRatio={aspectRatio}
            isSelected={selectedFrame?.id === frame.id}
            handleRemove={() => handleDeleteFrame(frame.id)}
          />
        )
      )}
    </div>
  );
};

export default FramePreviewContainer;
