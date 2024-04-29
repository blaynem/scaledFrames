/*
  Warnings:

  - You are about to drop the column `aspect_ratio` on the `Frame` table. All the data in the column will be lost.
  - You are about to drop the column `image_type` on the `Frame` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Frame` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aspectRatio` to the `Frame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageType` to the `Frame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Frame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Frame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayOrder` to the `Intents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customSubDomain` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionType` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('Free', 'Pro', 'Enterprise');

-- AlterTable
ALTER TABLE "Frame" DROP COLUMN "aspect_ratio",
DROP COLUMN "image_type",
DROP COLUMN "image_url",
ADD COLUMN     "aspectRatio" TEXT NOT NULL,
ADD COLUMN     "imageType" "ImageType" NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Intents" ADD COLUMN     "displayOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "customSubDomain" TEXT NOT NULL,
ADD COLUMN     "subscriptionType" "SubscriptionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "display_name",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customPath" TEXT NOT NULL,
    "websiteFallbackPage" TEXT NOT NULL,
    "unusedWebhooks" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "lastUpdatedById" TEXT NOT NULL,
    "rootFrameId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stackTrace" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAnalytics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "conversions" INTEGER NOT NULL,
    "bounceRate" DOUBLE PRECISION NOT NULL,
    "fallbackUrlCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumerKnownData" (
    "id" TEXT NOT NULL,
    "farcasterId" TEXT NOT NULL,
    "farcasterBio" TEXT,
    "farcasterDisplayName" TEXT,
    "farcasterVerifications" TEXT[],
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,

    CONSTRAINT "ConsumerKnownData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntentClickTracking" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "frameId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "clickTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntentClickTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsumerKnownData_farcasterId_key" ON "ConsumerKnownData"("farcasterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_lastUpdatedById_fkey" FOREIGN KEY ("lastUpdatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_rootFrameId_fkey" FOREIGN KEY ("rootFrameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAnalytics" ADD CONSTRAINT "ProjectAnalytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentClickTracking" ADD CONSTRAINT "IntentClickTracking_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "Intents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentClickTracking" ADD CONSTRAINT "IntentClickTracking_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentClickTracking" ADD CONSTRAINT "IntentClickTracking_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentClickTracking" ADD CONSTRAINT "IntentClickTracking_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "ConsumerKnownData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
