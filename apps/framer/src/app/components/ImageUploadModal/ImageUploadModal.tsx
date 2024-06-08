import {
  FramerClientSDK,
  ImageSaveSDKBody,
} from '@framer/FramerServerSDK/client';
import { PhotoIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useContext, useRef, useState } from 'react';
import { FrameEditorContext } from '../../FrameEditor/[projectId]/page';
import { findFrameIdxById } from '../../utils/utils';

type ImageUploadModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  handleChangeImageUrl: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  show,
  setShow,
  handleChangeImageUrl,
}: ImageUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const clientSdk = FramerClientSDK();
  const { frames, selectedFrame, setFrameEditorContext } =
    useContext(FrameEditorContext);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      handleGetPreviewUrl(file);
    }
  };

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedImage(event.dataTransfer.files[0]);
      const file = event.dataTransfer.files[0];
      handleGetPreviewUrl(file);
      // Create a preview of the selected image
    }
  };

  const handleGetPreviewUrl = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleUpload = async () => {
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
    setPreviewSrc(frame.imageUrl);
    setFrameEditorContext(tempFrames, tempFrame);
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
            onClick={() => setShow(false)}
          >
            <XCircleIcon className="text-gray-400 h-12 w-12" />
          </button>
        </div>
        <input
          id="npm-install-copy-button"
          type="text"
          placeholder="Paste Image URL"
          className="col-span-6 mb-2 bg-gray-50 border border-gray-300 text-gray-500 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={handleChangeImageUrl}
        />
        <div className="flex flex-row items-center justify-center my-2">
          <div className="h-0 w-full border border-gray-200"></div>
          <div className="text-sm  text-center text-gray-500 mx-4">or</div>
          <div className="h-0 w-full border border-gray-200"></div>
        </div>

        <div
          onDragOver={preventDefaults}
          onDrop={handleImageDrop}
          onClick={handleImageUpload}
          className="flex flex-col  rounded-lg h-80 w-96 "
        >
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              className={'rounded-lg object-cover h-80 w-96'}
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
          onChange={handleImageChange}
        />
        <div className="flex w-full flex-row">
          <button
            onClick={() => setShow(false)}
            className="w-full bg-red-500 text-white rounded-lg p-2 m-2"
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
