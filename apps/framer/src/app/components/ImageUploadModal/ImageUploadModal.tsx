import {
  FramerClientSDK,
  ImageSaveSDKBody,
} from '@framer/FramerServerSDK/client';
import { PhotoIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useContext, useRef, useState } from 'react';
import { FrameEditorContext } from '../../lib/frame-context';
import { findFrameIdxById } from '../../utils/utils';

type ImageUploadModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  show,
  setShow,
}: ImageUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const clientSdk = FramerClientSDK();
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  const handleSetSelectedImage = (file: File) => {
    setSelectedImage(file);
    handleGetPreviewUrl(file);
  };

  const handleGetPreviewUrl = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result as string);
      return reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleChangePreviewImageUrl = async (imageUrl: string) => {
    setImageUrlInput(imageUrl);
    setPreviewSrc(imageUrl);
    try {
      // Fetch the image
      const blob: Blob | null = await fetch(imageUrl)
        .then((res) => {
          return res.blob();
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
          setPreviewSrc('');
          return null;
        });

      if (!blob) return;

      const file = new File([blob], 'image.png', { type: 'image/png' });
      handleSetSelectedImage(file);
    } catch (error) {
      console.error('Error fetching or converting image:', error);
    }
  };

  const handleUpload = async () => {
    setImageUrlInput('');
    if (!selectedImage || !selectedFrame) return;

    const body: ImageSaveSDKBody = {
      file: selectedImage,
      frameId: selectedFrame?.id,
      projectId: selectedFrame?.projectId,
      teamId: selectedFrame?.teamId,
      previousFrameImageUrl: selectedFrame?.imageUrl,
    };
    const frame = await clientSdk.frames.image.saveToFrame(body);
    if ('error' in frame) {
      console.error(frame.error);
      return;
    }
    const tempFrames = [...frames];
    const idx = findFrameIdxById(tempFrames, selectedFrame.id);
    const tempFrame = { ...selectedFrame, imageUrl: frame.imageUrl };
    tempFrames[idx] = tempFrame;

    setFrameEditorContext(tempFrames, tempFrame);
    handleClose();
  };

  const handleClose = () => {
    setPreviewSrc('');
    setSelectedImage(null);
    setImageUrlInput('');
    setShow(false);
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClearPreview = () => {
    setImageUrlInput('');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleSetSelectedImage(
        event.dataTransfer.files[event.dataTransfer.files.length - 1]
      );
    }
  };

  return (
    <div
      className="flex w-screen h-screen top-0 right-0 fixed items-center justify-center bg-gray-200 bg-opacity-50 z-50"
      style={{ display: show ? 'flex' : 'none' }}
    >
      <div className="flex bg-white p-6 rounded-lg flex-col ">
        <div className="flex justify-between m-3">
          <h1 className="text-xl font-bold">Upload Image</h1>
          <button
            className="text-white rounded-lg relative -top-4 -right-4"
            onClick={() => handleClose()}
          >
            <XCircleIcon className="text-gray-400 h-12 w-12" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Paste Image URL"
          className="col-span-6 mb-2 bg-gray-50 border border-gray-300 text-gray-500 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => handleChangePreviewImageUrl(e.target.value)}
          value={imageUrlInput}
        />
        <div className="flex flex-row items-center justify-center my-2">
          <div className="h-0 w-full border border-gray-200"></div>
          <div className="text-sm  text-center text-gray-500 mx-4">or</div>
          <div className="h-0 w-full border border-gray-200"></div>
        </div>
        <div
          onDragOver={preventDefaults}
          onDrop={handleDrop}
          onClick={handleImageUpload}
          className="flex flex-col  rounded-lg h-80 w-96 "
        >
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              className={'rounded-lg object-cover h-80 w-96'}
              onError={() => setPreviewSrc('')}
            />
          ) : (
            <div className="flex flex-col bg-gray-300  border-2 border-gray-400 border-dashed items-center  justify-center rounded-lg h-80 w-96 text-white">
              <PhotoIcon className="h-12 w-12" />
              <p>Click to upload </p>
              <p>or</p> <p> Drag and Drop an Image</p>
            </div>
          )}
        </div>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClearPreview();
            if (e.target.files && e.target.files.length > 0)
              handleSetSelectedImage(e.target.files[0]);
          }}
        />
        <div className="flex w-full flex-row">
          <button
            onClick={() => handleClose()}
            className="w-full border-2 rounded-lg p-2 m-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-500 w-full text-white rounded-lg p-2 m-2"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
