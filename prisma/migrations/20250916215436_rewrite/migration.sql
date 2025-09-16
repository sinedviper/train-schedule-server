/*
  Warnings:

  - The primary key for the `FavoriteSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `FavoriteSchedule` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `FavoriteSchedule` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `scheduleId` on the `FavoriteSchedule` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `trainId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `SchedulePoint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `placeId` on the `SchedulePoint` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `SchedulePoint` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `scheduleId` on the `SchedulePoint` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Train` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SchedulePoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FavoriteSchedule" DROP CONSTRAINT "FavoriteSchedule_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FavoriteSchedule" DROP CONSTRAINT "FavoriteSchedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Schedule" DROP CONSTRAINT "Schedule_trainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SchedulePoint" DROP CONSTRAINT "SchedulePoint_placeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SchedulePoint" DROP CONSTRAINT "SchedulePoint_scheduleId_fkey";

-- DropIndex
DROP INDEX "public"."SchedulePoint_placeId_idx";

-- AlterTable
ALTER TABLE "public"."FavoriteSchedule" DROP CONSTRAINT "FavoriteSchedule_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "userId" SET DATA TYPE INTEGER,
ALTER COLUMN "scheduleId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "FavoriteSchedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "trainId",
ADD COLUMN     "type" "public"."TrainType" NOT NULL,
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."SchedulePoint" DROP CONSTRAINT "SchedulePoint_pkey",
DROP COLUMN "placeId",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ALTER COLUMN "scheduleId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "SchedulePoint_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Place";

-- DropTable
DROP TABLE "public"."Train";

-- CreateIndex
CREATE INDEX "Schedule_type_idx" ON "public"."Schedule"("type");

-- CreateIndex
CREATE INDEX "SchedulePoint_name_idx" ON "public"."SchedulePoint"("name");

-- AddForeignKey
ALTER TABLE "public"."SchedulePoint" ADD CONSTRAINT "SchedulePoint_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
