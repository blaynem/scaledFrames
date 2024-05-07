import { FrameSDKType } from './frames';
import { ProjectSDKType } from './project';
import { UsersSDKType } from './user';

export type FramerClientSDKConfig = {
  /**
   * Base URL for the Framer Server
   *
   * Defaults to what is in the .env.local NEXT_PUBLIC_API_FRAMER_URL
   */
  baseUrl?: string;
};

/**
 * All available API endpoints for the Framer Server
 */
export type FramerClientSDKType = {
  /**
   * API endpoints for frames
   */
  frames: FrameSDKType;
  /**
   * API endpoints for projects
   */
  projects: ProjectSDKType;
  /**
   * API endpoints for users
   */
  users: UsersSDKType;
};
