-- DropForeignKey
ALTER TABLE "IntentClickTracking" DROP CONSTRAINT "IntentClickTracking_intentId_fkey";

-- AlterTable
ALTER TABLE "IntentClickTracking" ALTER COLUMN "intentId" DROP NOT NULL;
