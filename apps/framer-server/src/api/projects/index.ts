import {
  GetProjectsRequestQueries,
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectRequestBody,
  createProject,
  CreateProjectResponse,
  EditProjectRequestBody,
} from '@framer/FramerServerSDK';
import prisma from '../../prismaClient';
import { Frog } from 'frog';
import {
  logActivity,
  LOG_ACTIONS,
  LOG_DESCRIPTIONS,
  logError,
  LOG_ERROR_TYPES,
} from 'libs/FramerServerSDK/src/lib/server/logging';
import { getAuthUser } from '../../supabaseClient';

// Instantiate a new Frog instance that we export to be used in the router above.
const projectsFrogInstance = new Frog();

// Fetch all projects
projectsFrogInstance.get('/', async (c) => {
  const queries: GetProjectsRequestQueries = {};

  const _isProjectLive = c.req.query('isProjectLive');
  if (_isProjectLive) {
    queries.isProjectLive = _isProjectLive === 'true';
  }

  try {
    const authUser = await getAuthUser(c);
    // only check isProjectLive if it is defined
    const projects = await prisma.project.findMany({
      where: {
        ...queries,
        team: {
          users: {
            some: {
              userId: authUser.id,
            },
          },
        },
      },
    });

    return c.json<GetProjectsResponse>(projects);
  } catch (error) {
    console.error('Fetch All Projects Error: ', error);
    return c.json<GetProjectsResponse>({ error: 'Error fetching projects' });
  }
});

// Fetch a project by id
projectsFrogInstance.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const authUser = await getAuthUser(c);
    const project = await prisma.project.findUnique({
      where: {
        id,
        team: {
          users: {
            some: {
              userId: authUser.id,
            },
          },
        },
      },
    });

    if (!project) {
      return c.json<GetProjectResponse>({ error: 'Project not found' });
    }

    return c.json<GetProjectResponse>(project);
  } catch (error) {
    console.error('Fetch Project by Id Error : ', error);
    return c.json<GetProjectResponse>({ error: 'Error fetching project' });
  }
});

// Create a project
projectsFrogInstance.post('/create', async (c) => {
  const body = await c.req.json<CreateProjectRequestBody>();
  try {
    const authUser = await getAuthUser(c);
    const project = await createProject(prisma, body, authUser);

    return c.json<CreateProjectResponse>(project);
  } catch (error) {
    console.error('Create a project Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.PROJECT_CREATE,
    });
    return c.json<CreateProjectResponse>({ error: 'Error creating project' });
  }
});

// Edit a project
projectsFrogInstance.post('/edit/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<EditProjectRequestBody>();
  try {
    const authUser = await getAuthUser(c);
    const project = await prisma.project.update({
      where: {
        id,
        teamId: body.teamId,
        team: {
          users: {
            some: {
              userId: authUser.id,
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

    logActivity(prisma, {
      action: LOG_ACTIONS.ProjectUpdated,
      description: LOG_DESCRIPTIONS.ProjectUpdated,
      userId: authUser.id,
    });

    return c.json<CreateProjectResponse>(project);
  } catch (error) {
    console.error('Edit a project Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.PROJECT_UPDATE,
    });
    return c.json<CreateProjectResponse>({ error: 'Error editing project' });
  }
});

export default projectsFrogInstance;
