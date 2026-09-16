-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "lastReminderAt" TIMESTAMP(3),
ADD COLUMN     "remindersSent" INTEGER NOT NULL DEFAULT 0;
