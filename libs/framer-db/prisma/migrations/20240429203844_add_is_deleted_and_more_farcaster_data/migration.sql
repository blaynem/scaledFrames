/*
  Warnings:

  - You are about to drop the column `clickTime` on the `IntentClickTracking` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Intents` table. All the data in the column will be lost.
  - You are about to drop the column `customPath` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `websiteFallbackPage` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `fallbackUrlCount` on the `ProjectAnalytics` table. All the data in the column will be lost.
  - Added the required column `castHash` to the `IntentClickTracking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkUrl` to the `Intents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customBasePath` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customFallbackUrl` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isProjectLive` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customFallbackUrlCount` to the `ProjectAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "IntentType" ADD VALUE 'Reset';

-- AlterTable
ALTER TABLE "ConsumerKnownData" ADD COLUMN     "farcasterUsername" TEXT;

-- AlterTable
ALTER TABLE "Frame" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "IntentClickTracking" DROP COLUMN "clickTime",
ADD COLUMN     "castHash" TEXT NOT NULL,
ADD COLUMN     "intentTextContext" TEXT,
ADD COLUMN     "intentTextValue" TEXT,
ADD COLUMN     "interactedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Intents" DROP COLUMN "link",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "customPath",
DROP COLUMN "websiteFallbackPage",
ADD COLUMN     "customBasePath" TEXT NOT NULL,
ADD COLUMN     "customFallbackUrl" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isProjectLive" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProjectAnalytics" DROP COLUMN "fallbackUrlCount",
ADD COLUMN     "customFallbackUrlCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
