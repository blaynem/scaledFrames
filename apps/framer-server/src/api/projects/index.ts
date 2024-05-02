import prisma from '../../prismaClient';
import { Frog } from 'frog';
import { createProject } from './createProject';
import {
  GetProjectsRequestQueries,
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectRequestBody,
  CreateProjectResponse,
  EditProjectRequestBody,
} from '../../types';

// Instantiate a new Frog instance that we export to be used in the router above.
const projectsFrogInstance = new Frog();

// Fetch all projects
projectsFrogInstance.get('/', async (c) => {
  const queries: GetProjectsRequestQueries = {
    isProjectLive: c.req.query('isProjectLive') === 'true',
  };
  try {
    const projects = await prisma.project.findMany({
      where: {
        isProjectLive: queries.isProjectLive,
      },
    });

    return c.json<GetProjectsResponse>(projects);
  } catch (error) {
    console.log('Fetch All Projects Error: ', error);
    return c.json<GetProjectsResponse>(null);
  }
});

// Fetch a project by id
projectsFrogInstance.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    return c.json<GetProjectResponse>(project);
  } catch (error) {
    console.log('Fetch Project by Id Error : ', error);
    return c.json<GetProjectResponse>(null);
  }
});

// Create a project
projectsFrogInstance.post('/create', async (c) => {
  const body = await c.req.json<CreateProjectRequestBody>();
  try {
    const project = await createProject(body);

    return c.json<CreateProjectResponse>(project);
  } catch (error) {
    console.log('Create a project Error: ', error);
    return c.json<CreateProjectResponse>(null);
  }
});

// Edit a project
projectsFrogInstance.post('/edit/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<EditProjectRequestBody>();
  try {
    const project = await prisma.project.update({
      where: {
        id,
        teamId: body.teamId,
        team: {
          users: {
            some: {
              userId: body.userId,
            },
          },
        },
      },
      data: {
        title: body.title,
        description: body.description,
        notes: body.notes,
        isProjectLive: body.isProjectLive,
      },
    });

    return c.json<CreateProjectResponse>(project);
  } catch (error) {
    console.log('Edit a project Error: ', error);
    return c.json<CreateProjectResponse>(null);
  }
});

export default projectsFrogInstance;
