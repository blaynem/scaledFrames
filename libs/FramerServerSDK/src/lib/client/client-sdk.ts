import { createSupabaseClient, getSession } from './supabaseClient';
import {
  FramerClientSDKConfig,
  FramerClientSDKType,
  ImageSaveToFrameBodyServer,
} from './types';

/**
 * Create a bucket save path for the image.
 */
const createBucketSavePath = ({
  teamId,
  projectId,
  frameId,
}: {
  teamId: string;
  projectId: string;
  frameId: string;
}) => {
  // We generate a hash because every image should be unique.
  // Supabase has a CDN that caches images, so we don't want to overwrite the original paths.
  const hash = Math.random().toString(36).substring(2);
  return `${teamId}/${projectId}/${frameId}/${hash}`;
};

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
      delete: async (id) => {
        const url = createUrl(`/api/frames/delete/${id}`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body: {},
        });
      },
      image: {
        async saveToFrame(body) {
          const supabase = createSupabaseClient();

          // If there is a previous frame image url, we will delete it.
          if (body.previousFrameImageUrl) {
            const _prevUrl = body.previousFrameImageUrl.split('/frames/')[1];
            await supabase.storage.from('frames').remove([_prevUrl]);
          }

          // We upload the image to the bucket with supabase client.
          const { data, error } = await supabase.storage.from('frames').upload(
            createBucketSavePath({
              teamId: body.teamId,
              projectId: body.projectId,
              frameId: body.frameId,
            }),
            body.file
          );
          if (error) {
            console.error('---error', error);
            return { error: error.message };
          }

          // Then send off the saved image url to the server.
          const serverBody: ImageSaveToFrameBodyServer = {
            teamId: body.teamId,
            projectId: body.projectId,
            frameId: body.frameId,
            imageUrl: `${data.path}`,
          };
          const url = createUrl('/api/frames/image/save');
          return postFetch({
            authToken: (await getAuthToken()) ?? '',
            url: url.toString(),
            body: serverBody,
          });
        },
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
    teams: {
      getAll: async () => {
        const url = createUrl('/api/teams');
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      getById: async (teamId) => {
        const url = createUrl(`/api/teams/${teamId}`);
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      leaveTeam: async (teamId) => {
        const url = createUrl(`/api/teams/${teamId}/leave`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body: {},
        });
      },
      inviteUser: async (body) => {
        const url = createUrl(`/api/teams/${body.teamId}/invite`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
      removeUser: async (body) => {
        const url = createUrl(`/api/teams/${body.teamId}/remove`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
      editUserRole: async (body) => {
        const url = createUrl(`/api/teams/${body.teamId}/edit-role`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
      editTeamProperties: async (body) => {
        const url = createUrl(`/api/teams/${body.teamId}/edit`);
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
    },
    user: {
      get: async () => {
        const url = createUrl('/api/user');
        return getFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
        });
      },
      signup: async (body) => {
        const url = createUrl('/api/user/signup');
        return postFetch({
          authToken: (await getAuthToken()) ?? '',
          url: url.toString(),
          body,
        });
      },
    },
    users: {
      find: async (queries) => {
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
    },
  };
};
