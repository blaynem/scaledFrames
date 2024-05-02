import { User } from '@prisma/client';

export type GetUsersRequestQueries = {
  id?: string;
  email?: string;
};

export type GetUsersResponse = User | null;

// TODO: Actually build the FramerServerAPI
export type FramerServerAPI = {
  users: {
    get: (queries: GetUsersRequestQueries) => Promise<GetUsersResponse>;
  };
};
