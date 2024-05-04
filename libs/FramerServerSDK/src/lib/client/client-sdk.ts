import { FramerClientSDKConfig, FramerClientSDKType } from './types';

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

  return {
    users: {
      get: async (queries) => {
        const url = new URL(_baseUrl);
        url.pathname += '/users';
        if (queries.id) {
          url.searchParams.append('id', queries.id);
        }
        if (queries.email) {
          url.searchParams.append('email', queries.email);
        }
        return fetch(url.toString()).then((res) => res.json());
      },
      signup: async (body) => {
        const url = new URL(_baseUrl);
        url.pathname += '/users/signup';
        return fetch(url.toString(), {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
      },
    },
    projects: {
      get: async (queries) => {
        const url = new URL(_baseUrl);
        url.pathname += '/projects';
        if (queries.isProjectLive) {
          url.searchParams.append(
            'isProjectLive',
            queries.isProjectLive.toString()
          );
        }
        return fetch(url.toString()).then((res) => res.json());
      },
      getById: async (id) => {
        const url = new URL(_baseUrl);
        url.pathname += `/projects/${id}`;
        return fetch(url.toString()).then((res) => res.json());
      },
      create: async (body) => {
        const url = new URL(_baseUrl);
        url.pathname += '/projects/create';
        return fetch(url.toString(), {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
      },
      edit: async (id, body) => {
        const url = new URL(_baseUrl);
        url.pathname += `/projects/edit/${id}`;
        return fetch(url.toString(), {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
      },
    },
    frames: {
      get: async (queries) => {
        const url = new URL(_baseUrl);
        url.pathname += '/frames';
        if (queries.projectId) {
          url.searchParams.append('projectId', queries.projectId);
        }
        if (queries.title) {
          url.searchParams.append('title', queries.title);
        }
        return fetch(url.toString()).then((res) => res.json());
      },
      getById: async (id) => {
        const url = new URL(_baseUrl);
        url.pathname += `/frames/${id}`;
        return fetch(url.toString()).then((res) => res.json());
      },
      create: async (body) => {
        const url = new URL(_baseUrl);
        url.pathname += '/frames/create';
        return fetch(url.toString(), {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
      },
      edit: async (id, body) => {
        const url = new URL(_baseUrl);
        url.pathname += `/frames/edit/${id}`;
        return fetch(url.toString(), {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
      },
    },
  };
};
