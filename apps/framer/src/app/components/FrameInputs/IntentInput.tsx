'use client';
import { IntentType, Intents } from '@prisma/client';
import React, { useContext, useEffect, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { XCircleIcon } from '@heroicons/react/24/outline';

export interface IntentInputProps {
  intent: Intents;
  handleRemoveIntent: (id: string) => void;
  handleSaveFrame: () => void;
  setHasChanges: (hasChanges: boolean) => void;
}
export const IntentInput: React.FC<IntentInputProps> = ({
  intent,
  handleRemoveIntent,
  handleSaveFrame,
  setHasChanges,
}: IntentInputProps) => {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);

  const [intentType, setIntentType] = useState<IntentType>(
    intent.type ?? IntentType.InternalLink
  );
  const [showRemove, setShowRemove] = useState(false);
  const [displayText, setDisplayText] = useState(intent?.displayText ?? '');

  const handleSetIntentType = (type: IntentType) => {
    setHasChanges(true);
    setIntentType(type);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = tempFrames.findIndex(
        (frame) => frame.id === selectedFrame.id
      );
      const tempIntents = selectedFrame.intents.map((i: Intents) => {
        if (i.id === intent.id) {
          return { ...i, type };
        }
        return i;
      });

      const tempFrame = {
        ...selectedFrame,
        intents: [...tempIntents],
      };
      tempFrames[idx] = tempFrame;
      setFrameEditorContext(tempFrames, tempFrame);
    }
  };

  const handleSetLinkUrl = (linkUrl: string) => {
    setHasChanges(true);
    if (selectedFrame) {
      const tempFrames = [...frames];
      const idx = tempFrames.findIndex(
        (frame) => frame.id === selectedFrame.id
      );
      const tempIntents = selectedFrame.intents.map((i: Intents) => {
        if (i.id === intent.id) {
          return { ...i, linkUrl };
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

  const handleSetIntentText = (text: string) => {
    setHasChanges(true);
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
            value={intent.linkUrl}
            onChange={(e) => handleSetLinkUrl(e.target.value)}
            onBlur={handleSaveFrame}
          />
        );
      case IntentType.InternalLink:
        return (
          <select
            onChange={(e) => handleSetLinkUrl(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={intent.linkUrl}
            onBlur={handleSaveFrame}
          >
            {frames.map((frame) => {
              if (
                selectedFrame &&
                frame.id !== selectedFrame.id &&
                frame.isDeleted === false
              ) {
                if (
                  frames.length === 2 &&
                  frame.path !== selectedFrame.path &&
                  frame.path !== intent.linkUrl
                ) {
                  // If there are only two frames, and the frame is not the selected frame or the current linkUrl, set the linkUrl to the frame path
                  // basically guarantees that the linkUrl will be set to the other frame if there are only 2 frames.
                  handleSetLinkUrl(frame.path);
                }
                return (
                  <option key={frame.id} value={frame.path}>
                    {frame.title}
                  </option>
                );
              }
            })}
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
        return <span>coming soon!</span>;
    }
  };

  return (
    <div
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
      className="grid relative grid-cols-8 w-full items-center justify-center h-full my-6"
    >
      <button
        onClick={() => {
          handleRemoveIntent(intent.id);
        }}
        className="absolute -top-2 -right-2 bg-white rounded-full"
        style={{ display: showRemove ? 'block' : 'none' }}
      >
        <XCircleIcon className="h-8 w-8 text-red-500" />
      </button>
      <div className="grid col-span-8 mt-2 flex flex-col w-full h-full ">
        <div className="flex flex-row">
          <div className="w-full mx-1">
            <label className="pt-1 block mb-2 text-sm font-medium dark:text-gray-100 ">
              Type
            </label>
            <select
              className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={intentType}
              onChange={(e) =>
                handleSetIntentType(e.target.value as IntentType)
              }
              onBlur={handleSaveFrame}
            >
              <option value={IntentType.InternalLink}>InternalLink</option>
              <option value={IntentType.ExternalLink}>ExternalLink</option>
              <option value={IntentType.Post}>Post</option>
              <option value={IntentType.Transaction}>Transaction</option>
              <option value={IntentType.TextInput}>TextInput</option>
            </select>
          </div>
          <div className="w-full mx-1">
            <label className=" pt-1 block mb-2 text-sm font-medium dark:text-gray-100 ">
              Intent Text
            </label>
            <input
              className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Intent Display Text"
              value={displayText}
              onChange={(e) => handleSetIntentText(e.target.value)}
              onBlur={handleSaveFrame}
            />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-full mx-1">
            <label className="pt-1 block mb-2 text-sm font-medium dark:text-gray-100 ">
              Value
            </label>
            {renderInputs()}
          </div>
        </div>
      </div>
    </div>
  );
};
