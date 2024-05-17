-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Owner', 'Admin', 'Member', 'Viewer');

-- AlterTable
ALTER TABLE "UserTeam" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Viewer';

-- CreateTable
CREATE TABLE "Invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "teamId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invites" ADD CONSTRAINT "Invites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
