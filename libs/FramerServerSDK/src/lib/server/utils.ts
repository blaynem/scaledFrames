/**
 * Returns a URL-safe version of the provided string.
 *
 * Only alphanumerics, spaces, and hyphens are allowed.
 * Spaces are replaced with hyphens.
 *
 * Example: "Hello, World!" -> "hello-world"
 * @returns URL-safe string
 */
export const convertToUrlSafe = (val: string): string =>
  val
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

/**
 * Parsed parts of a Framer URL:
 * `https://{teamSubdomain}.framer.com/frames/{projectBasePath}/{framePath}`
 */
export type ParsedFrameUrl = {
  /**
   * The base path of the `Project` in the Framer URL.
   * Includes prepended slashes.
   */
  projectBasePath: string;
  /**
   * The path of the `frame` in the Framer URL.
   * Includes prepended slashes.
   */
  framePath: string;
  /**
   * Whether the URL is running on localhost.
   */
  isLocalhost: boolean;
  /**
   * The `subdomain` of the team in the Framer URL.
   *
   * Prefer to use projectBasePath and framePath for searching in the database.
   *
   * Since localhost doesn't have a subdomain to test this, and realistically we already
   * know the url from the project / frame paths, we likely won't use this.
   * This is mostly used for "looks" of the URL.
   */
  teamSubdomain: string;
};

/**
 * Parses a Framer URL into its parts:
 * `https://{teamSubdomain}.framer.com/frames/{projectBasePath}/{framePath}`
 *
 * Example URL: `https://nike.framer.com/frames/epic-project/some-frame`
 * Parsed URL: `{ teamSubdomain: 'nike', projectBasePath: 'epic-project', framePath: 'some-frame' }`
 * @param inputUrl
 * @returns ParsedUrl | null
 */
export const parseFramerUrl = (inputUrl: string): ParsedFrameUrl | null => {
  try {
    const url = new URL(inputUrl);
    const hostname = url.hostname;
    const paths = url.pathname.split('/').filter(Boolean); // Removes any empty strings from path split

    // Determine if running locally or on a real domain
    let teamSubdomain = '';
    if (hostname === 'localhost') {
      teamSubdomain = 'localhost'; // Localhost development scenario
    } else {
      teamSubdomain = hostname.split('.')[0]; // Extracts the subdomain from a production URL
    }

    const isLocalhost = teamSubdomain === 'localhost';

    if (paths.length < 2) {
      console.error('URL does not contain enough path segments.');
      return null; // Not enough parts in the URL
    }

    // path[0] should be 'frames'. Otherwise we shouldn't parse this.
    if (paths[0] !== 'frames') {
      throw new Error(
        `URL is not a '/frames' endpoint. Input URL: ${inputUrl}`
      );
    }

    // Project base path is the first path after 'frames'
    const projectBasePath = '/' + paths[1];
    // Frame path is the remaining paths after base path
    const framePath = '/' + paths.slice(2).join('/');

    return {
      teamSubdomain,
      projectBasePath,
      framePath,
      isLocalhost,
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};
