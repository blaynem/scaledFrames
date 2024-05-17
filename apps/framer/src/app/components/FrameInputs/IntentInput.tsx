'use client';
import { IntentType, Intents } from '@prisma/client';
import React, { use, useContext, useEffect, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';

export interface IntentInputProps {
  intent?: Intents;
}
export const IntentInput: React.FC<IntentInputProps> = ({
  intent,
}: IntentInputProps) => {
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);

  const [intentType, setIntentType] = useState<IntentType>(
    intent?.type ?? IntentType.InternalLink
  );

  const [displayText, setDisplayText] = useState(intent?.displayText ?? '');
  const handleIntentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIntentType(event.target.value as IntentType);
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
    <div className="mt-2 flex flex-row columns-3">
      <div className="w-full mx-1">
        <label className=" pt-1 block mb-2 text-sm font-medium text-gray-100 ">
          Intent Text
        </label>
        <input
          className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Intent Display Text"
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
        />
      </div>
      <div className="w-full mx-1">
        <label className="pt-1 block mb-2 text-sm font-medium text-gray-100 ">
          Type
        </label>
        <select
          className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={intentType}
          onChange={handleIntentTypeChange}
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
