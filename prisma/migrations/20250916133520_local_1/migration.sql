-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TrainType" AS ENUM ('HIGH_SPEED', 'EXPRESS', 'INTERCITY', 'REGIONAL', 'COMMUTER', 'FREIGHT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Train" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."TrainType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Train_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" BIGSERIAL NOT NULL,
    "trainId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteSchedule" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "scheduleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SchedulePoint" (
    "id" BIGSERIAL NOT NULL,
    "timeToArrive" TIMESTAMP(3) NOT NULL,
    "placeId" BIGINT NOT NULL,
    "scheduleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchedulePoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Train_type_idx" ON "public"."Train"("type");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSchedule_userId_scheduleId_key" ON "public"."FavoriteSchedule"("userId", "scheduleId");

-- CreateIndex
CREATE INDEX "Place_name_idx" ON "public"."Place"("name");

-- CreateIndex
CREATE INDEX "SchedulePoint_timeToArrive_idx" ON "public"."SchedulePoint"("timeToArrive");

-- CreateIndex
CREATE INDEX "SchedulePoint_placeId_idx" ON "public"."SchedulePoint"("placeId");

-- CreateIndex
CREATE INDEX "SchedulePoint_scheduleId_idx" ON "public"."SchedulePoint"("scheduleId");

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "public"."Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SchedulePoint" ADD CONSTRAINT "SchedulePoint_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SchedulePoint" ADD CONSTRAINT "SchedulePoint_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
