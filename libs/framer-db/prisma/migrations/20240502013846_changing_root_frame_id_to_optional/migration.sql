-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_rootFrameId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "rootFrameId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_rootFrameId_fkey" FOREIGN KEY ("rootFrameId") REFERENCES "Frame"("id") ON DELETE SET NULL ON UPDATE CASCADE;
