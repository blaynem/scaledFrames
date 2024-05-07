import { FramerClientSDKConfig, FramerClientSDKType } from './types';

const getFetch = (url: string) => {
  return fetch(url).then((res) => res.json());
};

const postFetch = (url: string, body: any) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};

// Reduce boilerplate by creating a function that takes a `baseUrl` and returns a `createUrl` function.
// This way we only need to provide the baseURL once, and then we can use the `createUrl` function.
// Returns a `URL` object.
const makeCreateUrl =
  (baseUrl: string) =>
  (path: string): URL => {
    const url = new URL(baseUrl);
    url.pathname += path;
    return url;
  };

/**
 * Framer Client SDK
 *
 * If no `config` is provided, it will default to `http://localhost:3000/api`.
 * @returns FramerClientSDK
 */
export const FramerClientSDK = (
  config?: FramerClientSDKConfig
): FramerClientSDKType => {
  // Base URL for the Framer Server. `/api` is the path for the Client APIs.
  const _baseUrl = config?.baseUrl || 'http://localhost:3000/api';
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
        const url = createUrl('/frames');
        if (queries.projectId) {
          url.searchParams.append('projectId', queries.projectId);
        }
        if (queries.title) {
          url.searchParams.append('title', queries.title);
        }
        return getFetch(url.toString());
      },
      getById: async (id) => {
        const url = createUrl(`/frames/${id}`);
        return getFetch(url.toString());
      },
      create: async (body) => {
        const url = createUrl('/frames/create');
        return postFetch(url.toString(), body);
      },
      edit: async (id, body) => {
        const url = createUrl(`/frames/edit/${id}`);
        return postFetch(url.toString(), body);
      },
    },
    projects: {
      get: async (queries) => {
        const url = createUrl('/projects');
        if (queries.isProjectLive) {
          url.searchParams.append(
            'isProjectLive',
            queries.isProjectLive.toString()
          );
        }
        return getFetch(url.toString());
      },
      getById: async (id) => {
        const url = createUrl(`/projects/${id}`);
        return getFetch(url.toString());
      },
      create: async (body) => {
        const url = createUrl('/projects/create');
        return postFetch(url.toString(), body);
      },
      edit: async (id, body) => {
        const url = createUrl(`/projects/edit/${id}`);
        return postFetch(url.toString(), body);
      },
    },
    users: {
      get: async (queries) => {
        const url = createUrl('/users');
        if (queries.id) {
          url.searchParams.append('id', queries.id);
        }
        if (queries.email) {
          url.searchParams.append('email', queries.email);
        }
        return getFetch(url.toString());
      },
      signup: async (body) => {
        const url = createUrl('/users/signup');
        return postFetch(url.toString(), body);
      },
    },
  };
};
