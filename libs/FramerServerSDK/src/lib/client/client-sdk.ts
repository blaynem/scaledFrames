import { createSupabaseClient, getSession } from './supabaseClient';
import { FramerClientSDKConfig, FramerClientSDKType } from './types';

const getAuthToken = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return `${session.token_type} ${session.access_token}`;
};

const getFetch = async <T>({
  authToken,
  url,
}: {
  authToken: string;
  url: string;
}): Promise<T> => {
  const res = await fetch(url, {
    headers: {
      Authorization: authToken,
    },
  });
  return await res.json();
};

const postFetch = async <T>({
  authToken,
  url,
  body,
}: {
  authToken: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: authToken,
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
  const supabase = createSupabaseClient();

  return {
    frames: {
      get: async (queries) => {
        const url = createUrl('/api/frames');
        if (queries.projectId) {
          url.searchParams.append('projectId', queries.projectId);
        }
        if (queries.title) {
          url.searchParams.append('title', queries.title);
        }
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      getById: async (id) => {
        const url = createUrl(`/api/frames/${id}`);
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      create: async (body) => {
        const url = createUrl('/api/frames/create');
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
      edit: async (id, body) => {
        const url = createUrl(`/api/frames/edit/${id}`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
    },
    projects: {
      get: async (queries) => {
        const url = createUrl('/api/projects');
        if (queries?.isProjectLive) {
          url.searchParams.append(
            'isProjectLive',
            queries.isProjectLive.toString()
          );
        }
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      getById: async (id) => {
        const url = createUrl(`/api/projects/${id}`);
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      create: async (body) => {
        const url = createUrl('/api/projects/create');
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
      edit: async (id, body) => {
        const url = createUrl(`/api/projects/edit/${id}`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
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
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      signup: async (body) => {
        const url = createUrl('/api/users/signup');
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
    },
  };
};
