import {
  ImageType,
  IntentType,
  PrismaClient,
  SubscriptionType,
} from '@prisma/client';

const prisma = new PrismaClient();

const logError = async ({
  errorType,
  message,
  stackTrace,
}: {
  errorType: string;
  message: string;
  stackTrace?: string;
}) => {
  return await prisma.errorLog.create({
    data: {
      errorType,
      message,
      stackTrace,
    },
  });
};

const LogActions = {
  UserCreated: 'User created',
  ProjectCreated: 'Project created',
  FrameCreated: 'Frame created',
};
const LogDescriptions = {
  UserCreated: 'User created their account',
  ProjectCreated: 'User created a project',
  FrameCreated: 'User created a frame',
};

const logActivity = async ({
  action,
  description,
  userId,
}: {
  action: string;
  description: string;
  userId: string;
}) => {
  return await prisma.activityLog.create({
    data: {
      userId,
      action,
      description,
    },
  });
};

// Every user has their own "team". But they can also join other teams.
// The default name should just be their `${displayName}'s Team`
const createUser = async () => {
  const createdUserData = await prisma.user.create({
    data: {
      email: 'blayne.marjama@gmail.com',
      firstName: 'Blayne',
      lastName: 'Marjama',
      displayName: 'blayne.marjama',
    },
  });
  const createUserTeam = await prisma.userTeam.create({
    data: {
      user: {
        connect: {
          id: createdUserData.id,
        },
      },
      team: {
        create: {
          owner: {
            connect: {
              id: createdUserData.id,
            },
          },
          name: "blayne.marjama's Team",
          subscriptionType: SubscriptionType.Enterprise,
          customSubDomain: 'drilkus',
        },
      },
    },
  });

  logActivity({
    action: LogActions.UserCreated,
    description: LogDescriptions.UserCreated,
    userId: createdUserData.id,
  });

  return { createdUserData, createUserTeam };
};

// Create Project builds the initial project and frame for the user.
const createProject = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) => {
  try {
    const createdProject = await prisma.project.create({
      data: {
        title: 'My First Project',
        description: 'This is my first project',
        notes: 'These are some notes',
        isProjectLive: false,
        customBasePath: '/custom',
        customFallbackUrl: '',
        unusedWebhooks: '',
        team: {
          connect: {
            id: teamId,
          },
        },
        lastUpdatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log('---------------------', createdProject);
    logActivity({
      action: LogActions.ProjectCreated,
      description: LogDescriptions.ProjectCreated,
      userId,
    });

    const createRootFrame = await prisma.frame.create({
      data: {
        path: '/home',
        title: 'Home',
        imageUrl: 'https://placehold.co/600x400',
        imageType: ImageType.Static,
        aspectRatio: '1:1',
        intents: {
          createMany: {
            data: [
              {
                type: IntentType.InternalLink,
                linkUrl: '/home',
                displayText: 'Go home',
                displayOrder: 0,
              },
            ],
          },
        },
        rootFrameOfProjects: {
          connect: {
            id: createdProject.id,
          },
        },
        project: {
          connect: {
            id: createdProject.id,
          },
        },
        team: {
          connect: {
            id: teamId,
          },
        },
        createdBy: {
          connect: {
            id: userId,
          },
        },
        lastUpdatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    logActivity({
      action: LogActions.FrameCreated,
      description: LogDescriptions.FrameCreated,
      userId,
    });

    return { createdProject, createRootFrame };
  } catch (e: unknown) {
    console.error('---====----Error: ', e);
    logError({
      errorType: 'Create Project Error',
      message: 'Error creating project',
      stackTrace: e instanceof Error ? e.stack : undefined,
    });
  }
};

async function main() {
  const createdUser = await createUser();
  console.log('Created user:', createdUser);
  const createdProject = await createProject({
    teamId: createdUser.createUserTeam.teamId,
    userId: createdUser.createUserTeam.userId,
  });
  console.log('Created project:', createdProject);
  // Create the contract
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
