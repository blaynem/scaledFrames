import { FrameSDKType } from './frames';
import { ProjectSDKType } from './project';
import { UserSDKType } from './user';
import { UsersSDKType } from './users';

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
   * API endpoints for signed in user.
   */
  user: UserSDKType;
  /**
   * API endpoints for users
   */
  users: UsersSDKType;
};
