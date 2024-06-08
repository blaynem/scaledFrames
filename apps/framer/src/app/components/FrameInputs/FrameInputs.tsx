'use client';

import {
  ArrowUpOnSquareIcon,
  BookmarkIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useContext, useEffect, useRef, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { IntentInput } from './IntentInput';
import { IntentType } from '@prisma/client';
import {
  EditFrameRequestBody,
  FramerClientSDK,
} from '@framer/FramerServerSDK/client';
import { findFrameIdxById } from '../../utils/utils';
import { ToastTypes } from '../Toasts/GenericToast';
import { useToast } from '../Toasts/ToastProvider';
import { APP_DOMAIN } from '@framer/FramerServerSDK';

/* eslint-disable-next-line */
export interface FrameInputsProps {}

export function FrameInputs(props: FrameInputsProps) {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [intents, setIntents] = useState(
    selectedFrame ? selectedFrame.intents : []
  );
  const { addToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(selectedFrame ? selectedFrame.title : '');
  const [path, setPath] = useState(selectedFrame ? selectedFrame.path : '');
  const [imageUrl, setImageUrl] = useState(
    selectedFrame ? selectedFrame.imageUrl : ''
  );

  const fileSelectedHandler = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChangeImageUrlUpload(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (selectedFrame) {
      setTitle(selectedFrame.title);
      setIntents(selectedFrame.intents);
      setPath(selectedFrame.path);
    }
  }, [selectedFrame, frames]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, title: e.target.value };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };
  const handleAddIntent = () => {
    const exampleIntent = {
      id: `${intents.length + 1}`,
      displayText: 'Example Intent',
      type: IntentType.InternalLink,
      displayOrder: intents.length + 1,
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

      setIntents([...intents, exampleIntent]);
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

      setIntents(tempIntents);
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };
  const handleChangeImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, imageUrl: e.target.value };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleChangeImageUrlUpload = (preview: string) => {
    setImageUrl(preview);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = findFrameIdxById(tempFrames, selectedFrame.id);
      const tempFrame = { ...selectedFrame, imageUrl: preview };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleSaveFrame = async () => {
    const clientSdk = FramerClientSDK();
    const loadingToast = addToast(ToastTypes.LOADING, 'Saving', 'infinite');
    if (selectedFrame) {
      const body: EditFrameRequestBody = {
        projectId: selectedFrame.projectId,
        teamId: selectedFrame?.teamId,
        title: title,
        path: path,
        imageUrl: imageUrl,
        isDeleted: false,
        intents: selectedFrame.intents,
      };
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
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    selectedFrame && (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-100 ">
            Title
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Title"
            value={title}
            onChange={handleChangeTitle}
          />
        </div>

        <div>
          <label className=" pt-1 block mb-2 text-sm font-medium text-gray-100 ">
            Path
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Path"
            value={path}
            onChange={(e) => {
              setPath(e.target.value);
            }}
          />
        </div>
        <div className="w-full">
          <div className="relative flex flex-col">
            <label className=" pt-1 block mb-2 text-sm font-medium text-gray-100 ">
              Image URL/Upload
            </label>

            <input
              id="npm-install-copy-button"
              type="text"
              className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              style={selectedFile ? { display: 'none' } : {}} // hide the input if file is selected
              value={imageUrl}
              onChange={handleChangeImageUrl}
            />

            <input
              className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              id="file_input"
              type="file"
              ref={fileInputRef}
              style={selectedFile ? {} : { display: 'none' }} // hide the input if file is not selected
              onChange={fileSelectedHandler}
            />

            <button
              type="button"
              onClick={() => handleButtonClick()}
              className="mr-1 mt-0.5 absolute top-8 end-2 self-end text-gray-500 dark:text-gray-400 hover:text-gray-100 hover:bg-gray-300 rounded-lg p-2 inline-flex items-center justify-center"
            >
              <ArrowUpOnSquareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {selectedFrame &&
          selectedFrame.intents.map((intent) => (
            <IntentInput
              key={intent.id}
              intent={intent}
              handleRemoveIntent={handleRemoveIntent}
            />
          ))}
        {selectedFrame && selectedFrame.intents.length < 4 ? (
          <button
            type="button"
            className="text-white mt-3 bg-gray-600 hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
            onClick={() => {
              handleAddIntent();
            }}
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Intent
          </button>
        ) : null}
        {selectedFrame ? (
          <button
            type="button"
            className="text-white mt-3 bg-blue-600 hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
            onClick={() => {
              handleSaveFrame();
            }}
          >
            <BookmarkIcon className="h-5 w-5 mr-2" />
            Save
          </button>
        ) : null}
      </div>
    )
  );
}

export default FrameInputs;
