-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_userId_year_month_key" ON "Payroll"("userId", "year", "month");
