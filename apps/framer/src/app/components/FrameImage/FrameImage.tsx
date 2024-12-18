import { useEffect, useState } from 'react';
/* eslint-disable-next-line */
export interface FrameImageProps {
  aspectRatio: string;
  imageUrl: string;
}

export function FrameImage({ aspectRatio, imageUrl }: FrameImageProps) {
  console.log({aspectRatio})
  const [showPlaceHolder, setShowPlaceHolder] = useState(false);

  const toggleShowPlaceHolder = (show: boolean) => {
    setShowPlaceHolder(show);
  };

  useEffect(() => {
    setShowPlaceHolder(false);
  }, [imageUrl]);

  return (
    <div className="w-full h-full items-center">
      {!showPlaceHolder && (
        <img
          className={'w-full h-full rounded-t-md object-cover'}
          src={imageUrl}
          alt="frame"
          style={{ aspectRatio: aspectRatio }}
          onError={() => toggleShowPlaceHolder(true)}
          onLoad={() => toggleShowPlaceHolder(false)}
        />
      )}
      {showPlaceHolder && (
        <div
          className={
            'flex grow items-center w-full justify-center h-64 bg-gray-200 rounded-t-md'
          }
        >
          <p className={'text-gray-500'}>No Image</p>
        </div>
      )}
    </div>
  );
}

export default FrameImage;
