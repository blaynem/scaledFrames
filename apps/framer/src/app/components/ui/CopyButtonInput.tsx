import {
  CheckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [showCopied, setShowCopied] = useState(false);
  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => {
          setShowCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };
  return (
    <button
      className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
      onClick={handleCopy}
    >
      {showCopied ? (
        <CheckIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
};

/**
 * A read-only input with a copy button.
 *
 * Can provide a `textToCopy` prop to copy a different value than the input value
 */
export const CopyButtonInput = ({
  textToCopy,
  value,
}: {
  /**
   * If provided, this text will be copied instead of the value prop
   */
  textToCopy?: string;
  value: string;
}) => (
  <div className="relative">
    <input
      disabled
      readOnly
      className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      type="text"
      value={value}
    />
    <CopyButton textToCopy={textToCopy ?? value} />
  </div>
);
