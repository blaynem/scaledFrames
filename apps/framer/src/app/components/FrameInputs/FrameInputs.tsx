'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { IntentInput } from './IntentInput';
import { IntentType } from '@prisma/client';

import { FramerClientSDK } from '@framer/FramerServerSDK/client';

/* eslint-disable-next-line */
export interface FrameInputsProps {}

export function FrameInputs(props: FrameInputsProps) {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [intents, setIntents] = useState(
    selectedFrame ? selectedFrame.intents : []
  );
  const [title, setTitle] = useState(selectedFrame ? selectedFrame.title : '');
  const [path, setPath] = useState(selectedFrame ? selectedFrame.path : '');

  useEffect(() => {
    if (selectedFrame) {
      setTitle(selectedFrame.title);
      setIntents(selectedFrame.intents);
      setPath(selectedFrame.path);
    }
  }, [selectedFrame, frames]);

  const handleAddIntent = () => {
    const exampleIntent = {
      id: `${intents.length + 1}`,
      displayText: 'Example Intent',
      type: IntentType.InternalLink,
      displayOrder: intents.length + 1,
      framesId: selectedFrame ? selectedFrame.id : '1234',
      isDeleted: false,
      linkUrl: 'https://www.framer.com',
    };

    if (selectedFrame) {
      selectedFrame.intents = [...selectedFrame.intents, exampleIntent];
      const idx = frames.findIndex((frame) => frame.id === selectedFrame.id);
      frames[idx] = selectedFrame;
    }

    setIntents([...intents, exampleIntent]);
    setFrameEditorContext(frames, selectedFrame);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="block mb-2 text-sm font-medium text-gray-100 ">
        Title
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <label className=" pt-1 block mb-2 text-sm font-medium text-gray-100 ">
        Path
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder="Path"
        value={path}
        onChange={(e) => {
          setPath(e.target.value);
        }}
      />
      {selectedFrame &&
        selectedFrame.intents.map((intent) => <IntentInput key={intent.id} />)}
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
    </div>
  );
}

export default FrameInputs;
