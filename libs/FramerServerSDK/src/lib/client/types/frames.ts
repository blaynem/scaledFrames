import { Frame } from '@prisma/client';

// Frame fields that are allowed to be edited by the user.
type EditableFrameFields = Pick<
  Frame,
  'path' | 'title' | 'imageUrl' | 'aspectRatio' | 'imageLinkUrl' | 'imageType'
>;
/**
 * Fields that are returned to the user when fetching a frame.
 *
 * Removes fields that should not be returned to the user.
 */
type FrameResponseType = Pick<
  Frame,
  | 'id'
  | 'path'
  | 'title'
  | 'imageUrl'
  | 'aspectRatio'
  | 'imageLinkUrl'
  | 'imageType'
  | 'lastUpdatedById'
  | 'projectId'
  | 'teamId'
>;

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
};
