/*
  Warnings:

  - A unique constraint covering the columns `[userId,year,month]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "year" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_userId_year_month_key" ON "Payroll"("userId", "year", "month");
