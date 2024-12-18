'use client';
import { IntentType, Intents } from '@prisma/client';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { FrameResponseType } from '@framer/FramerServerSDK/client';
import { HoverCardComponent } from '../ui/HoverCard';

export interface IntentInputProps {
  intent: Intents;
  handleRemoveIntent: (id: string) => void;
  handleSaveFrame: () => void;
}

interface RenderInputProps {
  intent: Intents;
  intentType: IntentType;
  handleSetLinkUrl: (e: string) => void;
  handleSaveFrame: (e: string) => void;
  frames: FrameResponseType[];
  selectedFrame: FrameResponseType | null;
}

const RenderInputs = ({
  intentType,
  intent,
  handleSetLinkUrl,
  handleSaveFrame,
  frames,
  selectedFrame,
}: RenderInputProps) => {
  switch (intentType) {
    case IntentType.ExternalLink:
      return (
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="URL"
          value={intent.linkUrl}
          onChange={(e) => handleSetLinkUrl(e.target.value)}
          onBlur={(e) => handleSaveFrame(e.target.value)}
        />
      );
    case IntentType.InternalLink:
      // eslint-disable-next-line no-case-declarations
      const selectableFrames = frames.filter(
        (f) => f.id !== selectedFrame?.id && f.isDeleted === false
      );
      return (
        <select
          onChange={(e) => handleSetLinkUrl(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={intent.linkUrl}
          onBlur={(e) => handleSaveFrame(e.target.value)}
        >
          {selectableFrames.map((frame) => (
            <option key={frame.id} value={frame.path}>
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
      return <span>coming soon!</span>;
  }
};

export const IntentInput: React.FC<IntentInputProps> = ({
  intent,
  handleRemoveIntent,
  handleSaveFrame,
}: IntentInputProps) => {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);

  const [intentType, setIntentType] = useState<IntentType>(
    intent.type ?? IntentType.InternalLink
  );
  const [showRemove, setShowRemove] = useState(false);
  const [displayText, setDisplayText] = useState(intent?.displayText ?? '');

  const handleSetIntentType = (type: IntentType) => {
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
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium dark:text-gray-100 ">
                Type
              </label>
              <HoverCardComponent
                className="bg-white border-gray-300 border z-50"
                cardContent={
                  <ul>
                    <li><b>Internal Link:</b> Links to another frame in this project.</li>
                    <li><b>External Link:</b> Link to another website, etc.</li>
                    {/* <li><b>Post:</b> Coming soon...</li> */}
                  </ul>
              }
                headerNode={<QuestionMarkCircleIcon className="h-4 w-4" />}
              />
            </div>
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
              {/* <option value={IntentType.Post}>Post</option>
              <option value={IntentType.Transaction}>Transaction</option>
              <option value={IntentType.TextInput}>TextInput</option> */}
            </select>
          </div>
          <div className="w-full mx-1">
          <div className="flex items-center">
              <label className="mr-2 text-sm font-medium dark:text-gray-100 ">
                Intent Text
              </label>
              <HoverCardComponent
                className="bg-white border-gray-300 border z-50"
                cardContent={`The 'button' text under the frame`}
                headerNode={<QuestionMarkCircleIcon className="h-4 w-4" />}
              />
            </div>
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
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium dark:text-gray-100 ">
                Value
              </label>
              <HoverCardComponent
                className="bg-white border-gray-300 border z-50"
                cardContent={
                  <ul>
                    <li><b>Internal Link:</b> On button press, the user will be directed to the selected frame.</li>
                    <li><b>External Link:</b> On button press, the user can be directed anywhere. Typically to another website, frame, etc.</li>
                    {/* <li><b>Post:</b> Coming soon...</li> */}
                  </ul>
              }
                headerNode={<QuestionMarkCircleIcon className="h-4 w-4" />}
              />
            </div>
            <RenderInputs
              intent={intent}
              intentType={intentType}
              handleSetLinkUrl={handleSetLinkUrl}
              handleSaveFrame={handleSaveFrame}
              frames={frames}
              selectedFrame={selectedFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
