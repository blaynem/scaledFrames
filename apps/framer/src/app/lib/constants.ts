export const PAGES = {
  API_TESTING: '/apiTesting',
  DASHBOARD: '/dashboard',
  TEAM_SETTINGS: '/dashboard/team',
  PROJECT_OVERVIEW: '/dashboard/projectOverview',
  FRAME_EDITOR: '/FrameEditor',
  SIGNUP: "/signup"
};

/**
 * A list of paths that should only be accessible in development mode.
 */
export const DEV_ONLY_PATHS = [PAGES.API_TESTING];
/**
 * A list of paths that require the user to be authenticated.
 */
export const AUTHED_PATHS = [
  PAGES.FRAME_EDITOR,
  PAGES.TEAM_SETTINGS,
  PAGES.PROJECT_OVERVIEW,
];
