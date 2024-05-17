-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Owner', 'Admin', 'Member', 'Viewer', 'Invited');

-- AlterTable
ALTER TABLE "UserTeam" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Viewer';
