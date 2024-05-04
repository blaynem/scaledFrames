import { Frame, Project, SubscriptionType, User } from '@prisma/client';

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

/**
 * Required fields for a user signup
 */
export type UserSignupRequestBody = {
  displayName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  /**
   * Defaults to SubscriptionType.Free
   */
  subscriptionType?: SubscriptionType;
};

/**
 * On a user signup, we want to return everything that was created.
 */
export type UserSignupResponse =
  | {
      userId: string;
      teamId: string;
      projectId: string;
    }
  | { error: string };

export type GetUsersRequestQueries = {
  id?: string;
  email?: string;
};

export type GetUsersResponse = User | { error: string };

/**
 * All methods act as a filter
 */
export type GetProjectsRequestQueries = {
  /**
   * Filter by isProjectLive. If not present, is not filtered.
   */
  isProjectLive?: boolean;
};
export type GetProjectResponse = Project | { error: string };
export type GetProjectsResponse = Project[] | { error: string };

export type FrameEditableType = {
  /**
   * Id of User who is editing the project.
   */
  userId: string;
  /**
   * Id of Team the project belongs to.
   */
  teamId: string;
  /**
   * Id of the Project this belongs to.
   */
  projectId: string;
} & Pick<
  Frame,
  'path' | 'title' | 'imageUrl' | 'aspectRatio' | 'imageLinkUrl' | 'imageType'
>;

export type FrameResponseType = Pick<
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

export type CreateFrameRequestBody = FrameEditableType;
export type CreateFrameResponse = FrameResponseType | { error: string };
export type EditFrameRequestBody = FrameEditableType;
export type EditFrameResponse = FrameResponseType | { error: string };

/**
 * Create a project
 */
export type CreateProjectRequestBody = {
  /**
   * Id of User who is creating the project.
   */
  userId: string;
  /**
   * Id of Team that this Project belongs to.
   */
  teamId: string;
  /**
   * Title of the project.
   */
  title: string;
  /**
   * Description of the project.
   */
  description?: string;
  /**
   * Notes for the project.
   */
  notes?: string;
  /**
   * What URL should be fallen back to if the project is viewed on an unsupported device.
   */
  customFallbackUrl?: string;
};
export type CreateProjectResponse = Project | { error: string };
export type EditProjectRequestBody = {
  /**
   * Id of User who is editing the project.
   */
  userId: string;
  /**
   * Id of Team the project belongs to.
   */
  teamId: string;
  /**
   * Title of the project.
   */
  title?: string;
  /**
   * Description of the project.
   */
  description?: string;
  /**
   * Notes for the project.
   */
  notes?: string;
  /**
   * Is the project live?
   */
  isProjectLive?: boolean;
};
