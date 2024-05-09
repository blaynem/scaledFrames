/*
  Warnings:

  - The `aspectRatio` column on the `Frame` table would be dropped and recreated. This will lead to data loss if there is data in the column.

  - Solved by adding custom SQL to the migration file.
*/
-- Create Enum
CREATE TYPE "AspectRatio" AS ENUM ('STANDARD', 'WIDE');

-- Add temp column
ALTER TABLE "Frame" ADD "temp_aspectRatio" "AspectRatio";

-- Update the temp column with explicit casting to enum type
UPDATE "Frame"
SET "temp_aspectRatio" = CASE
  WHEN "aspectRatio" = '1:1' THEN 'STANDARD'::"AspectRatio"
  WHEN "aspectRatio" = '1.91:1' THEN 'WIDE'::"AspectRatio"
  ELSE 'STANDARD'::"AspectRatio"
END;

-- Start transaction
BEGIN;

-- Drop the old column
ALTER TABLE "Frame" DROP COLUMN "aspectRatio";

-- Rename the new column
ALTER TABLE "Frame" RENAME COLUMN "temp_aspectRatio" TO "aspectRatio";

-- Commit transaction
COMMIT;

-- Set default value
ALTER TABLE "Frame" ALTER COLUMN "aspectRatio" SET DEFAULT 'STANDARD';
ALTER TABLE "Frame" ALTER COLUMN "aspectRatio" SET NOT NULL;
