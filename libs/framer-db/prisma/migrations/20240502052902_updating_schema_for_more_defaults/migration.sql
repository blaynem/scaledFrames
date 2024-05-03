-- AlterTable
ALTER TABLE "Frame" ALTER COLUMN "imageType" SET DEFAULT 'Static',
ALTER COLUMN "aspectRatio" SET DEFAULT '1:1';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "notes" SET DEFAULT '',
ALTER COLUMN "isProjectLive" SET DEFAULT false,
ALTER COLUMN "customBasePath" SET DEFAULT '',
ALTER COLUMN "customFallbackUrl" SET DEFAULT '',
ALTER COLUMN "unusedWebhooks" SET DEFAULT '';
