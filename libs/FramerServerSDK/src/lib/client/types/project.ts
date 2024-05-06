import { Project } from '@prisma/client';

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

/**
 * Create a project
 */
export type CreateProjectRequestBody = {
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

/**
 * Exposed SDK for Projects.
 */
export type ProjectSDKType = {
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
