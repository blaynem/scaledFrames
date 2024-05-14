'use client';
import { IntentType, Intents } from '@prisma/client';
import React, { useState } from 'react';

export interface IntentInputProps {
  intent?: Intents;
}
export const IntentInput: React.FC<IntentInputProps> = ({
  intent,
}: IntentInputProps) => {
  const [intentType, setIntentType] = useState<IntentType>(
    IntentType.InternalLink
  );

  const handleIntentTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIntentType(event.target.value as IntentType);
  };

  const renderInputs = () => {
    switch (intentType) {
      case IntentType.ExternalLink:
        return <input type="text" placeholder="Input for Type1" />;
      case IntentType.InternalLink:
        return <input type="number" placeholder="Input for Type2" />;
      case IntentType.Post:
        return <input type="date" placeholder="Input for Type3" />;
      default:
        return <input type="number" placeholder="Input for Type2" />;
    }
  };

  return (
    <div>
      <select
        className="m-4 p-1 rounded-sm"
        value={intentType}
        onChange={handleIntentTypeChange}
      >
        <option value={IntentType.InternalLink}>InternalLink</option>
        <option value={IntentType.ExternalLink}>ExternalLink</option>
        <option value={IntentType.Post}>Post</option>
      </select>
      {renderInputs()}
    </div>
  );
};
