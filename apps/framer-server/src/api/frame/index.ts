import { Frog } from 'frog';

import prisma from '../../prismaClient';
import {
  decodeJwt,
  GetFrameResponse,
  GetFrameRequestQueries,
  getUserFromEmail,
  GetFramesResponse,
  CreateFrameRequestBody,
  logActivity,
  LOG_ACTIONS,
  LOG_DESCRIPTIONS,
  CreateFrameResponse,
  logError,
  LOG_ERROR_TYPES,
  EditFrameRequestBody,
  EditFrameResponse,
} from '@framer/FramerServerSDK';

// Instantiate a new Frog instance that we export to be used in the router above.
const frameFrogInstance = new Frog();

// Fetch all Frames
frameFrogInstance.get('/', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const projectId = c.req.query('projectId');
    const title = c.req.query('title');

    if (!projectId) {
      return c.json<GetFrameResponse>({ error: 'projectId is required' });
    }

    const queries: GetFrameRequestQueries = {
      projectId,
      title,
    };

    const authUser = await getUserFromEmail(prisma, email);
    // Filtering by the projectId and title if it is defined
    const frame = await prisma.frame.findMany({
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
        intents: true,
      },
    });

    return c.json<GetFramesResponse>(frame);
  } catch (error) {
    console.error('Fetch All Frames Error: ', error);
    return c.json<GetFramesResponse>({ error: 'Error fetching frames' });
  }
});

// Fetch a frame by id
frameFrogInstance.get('/:id', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const id = c.req.param('id');
    const authUser = await getUserFromEmail(prisma, email);
    const frame = await prisma.frame.findUnique({
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
      include: {
        intents: true,
      },
    });

    if (!frame) {
      return c.json<GetFrameResponse>({ error: 'Frame not found' });
    }

    return c.json<GetFrameResponse>(frame);
  } catch (error) {
    console.error('Fetch Frame by Id Error : ', error);
    return c.json<GetFrameResponse>({ error: 'Error fetching frame' });
  }
});

// Create a frame
frameFrogInstance.post('/create', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const body = await c.req.json<CreateFrameRequestBody>();
    const authUser = await getUserFromEmail(prisma, email);
    const frame = await prisma.frame.create({
      data: {
        path: body.path,
        title: body.title,
        imageUrl: body.imageUrl,
        aspectRatio: body.aspectRatio,
        imageLinkUrl: body.imageLinkUrl,
        imageType: body.imageType,
        project: {
          connect: {
            id: body.projectId,
          },
        },
        lastUpdatedBy: {
          connect: {
            id: authUser.id,
          },
        },
        createdBy: {
          connect: {
            id: authUser.id,
          },
        },
        team: {
          connect: {
            id: body.teamId,
          },
        },
      },
      include: {
        intents: true,
      },
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.FrameCreated,
      description: LOG_DESCRIPTIONS.FrameCreated,
      userId: authUser.id,
    });

    return c.json<CreateFrameResponse>(frame);
  } catch (error) {
    console.error('Create a frame Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.FRAME_CREATE,
    });
    return c.json<CreateFrameResponse>({ error: 'Error creating frame' });
  }
});

// Edit a frame
frameFrogInstance.post('/edit/:id', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const id = c.req.param('id');
    const body = await c.req.json<EditFrameRequestBody>();

    // Create a dynamic update object based on provided body fields.
    // This allows us to gate the fields that can be updated, rather than spreading the body object directly.
    const updateData = {} as EditFrameRequestBody;
    if (body.title) updateData.title = body.title;
    if (body.path) updateData.path = body.path;
    if (body.imageUrl) updateData.imageUrl = body.imageUrl;
    if (body.imageLinkUrl) updateData.imageLinkUrl = body.imageLinkUrl;
    if (body.imageType) updateData.imageType = body.imageType;
    if (body.aspectRatio) updateData.aspectRatio = body.aspectRatio;

    const authUser = await getUserFromEmail(prisma, email);
    const frame = await prisma.frame.update({
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
        intents: true,
      },
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.FrameUpdated,
      description: LOG_DESCRIPTIONS.FrameUpdated,
      userId: authUser.id,
    });

    return c.json<EditFrameResponse>(frame);
  } catch (error) {
    console.error('Edit a frame Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.FRAME_UPDATE,
    });
    return c.json<EditFrameResponse>({ error: 'Error editing frame' });
  }
});

export default frameFrogInstance;
