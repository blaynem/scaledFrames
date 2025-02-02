import { Frog } from 'frog';

import prisma from '../../prismaClient';
import {
  decodeJwt,
  getUserFromEmail,
  logActivity,
  LOG_ACTIONS,
  LOG_DESCRIPTIONS,
  logError,
  LOG_ERROR_TYPES,
} from '@framer/FramerServerSDK/server';
import {
  GetFrameResponse,
  GetFrameRequestQueries,
  GetFramesResponse,
  CreateFrameRequestBody,
  CreateFrameResponse,
  EditFrameRequestBody,
  EditFrameResponse,
  ImageSaveToFrameBodyServer,
} from '@framer/FramerServerSDK/client';
import { IntentType } from '@prisma/client';

// Instantiate a new Frog instance that we export to be used in the router above.
const frameFrogInstance = new Frog({
  title: "What's a title?",
  origin: process.env.NEXT_PUBLIC_CLIENT_URL, 
  verifyOrigin: false
});

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
    if (body.isDeleted) updateData.isDeleted = body.isDeleted;

    const authUser = await getUserFromEmail(prisma, email);

    const filteredIntents = body.intents.map((intent) => ({
      linkUrl: intent.linkUrl || '',
      displayText: intent.displayText || '',
      displayOrder: intent.displayOrder || 0,
      isDeleted: intent.isDeleted || false,
      type: intent.type || IntentType.ExternalLink, // Replace `undefined` with a default value for `type`
    }));
    const frame = await prisma.$transaction(async (prisma) => {
      await prisma.intents.deleteMany({
        where: {
          framesId: id,
        },
      });

      await prisma.intents.createMany({
        skipDuplicates: true,
        data: filteredIntents.map((intent) => ({
          framesId: id,
          linkUrl: intent.linkUrl || '',
          displayText: intent.displayText || '',
          displayOrder: intent.displayOrder || 0,
          isDeleted: intent.isDeleted || false,
          type: intent.type || IntentType.ExternalLink, // Replace `undefined` with a default value for `type`
        })),
      });

      const intents = await prisma.intents.findMany({
        where: {
          framesId: id,
        },
      });

      return await prisma.frame.update({
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
          ...updateData,
          intents: {
            connect: intents,
          },
        },
        include: {
          intents: true,
        },
      });
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

frameFrogInstance.post('/delete/:id', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const id = c.req.param('id');
    const authUser = await getUserFromEmail(prisma, email);

    const frame = await prisma.frame.update({
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
      data: {
        isDeleted: true,
      },
      include: {
        intents: true,
      },
    });

    logActivity(prisma, {
      action: LOG_ACTIONS.FrameDeleted,
      description: LOG_DESCRIPTIONS.FrameDeleted,
      userId: authUser.id,
    });

    return c.json<EditFrameResponse>(frame);
  } catch (error) {
    console.error('Delete a frame Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.FRAME_DELETE,
    });
    return c.json<EditFrameResponse>({ error: 'Error deleting frame' });
  }
});

// Saving an image to a frame
frameFrogInstance.post('/image/save', async (c) => {
  try {
    const token = c.req.header('Authorization') as string;
    const { email } = await decodeJwt(token);

    const authUser = await getUserFromEmail(prisma, email);
    const body = await c.req.json<ImageSaveToFrameBodyServer>();

    const supabaseStorageUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public';
    // `/frames` is the bucket name
    const convertedImageUrl = `${supabaseStorageUrl}/frames/${body.imageUrl}`;

    const frame = await prisma.frame.update({
      where: {
        id: body.frameId,
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
        imageUrl: convertedImageUrl,
      },
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
    console.error('Save Image to Frame Error: ', error);
    logError({
      prisma,
      error,
      errorType: LOG_ERROR_TYPES.FRAME_UPDATE,
    });
    return c.json<EditFrameResponse>({ error: 'Error saving image to frame' });
  }
});

export default frameFrogInstance;
