-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TrainType" AS ENUM ('HIGH_SPEED', 'EXPRESS', 'INTERCITY', 'REGIONAL', 'COMMUTER', 'FREIGHT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" SERIAL NOT NULL,
    "type" "public"."TrainType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SchedulePoint" (
    "id" SERIAL NOT NULL,
    "timeToArrive" TIMESTAMP(3) NOT NULL,
    "placeId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchedulePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteSchedule" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "public"."User"("login");

-- CreateIndex
CREATE INDEX "Schedule_type_idx" ON "public"."Schedule"("type");

-- CreateIndex
CREATE INDEX "SchedulePoint_timeToArrive_idx" ON "public"."SchedulePoint"("timeToArrive");

-- CreateIndex
CREATE INDEX "SchedulePoint_placeId_idx" ON "public"."SchedulePoint"("placeId");

-- CreateIndex
CREATE INDEX "SchedulePoint_scheduleId_idx" ON "public"."SchedulePoint"("scheduleId");

-- CreateIndex
CREATE INDEX "Place_name_idx" ON "public"."Place"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSchedule_userId_scheduleId_key" ON "public"."FavoriteSchedule"("userId", "scheduleId");

-- AddForeignKey
ALTER TABLE "public"."SchedulePoint" ADD CONSTRAINT "SchedulePoint_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SchedulePoint" ADD CONSTRAINT "SchedulePoint_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteSchedule" ADD CONSTRAINT "FavoriteSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
