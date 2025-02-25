/*
  Warnings:

  - Added the required column `otpNumber` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TipoToken" ADD VALUE 'OTP_ACCESS';

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "otpNumber" BIGINT NOT NULL;
