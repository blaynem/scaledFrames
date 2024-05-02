import { Project, User } from '@prisma/client';

export type GetUsersRequestQueries = {
  id?: string;
  email?: string;
};

export type GetUsersResponse = User | null;

// TODO: Actually build the FramerServerAPI
// All the API methods that the Client sdk will use
export type FramerServerAPI = {
  users: {
    get: (queries: GetUsersRequestQueries) => Promise<GetUsersResponse>;
  };
  projects: {
    get: (queries: GetProjectsRequestQueries) => Promise<GetProjectsResponse>;
    getById: (id: string) => Promise<GetProjectResponse>;
    create: (body: CreateProjectRequestBody) => Promise<CreateProjectResponse>;
    edit: (
      id: string,
      body: EditProjectRequestBody
    ) => Promise<CreateProjectResponse>;
  };
};

/**
 * All methods act as a filter
 */
export type GetProjectsRequestQueries = {
  isProjectLive?: boolean;
};
export type GetProjectResponse = Project | null;
export type GetProjectsResponse = Project[] | null;

/**
 * Create a project
 */
export type CreateProjectRequestBody = {
  userId: string;
  teamId: string;
  title: string;
  description: string;
  notes: string;
};
export type CreateProjectResponse = Project | null;
export type EditProjectRequestBody = {
  userId: string;
  teamId: string;
  title?: string;
  description?: string;
  notes?: string;
  isProjectLive?: boolean;
};
