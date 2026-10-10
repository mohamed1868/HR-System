/*
  Warnings:

  - You are about to drop the column `jop` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "jop",
ADD COLUMN     "job" TEXT NOT NULL DEFAULT 'sales';
