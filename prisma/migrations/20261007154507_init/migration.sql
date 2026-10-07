-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('LEAVE', 'PERMISSION', 'MISSION', 'ADVANCE');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "type" "RequestType" NOT NULL DEFAULT 'LEAVE',
ALTER COLUMN "fromTime" DROP NOT NULL,
ALTER COLUMN "toTime" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PRESENT',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "basicSalary" INTEGER NOT NULL,
    "deductions" INTEGER NOT NULL DEFAULT 0,
    "bonuses" INTEGER NOT NULL DEFAULT 0,
    "netSalary" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
