import {
  GetProjectsRequestQueries,
  GetProjectsResponse,
  GetProjectByIdResponse,
  CreateProjectRequestBody,
  CreateProjectResponse,
  EditProjectRequestBody,
} from '@framer/FramerServerSDK/client';
import {
  decodeJwt,
  getUserFromEmail,
  createProject,
  logError,
  LOG_ERROR_TYPES,
  logActivity,
  LOG_ACTIONS,
  LOG_DESCRIPTIONS,
} from '@framer/FramerServerSDK/server';
import { Prisma } from '@prisma/client';
import prisma from '../../prismaClient';
import { Frog } from 'frog';
import { convertToUrlSafe, getAllowedFeatures } from '@framer/FramerServerSDK';

// Instantiate a new Frog instance that we export to be used in the router above.
const projectsFrogInstance = new Frog({
  title: "What's a title?",
  origin: process.env.NEXT_PUBLIC_CLIENT_URL, 
  verifyOrigin: false
});

// Fetch all projects
projectsFrogInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const queries: GetProjectsRequestQueries = {};

    const _isProjectLive = c.req.query('isProjectLive');
    if (_isProjectLive) {
      queries.isProjectLive = _isProjectLive === 'true';
    }
    const _teamId = c.req.query('teamId');
    if (_teamId) {
      queries.teamId = _teamId;
    }

    const authUser = await getUserFromEmail(prisma, email);
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
      include: {
        rootFrame: {
          include: {
            intents: true,
          },
        },
      },
    });

    const response: GetProjectsResponse = projects.map((project) => {
      return {
        ...project,
        rootFrame: project.rootFrame!, // rootFrame is always defined
      };
    });

    return c.json<GetProjectsResponse>(response);
  } catch (error) {
    console.error('Fetch All Projects Error: ', error);
    return c.json<GetProjectsResponse>({ error: 'Error fetching projects' });
  }
});

// Fetch all data for a project with a given id.
projectsFrogInstance.get('/:id', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const id = c.req.param('id');
    const authUser = await getUserFromEmail(prisma, email);
    const project = await prisma.project.findUnique({
      where: {
        id,
        isDeleted: false,
        team: {
          users: {
            some: {
              userId: authUser.id,
            },
          },
        },
      },
      include: {
        frames: {
          include: {
            intents: true,
          },
        },
        rootFrame: {
          include: {
            intents: true,
          },
        },
      },
    });

    if (!project) {
      return c.json<GetProjectByIdResponse>({ error: 'Project not found' });
    }

    const resposne: GetProjectByIdResponse = {
      ...project,
      rootFrame: project.rootFrame!,
    };

    return c.json<GetProjectByIdResponse>(resposne);
  } catch (error) {
    console.error('Fetch Project by Id Error : ', error);
    return c.json<GetProjectByIdResponse>({ error: 'Error fetching project' });
  }
});

// Create a project
projectsFrogInstance.post('/create', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const body = await c.req.json<CreateProjectRequestBody>();
    const authUser = await getUserFromEmail(prisma, email);
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
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const id = c.req.param('id');
    const body = await c.req.json<EditProjectRequestBody>();
    const authUser = await getUserFromEmail(prisma, email);

    const updateData: Prisma.ProjectUpdateInput = {
      description: body.description,
      isProjectLive: body.isProjectLive,
      notes: body.notes,
      title: body.title,
    };

    // If the user can add a custom base path, then lets update it
    // customBasePath: body.customBasePath,
    const teamSubscription = await prisma.team.findFirstOrThrow({
      where: {
        id: body.teamId,
      },
      select: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
    const allowedFeatures = getAllowedFeatures(
      teamSubscription.subscription.plan.subscriptionType
    );
    if (allowedFeatures.canHaveCustomProjectPaths && body.customBasePath) {
      // Clean up the base path before saving it
      updateData.customBasePath = convertToUrlSafe(body.customBasePath);
    }

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
      data: updateData,
      include: {
        frames: {
          include: {
            intents: true,
          },
        },
        rootFrame: {
          include: {
            intents: true,
          },
        },
      },
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.ProjectUpdated,
      description: LOG_DESCRIPTIONS.ProjectUpdated,
      userId: authUser.id,
    });

    const response: CreateProjectResponse = {
      ...project,
      rootFrame: project.rootFrame!, // rootFrame is always defined
    };

    return c.json<CreateProjectResponse>(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return c.json<CreateProjectResponse>({
          error: 'Project with that base path already exists',
        });
      }
    }
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
