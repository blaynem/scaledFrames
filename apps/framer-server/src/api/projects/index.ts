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
} from 'libs/FramerServerSDK/src/types';

// Instantiate a new Frog instance that we export to be used in the router above.
const projectsFrogInstance = new Frog();

// Fetch all projects
projectsFrogInstance.get('/', async (c) => {
  const queries: GetProjectsRequestQueries = {};

  const _isProjectLive = c.req.query('isProjectLive');
  if (_isProjectLive !== undefined) {
    queries.isProjectLive = _isProjectLive === 'true';
  }

  try {
    // only check isProjectLive if it is defined
    const projects = await prisma.project.findMany({
      where: {
        ...(queries.isProjectLive !== undefined && {
          isProjectLive: queries.isProjectLive,
        }),
      },
    });

    return c.json<GetProjectsResponse>(projects);
  } catch (error) {
    console.log('Fetch All Projects Error: ', error);
    return c.json<GetProjectsResponse>({ error: 'Error fetching projects' });
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

    if (!project) {
      return c.json<GetProjectResponse>({ error: 'Project not found' });
    }

    return c.json<GetProjectResponse>(project);
  } catch (error) {
    console.log('Fetch Project by Id Error : ', error);
    return c.json<GetProjectResponse>({ error: 'Error fetching project' });
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
    return c.json<CreateProjectResponse>({ error: 'Error creating project' });
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
    return c.json<CreateProjectResponse>({ error: 'Error editing project' });
  }
});

export default projectsFrogInstance;
