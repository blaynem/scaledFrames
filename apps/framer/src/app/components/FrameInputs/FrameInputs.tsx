'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { IntentInput } from './IntentInput';
import { IntentType, Intents } from '@prisma/client';
import { IntentTypes } from '../../lib/types';

/* eslint-disable-next-line */
export interface FrameInputsProps {}

export function FrameInputs(props: FrameInputsProps) {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [intents, setIntents] = useState(
    selectedFrame ? selectedFrame.intents : []
  );

  const exampleIntent: Intents = {
    id: '1',
    displayText: 'Example Intent',
    type: IntentType.InternalLink,
    displayOrder: intents.length + 1,
    framesId: selectedFrame ? selectedFrame.id : '1234',
    isDeleted: false,
    linkUrl: 'https://www.youtube.com',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input
        className="m-4 p-1 rounded-sm"
        type="text"
        placeholder="Name (For internal links)"
      />
      <input
        className="m-4 p-1 rounded-sm"
        type="text"
        placeholder="Image URL"
      />
      {intents.map((intent) => (
        <IntentInput key={intent.id} />
      ))}
      <button
        type="button"
        className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
        onClick={() => {
          setIntents([...intents, exampleIntent]);
        }}
      >
        <PlusCircleIcon className="h-5 w-5 mr-2" />
        Add Intent
      </button>
    </div>
  );
}

export default FrameInputs;
