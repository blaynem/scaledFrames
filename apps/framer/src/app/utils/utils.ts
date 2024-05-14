import {
  FrameResponseType,
  FramerClientSDK,
  GetFramesResponse,
} from '@framer/FramerServerSDK/client';

const framerSDK = FramerClientSDK();

export async function getFrames(
  projectId: string
): Promise<FrameResponseType[]> {
  let response: GetFramesResponse;
  response = await framerSDK.frames.get({ projectId });
  if ('error' in response) {
    console.error(response.error);
    throw new Error(response.error);
  } else {
    return response;
  }
}
