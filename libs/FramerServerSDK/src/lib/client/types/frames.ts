import { Frame, Intents } from '@prisma/client';

// Frame fields that are allowed to be edited by the user.
type EditableFrameFields = Pick<
  Frame,
  | 'path'
  | 'title'
  | 'imageUrl'
  | 'aspectRatio'
  | 'imageLinkUrl'
  | 'imageType'
  | 'isDeleted'
>;
/**
 * Fields that are returned to the user when fetching a frame.
 *
 * Removes fields that should not be returned to the user.
 */
export type FrameResponseType = Frame & {
  intents: Intents[];
};

export type GetFrameRequestQueries = {
  projectId: string;
  title?: string;
};
export type GetFrameResponse = FrameResponseType | { error: string };
export type GetFramesResponse = FrameResponseType[] | { error: string };
export type CreateFrameResponse = FrameResponseType | { error: string };
export type EditFrameResponse = FrameResponseType | { error: string };

/**
 * Request body to create a Frame.
 */
export type CreateFrameRequestBody = {
  /**
   * Id of Team the project belongs to.
   */
  teamId: string;
  /**
   * Id of the Project this belongs to.
   */
  projectId: string;
} & EditableFrameFields;
/**
 * Request body to edit a Frame.
 *
 * Required fields: userId, teamId, projectId
 */
export type EditFrameRequestBody = {
  /**
   * Id of Team the project belongs to.
   */
  teamId: string;
  /**
   * Id of the Project this belongs to.
   */
  projectId: string;
} & Partial<EditableFrameFields>;

/**
 * Request body to save an image to a frame when using the SDK.
 */
export type ImageSaveSDKBody = {
  teamId: string;
  projectId: string;
  frameId: string;
  file: File;
  /**
   * If there is a previous frame image url, we will delete it. Otherwise we will have orphaned images in the bucket.
   *
   * Should include the full url of the previous image.
   * Ex: "http://127.0.0.1:54321/storage/v1/object/public/frames/19fc30af-8add-410c-b09f-25606acf5429/82620023-094c-453e-bfe4-1b5e89e77599/ba010cf7-fdfe-4141-8f2f-e72e481086e0/5u8ytcnxm5n"
   */
  previousFrameImageUrl?: string;
};
/**
 * Request body to save an image to a frame through our Server.
 */
export type ImageSaveToFrameBodyServer = {
  teamId: string;
  projectId: string;
  frameId: string;
  imageUrl: string;
};

/**
 * Exposed SDK for Frames.
 */
export type FrameSDKType = {
  /**
   * Get all frames for a project
   * @param queries projectId, title
   * @returns FrameResponseType[] | { error: string}
   */
  get: (queries: GetFrameRequestQueries) => Promise<GetFramesResponse>;
  /**
   * Get a frame by id
   * @param id Frame id
   * @returns FrameResponseType | { error: string}
   */
  getById: (id: string) => Promise<GetFrameResponse>;
  /**
   * Create a frame
   * @param body userId, teamId, projectId, path, title, imageUrl, aspectRatio, imageLinkUrl, imageType
   * @returns FrameResponseType | { error: string}
   */
  create: (body: CreateFrameRequestBody) => Promise<CreateFrameResponse>;
  /**
   * Edit a frame
   * @param id Frame id
   * @param body userId, teamId, projectId, path, title, imageUrl, aspectRatio, imageLinkUrl, imageType
   * @returns FrameResponseType | { error: string}
   */
  edit: (id: string, body: EditFrameRequestBody) => Promise<EditFrameResponse>;
  /**
   * Related image operations
   */
  image: {
    /**
     * Saves an image to a frame.
     * This will upload it to the bucket, add the url to the frame in the db, and return the updated frame.
     * @returns FrameResponseType | { error: string}
     */
    saveToFrame: (body: ImageSaveSDKBody) => Promise<EditFrameResponse>;
  };
};
