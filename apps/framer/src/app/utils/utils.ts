import {
  FrameResponseType,
  FramerClientSDK,
  GetFramesResponse,
} from '@framer/FramerServerSDK';
import { createSupabaseClient } from '@framer/FramerServerSDK/client';

const framerSDK = FramerClientSDK();
const supabaseClient = createSupabaseClient();
export async function getFrames(
  projectId: string,
  title?: string
): Promise<FrameResponseType[]> {
  let response: GetFramesResponse;
  response = await framerSDK.frames.get({ projectId, title });
  if ('error' in response) {
    console.error(response.error);
    throw new Error(response.error);
  } else {
    return response;
  }
}
