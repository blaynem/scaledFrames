'use client';

import {
  ArrowUpOnSquareIcon,
  BookmarkIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FrameEditorContext } from '../../lib/frame-context';
import { IntentInput } from './IntentInput';
import { AspectRatio, IntentType } from '@prisma/client';
import {
  EditFrameRequestBody,
  FramerClientSDK,
  FrameResponseType,
} from '@framer/FramerServerSDK/client';
import { findFrameIdxById } from '../../utils/utils';
import { ToastTypes } from '../Toasts/GenericToast';
import { useToast } from '../Toasts/ToastProvider';
import { APP_DOMAIN } from '@framer/FramerServerSDK';
import ImageUploadModal from '../ImageUploadModal/ImageUploadModal';
import deepEqual from 'deep-equal';
import { HoverCardComponent } from '../ui/HoverCard';

const getDisplayPathValue = (path?: string) => {
  if (!path) return "";
  let _path = path;
  while (_path[0] == '/') {
    _path = _path.slice(1);
  }

  return _path;
};

export function FrameInputs() {
  // We need to remove the frameEditorContext. The inputs themselves don't need the context its fucking things up.
  // The context should only be updated when we actually save the frame. That's whats causing the rerendering.
  const [initFrameData, setInitFrameData] = useState<FrameResponseType>();
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const { addToast } = useToast();
  const [show, setShow] = useState(false);
  const clientSdk = FramerClientSDK();

  useEffect(() => {
    if (selectedFrame) {
      // This rerenders a lot, so only set it when we havent yet. Otherwise the onSave does it.
      if (!initFrameData) {
        setInitFrameData(selectedFrame);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFrame]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, title: e.target.value };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleChangePath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, path: newPath };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleSaveAspectRatio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AspectRatio;
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, aspectRatio: value };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleAddIntent = () => {
    if (!selectedFrame) return;
    const exampleIntent = {
      id: `${selectedFrame.intents.length + 1}`,
      displayText: 'Example Intent',
      type: IntentType.InternalLink,
      displayOrder: selectedFrame.intents.length + 1,
      framesId: selectedFrame ? selectedFrame.id : '1234',
      isDeleted: false,
      linkUrl: APP_DOMAIN,
    };

    if (selectedFrame) {
      const tempIntents = [...selectedFrame.intents, exampleIntent];
      const idx = findFrameIdxById(frames, selectedFrame.id);
      const tempFrames = [...frames];
      const tempFrame = { ...selectedFrame, intents: tempIntents };
      tempFrames[idx].intents = tempIntents;

      setFrameEditorContext(frames, tempFrame);
    }
  };

  const handleRemoveIntent = (intentId: string) => {
    if (selectedFrame) {
      const tempIntents = selectedFrame.intents.filter(
        (intent) => intent.id !== intentId
      );
      const idx = findFrameIdxById(frames, selectedFrame.id);
      const tempFrames = [...frames];
      const tempFrame = { ...selectedFrame, intents: tempIntents };
      tempFrames[idx].intents = tempIntents;

      setFrameEditorContext(tempFrames, tempFrame);
      // No onBlur will be fired, so we need to save the frame
      handleSaveFrame();
    }
  };

  const handleSaveFrame = async () => {
    if (!selectedFrame) return;

    // Append the "/" back once we've removed all the other stuff.
    let _path = selectedFrame.path.trim();
    if (_path.indexOf('/') != 0) {
      _path = '/' + _path;
    }
    const body: EditFrameRequestBody = {
      projectId: selectedFrame.projectId,
      teamId: selectedFrame.teamId,
      title: selectedFrame.title,
      path: _path,
      imageUrl: selectedFrame.imageUrl,
      isDeleted: false,
      intents: selectedFrame.intents,
      aspectRatio: selectedFrame.aspectRatio,
    };

    // basically a deep compare.. lol
    if (
      body.title == initFrameData?.title &&
      body.path == initFrameData?.path &&
      body.imageUrl == initFrameData?.imageUrl &&
      body.isDeleted == initFrameData?.isDeleted
    ) {
      // this is so annoying.
      const intents1 = body.intents.map(
        ({ displayText, type, displayOrder, isDeleted, linkUrl }) => ({
          displayOrder,
          displayText,
          type,
          isDeleted,
          linkUrl,
        })
      );
      const intents2 = initFrameData?.intents.map(
        ({ displayText, type, displayOrder, isDeleted, linkUrl }) => ({
          displayOrder,
          displayText,
          type,
          isDeleted,
          linkUrl,
        })
      );
      // If the intents are equal, lets break early.
      if (deepEqual(intents1, intents2)) return;
    }

    const loadingToast = addToast(ToastTypes.LOADING, 'Saving', 'infinite');
    const newFrame = await clientSdk.frames.edit(selectedFrame.id, body);
    const idx = findFrameIdxById(frames, selectedFrame.id);
    const tempFrames = [...frames];
    if ('error' in newFrame) {
      loadingToast.clearToast();
      console.error('Error creating new project: ', newFrame.error);
      addToast(ToastTypes.ERROR, newFrame.error, 5000);
      return;
    }
    loadingToast.clearToast();
    addToast(ToastTypes.SUCCESS, 'Frame Saved', 5000);
    tempFrames[idx] = newFrame;
    setFrameEditorContext([...tempFrames], newFrame);

    // Keeps track of the state so we know when to not send
    setInitFrameData(selectedFrame);
  };

  // We don't want to display the beginning "/" to the user is all this is
  const displayPathValue = useMemo(() => getDisplayPathValue(selectedFrame?.path), [selectedFrame]);

  return (
    selectedFrame && (
      <div className="flex flex-col">
        <h2 className="text-center text-lg font-bold">Edit Frame</h2>
        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium dark:text-gray-100 ">
            Title
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Title"
            value={selectedFrame.title}
            onChange={handleChangeTitle}
          />
        </div>

        <div className="mb-2">
          <div className="flex mb-1 items-center">
            <label className="mr-2 text-sm font-medium dark:text-gray-100 ">
              Path
            </label>
            <HoverCardComponent
              className="bg-white border-gray-300 border z-50"
              cardContent={`Customizes the url that links to this frame. Ex: Path = "/myFrame"`}
              headerNode={<QuestionMarkCircleIcon className="h-4 w-4" />}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <span className="content-center h-full absolute pl-2 pr-1 border-r border-gray-300/70 text-gray-900">
              {'/'}
            </span>
            <input
              type="text"
              className="pl-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Path"
              value={displayPathValue}
              onChange={handleChangePath}
            />
          </div>
        </div>
        <div className="flex">
          <div className="grow">
            <label className="pb-1 block text-sm font-medium dark:text-gray-100 ">
              Select Image
            </label>

            <button
              type="button"
              className="text-white justify-center bg-blue-600 hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
              onClick={() => {
                setShow(true);
              }}
            >
              <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
              Upload Image
            </button>

            <ImageUploadModal show={show} setShow={setShow} />
          </div>
          <div className="grow">
            <label className="pb-1 block text-sm font-medium dark:text-gray-100 ">
              Select Aspect Ratio
            </label>
            <select
              required
              onChange={handleSaveAspectRatio}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={selectedFrame.aspectRatio}
            >
              <option value={AspectRatio.STANDARD}>
                {AspectRatio.STANDARD} (1:1)
              </option>
              <option value={AspectRatio.WIDE}>{AspectRatio.WIDE} (1.91:1)</option>
            </select>
          </div>
        </div>

        {selectedFrame.intents.map((intent) => (
          <IntentInput
            key={intent.id}
            intent={intent}
            handleRemoveIntent={handleRemoveIntent}
          />
        ))}
        {selectedFrame.intents.length < 4 ? (
          <button
            type="button"
            className="text-white items-center justify-center mt-3 bg-gray-600 hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
            onClick={handleAddIntent}
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Intent
          </button>
        ) : null}

        <button
          type="button"
          className="mb-8 text-white justify-center mt-3 bg-blue-600 hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
          onClick={handleSaveFrame}
        >
          <BookmarkIcon className="h-5 w-5 mr-2" />
          Save
        </button>
      </div>
    )
  );
}

export default FrameInputs;
