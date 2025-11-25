/*
  Warnings:

  - Made the column `first_name` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `contacts` MODIFY `first_name` VARCHAR(100) NOT NULL;
