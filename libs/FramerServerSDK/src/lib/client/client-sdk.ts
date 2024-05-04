import { FramerClientSDKType } from './types';

export const FramerClientSDK = (
  /**
   * Defaults to 'http://localhost:3000/api'
   */
  baseUrl = 'http://localhost:3000/api'
): FramerClientSDKType => {
  return {
    users: {
      get: async (queries) => {
        const url = new URL(baseUrl);
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
        const url = new URL(baseUrl);
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
        const url = new URL(baseUrl);
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
        const url = new URL(baseUrl);
        url.pathname += `/projects/${id}`;
        return fetch(url.toString()).then((res) => res.json());
      },
      create: async (body) => {
        const url = new URL(baseUrl);
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
        const url = new URL(baseUrl);
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
  };
};
