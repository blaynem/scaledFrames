import {
  GetFrameRequestQueries,
  GetFramesResponse,
  GetFrameResponse,
  CreateFrameRequestBody,
  CreateFrameResponse,
  EditFrameRequestBody,
  EditFrameResponse,
} from './frames';
import {
  GetProjectsRequestQueries,
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectRequestBody,
  CreateProjectResponse,
  EditProjectRequestBody,
} from './project';
import {
  GetUsersRequestQueries,
  GetUsersResponse,
  UserSignupRequestBody,
  UserSignupResponse,
} from './user';

/**
 * All available API endpoints for the Framer Server
 */
export type FramerClientSDKType = {
  /**
   * API endpoints for users
   */
  users: {
    /**
     * Get a user by either the id or email. One must be supplied.
     * @param queries id, email
     * @returns User | { error: string}
     */
    get: (queries: GetUsersRequestQueries) => Promise<GetUsersResponse>;
    /**
     * Signup a user. Creates a user, team, and project.
     *
     * This login should only be called from the Supabase auth client I believe...
     * @param body
     * @returns UserSignupResponse | { error: string}
     */
    signup: (body: UserSignupRequestBody) => Promise<UserSignupResponse>;
  };
  /**
   * API endpoints for projects
   */
  projects: {
    /**
     * Get all projects, or filter by isProjectLive
     * @param queries isProjectLive
     * @returns Project[] | { error: string}
     */
    get: (queries: GetProjectsRequestQueries) => Promise<GetProjectsResponse>;
    /**
     * Get a project by id
     * @param id project id
     * @returns Project | { error: string}
     */
    getById: (id: string) => Promise<GetProjectResponse>;
    /**
     * Create a project. Also creates an initial frame and intent for the project.
     * @param body userId, teamId, title, description, notes
     * @returns Project | { error: string}
     */
    create: (body: CreateProjectRequestBody) => Promise<CreateProjectResponse>;
    /**
     * Edit a project
     * @param id Project id
     * @param body userId, teamId, title, description, notes, isProjectLive
     * @returns Project | { error: string}
     */
    edit: (
      id: string,
      body: EditProjectRequestBody
    ) => Promise<CreateProjectResponse>;
  };
  /**
   * API endpoints for frames
   */
  frames: {
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
    edit: (
      id: string,
      body: EditFrameRequestBody
    ) => Promise<EditFrameResponse>;
  };
};
