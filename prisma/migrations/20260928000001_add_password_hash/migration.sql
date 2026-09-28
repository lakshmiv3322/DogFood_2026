-- AlterTable: add passwordHash with a safe default so existing rows keep working
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';
