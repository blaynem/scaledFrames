'use client';
import { IntentType, Intents } from '@prisma/client';
import React, { use, useContext, useEffect, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { MinusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface IntentInputProps {
  intent: Intents;
  handleRemoveIntent: (id: string) => void;
}
export const IntentInput: React.FC<IntentInputProps> = ({
  intent,
  handleRemoveIntent,
}: IntentInputProps) => {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);

  const [intentType, setIntentType] = useState<IntentType>(
    intent.type ?? IntentType.InternalLink
  );

  const [displayText, setDisplayText] = useState(intent?.displayText ?? '');

  const handleSetIntentType = (type: IntentType) => {
    setIntentType(type);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = tempFrames.findIndex(
        (frame) => frame.id === selectedFrame.id
      );
      const tempFrame = {
        ...selectedFrame,
        intents: [...selectedFrame.intents],
      };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleSetIntentText = (text: string) => {
    setDisplayText(text);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = tempFrames.findIndex(
        (frame) => frame.id === selectedFrame.id
      );
      const tempIntents = selectedFrame.intents.map((i: Intents) => {
        if (i.id === intent.id) {
          return { ...i, displayText: text };
        }
        return i;
      });

      const tempFrame = {
        ...selectedFrame,
        intents: tempIntents,
      };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  useEffect(() => {
    if (intent) {
      setIntentType(intent.type);
      setDisplayText(intent.displayText);
    }
  }, [intent]);

  const renderInputs = () => {
    switch (intentType) {
      case IntentType.ExternalLink:
        return (
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="URL"
          />
        );
      case IntentType.InternalLink:
        return (
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {frames.map((frame) => (
              <option key={frame.id} value={frame.id}>
                {frame.title}
              </option>
            ))}
          </select>
        );
      case IntentType.Post:
        return (
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Input for Type3"
          />
        );
      default:
        return <input type="number" placeholder="Input for Type2" />;
    }
  };

  return (
    <div className="mt-2 flex flex-row columns-2">
      <button
        onClick={(e) => {
          handleRemoveIntent(intent.id);
        }}
        className="mx-2 flex justify-center items-end"
      >
        <MinusCircleIcon className="m-2 rounded-sm h-8 w-8 text-red-500" />
      </button>
      <div className="w-full mx-1">
        <label className=" pt-1 block mb-2 text-sm font-medium text-gray-100 ">
          Intent Text
        </label>
        <input
          className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Intent Display Text"
          value={displayText}
          onChange={(e) => handleSetIntentText(e.target.value)}
        />
      </div>
      <div className="w-full mx-1">
        <label className="pt-1 block mb-2 text-sm font-medium text-gray-100 ">
          Type
        </label>
        <select
          className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={intentType}
          onChange={(e) => handleSetIntentType(e.target.value as IntentType)}
        >
          <option value={IntentType.InternalLink}>InternalLink</option>
          <option value={IntentType.ExternalLink}>ExternalLink</option>
          <option value={IntentType.Post}>Post</option>
        </select>
      </div>

      <div className="w-full mx-1">
        <label className="pt-1 block mb-2 text-sm font-medium text-gray-100 ">
          Value
        </label>
        {renderInputs()}
      </div>
    </div>
  );
};
