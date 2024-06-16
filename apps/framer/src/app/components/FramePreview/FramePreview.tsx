import { XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface FramePreviewProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
  aspectRatio: number;
  handleRemove: () => void;
}

export function FramePreview({
  imageUrl,
  title,
  onClick,
  isSelected,
  aspectRatio,
  handleRemove,
}: FramePreviewProps) {
  const [showPlaceHolder, setShowPlaceHolder] = useState(true);
  const [showRemove, setShowRemove] = useState(false);
  const toggleShowPlaceHolder = (show: boolean) => {
    setShowPlaceHolder(show);
  };

  useEffect(() => {
    setShowPlaceHolder(false);
  }, [imageUrl]);

  return (
    <div
      className={
        isSelected
          ? 'm-1 mb-3 p-1 rounded-lg bg-slate-700 border-2 border-blue-500 h-9/12 w-9/12 relative'
          : 'm-1 mb-3 p-1 rounded-lg bg-slate-700 from-blue-100  border-1 border-white h-9/12 w-9/12 relative'
      }
      onClick={() => onClick()}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <button
        className="absolute -top-2 -right-4 bg-white rounded-full "
        onClick={() => handleRemove()}
        style={{ display: showRemove ? 'block' : 'none' }}
      >
        <XCircleIcon className="rounded-sm lg:h-6 lg:w-6 md:w-4 md:h-4 sm:w-2 sm:h-2 text-red-500" />
      </button>
      <div className="flex flex-col items-center justify-center  w-full">
        {!showPlaceHolder && (
          <img
            className="rounded-md object-cover"
            style={{ aspectRatio: aspectRatio }}
            src={imageUrl}
            alt={'no image'}
            onError={() => toggleShowPlaceHolder(true)}
            onLoadStart={() => toggleShowPlaceHolder(true)}
          />
        )}
        {showPlaceHolder && (
          <div
            className={
              'flex grow items-center justify-center h-32 w-full bg-gray-200 rounded-md'
            }
          >
            <p className={'text-gray-500'}>No Image</p>
          </div>
        )}
      </div>

      <h2 className="text-center text-gray-100">{title}</h2>
    </div>
  );
}

export default FramePreview;
