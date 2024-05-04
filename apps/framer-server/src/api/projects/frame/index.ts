import {
  CreateFrameRequestBody,
  CreateFrameResponse,
  EditFrameRequestBody,
  EditFrameResponse,
  GetFrameRequestQueries,
  GetFrameResponse,
  GetFramesResponse,
} from '@framer/FramerServerSDK';
import prisma from 'apps/framer-server/src/prismaClient';
import { Frog } from 'frog';
import {
  LOG_ACTIONS,
  LOG_DESCRIPTIONS,
  LOG_ERROR_TYPES,
  logActivity,
  logError,
} from 'libs/FramerServerSDK/src/lib/server/logging';

// Instantiate a new Frog instance that we export to be used in the router above.
const frameFrogInstance = new Frog();

// Fetch all Frames
frameFrogInstance.get('/', async (c) => {
  const projectId = c.req.query('projectId');
  const title = c.req.query('title');

  if (!projectId) {
    return c.json<GetFrameResponse>({ error: 'projectId is required' });
  }

  const queries: GetFrameRequestQueries = {
    projectId,
    title,
  };

  try {
    // Filtering by the projectId and title if it is defined
    const frame = await prisma.frame.findMany({
      where: {
        projectId: queries.projectId,
        ...(queries.title !== undefined && {
          title: {
            contains: queries.title,
          },
        }),
      },
    });

    return c.json<GetFramesResponse>(frame);
  } catch (error) {
    console.log('Fetch All Frames Error: ', error);
    return c.json<GetFramesResponse>({ error: 'Error fetching frames' });
  }
});

// Fetch a frame by id
frameFrogInstance.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const frame = await prisma.frame.findUnique({
      where: {
        id,
      },
    });

    if (!frame) {
      return c.json<GetFrameResponse>({ error: 'Frame not found' });
    }

    return c.json<GetFrameResponse>(frame);
  } catch (error) {
    console.log('Fetch Frame by Id Error : ', error);
    return c.json<GetFrameResponse>({ error: 'Error fetching frame' });
  }
});

// Create a frame
frameFrogInstance.post('/create', async (c) => {
  const body = await c.req.json<CreateFrameRequestBody>();
  try {
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
            id: body.userId,
          },
        },
        createdBy: {
          connect: {
            id: body.userId,
          },
        },
        team: {
          connect: {
            id: body.teamId,
          },
        },
      },
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.FrameCreated,
      description: LOG_DESCRIPTIONS.FrameCreated,
      userId: body.userId,
    });

    return c.json<CreateFrameResponse>(frame);
  } catch (error) {
    console.log('Create a frame Error: ', error);
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
  const id = c.req.param('id');
  const body = await c.req.json<EditFrameRequestBody>();

  // Create a dynamic update object based on provided body fields
  const updateData = {} as EditFrameRequestBody;
  if (body.title) updateData.title = body.title;
  if (body.path) updateData.path = body.path;
  if (body.imageUrl) updateData.imageUrl = body.imageUrl;
  if (body.imageLinkUrl) updateData.imageLinkUrl = body.imageLinkUrl;
  if (body.imageType) updateData.imageType = body.imageType;
  if (body.aspectRatio) updateData.aspectRatio = body.aspectRatio;

  try {
    const frame = await prisma.frame.update({
      where: {
        id,
        teamId: body.teamId,
      },
      data: updateData,
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.FrameUpdated,
      description: LOG_DESCRIPTIONS.FrameUpdated,
      userId: body.userId,
    });

    return c.json<EditFrameResponse>(frame);
  } catch (error) {
    console.log('Edit a frame Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.FRAME_UPDATE,
    });
    return c.json<EditFrameResponse>({ error: 'Error editing frame' });
  }
});

export default frameFrogInstance;
