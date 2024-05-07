import { FramerClientSDKConfig, FramerClientSDKType } from './types';

const getFetch = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  return await res.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postFetch = async <T>(url: string, body: any): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
};

// Reduce boilerplate by creating a function that takes a `baseUrl` and returns a `createUrl` function.
// This way we only need to provide the baseURL once, and then we can use the `createUrl` function.
// Returns a `URL` object.
const makeCreateUrl =
  (baseUrl: string) =>
  (path: string): URL =>
    new URL(path, baseUrl);

/**
 * Framer Client SDK
 *
 * If no `config` is provided, it will default to whatever is in the `.env` file under `NEXT_PUBLIC_API_FRAMER_URL`.
 * @returns FramerClientSDK
 */
export const FramerClientSDK = (
  config?: FramerClientSDKConfig
): FramerClientSDKType => {
  // Base URL for the Framer Server. `/api` is the path for the Client APIs.
  const _baseUrl =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config?.baseUrl || process.env['NEXT_PUBLIC_API_FRAMER_URL']!;
  // Create a URL object with the base URL.
  const createUrl = makeCreateUrl(_baseUrl);

  return {
    auth: {
      requestOTP: async (body) => {
        const url = createUrl('/auth/request-otp');
        return postFetch(url.toString(), body);
      },
      verifyOTP: async (body) => {
        const url = createUrl('/auth/verify-otp');
        return postFetch(url.toString(), body);
      },
    },
    frames: {
      get: async (queries) => {
        const url = createUrl('/api/frames');
        if (queries.projectId) {
          url.searchParams.append('projectId', queries.projectId);
        }
        if (queries.title) {
          url.searchParams.append('title', queries.title);
        }
        return getFetch(url.toString());
      },
      getById: async (id) => {
        const url = createUrl(`/api/frames/${id}`);
        return getFetch(url.toString());
      },
      create: async (body) => {
        const url = createUrl('/api/frames/create');
        return postFetch(url.toString(), body);
      },
      edit: async (id, body) => {
        const url = createUrl(`/api/frames/edit/${id}`);
        return postFetch(url.toString(), body);
      },
    },
    projects: {
      get: async (queries) => {
        const url = createUrl('/api/projects');
        if (queries.isProjectLive) {
          url.searchParams.append(
            'isProjectLive',
            queries.isProjectLive.toString()
          );
        }
        return getFetch(url.toString());
      },
      getById: async (id) => {
        const url = createUrl(`/api/projects/${id}`);
        return getFetch(url.toString());
      },
      create: async (body) => {
        const url = createUrl('/api/projects/create');
        return postFetch(url.toString(), body);
      },
      edit: async (id, body) => {
        const url = createUrl(`/api/projects/edit/${id}`);
        return postFetch(url.toString(), body);
      },
    },
    users: {
      get: async (queries) => {
        const url = createUrl('/api/users');
        if (queries.id) {
          url.searchParams.append('id', queries.id);
        }
        if (queries.email) {
          url.searchParams.append('email', queries.email);
        }
        return getFetch(url.toString());
      },
      signup: async (body) => {
        const url = createUrl('/api/users/signup');
        return postFetch(url.toString(), body);
      },
    },
  };
};
