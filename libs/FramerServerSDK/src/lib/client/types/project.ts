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
