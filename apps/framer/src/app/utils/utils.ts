import {
  FrameResponseType,
  FramerClientSDK,
  GetFramesResponse,
} from '@framer/FramerServerSDK/client';

const framerSDK = FramerClientSDK();

export async function getFrames(
  projectId: string
): Promise<FrameResponseType[]> {
  const response: GetFramesResponse = await framerSDK.frames.get({ projectId });
  if ('error' in response) {
    console.error(response.error);
    throw new Error(response.error);
  } else {
    return response;
  }
}

export function findFrameIdxById(frames: FrameResponseType[], id: string) {
  return frames.findIndex((frame) => frame.id === id);
}
