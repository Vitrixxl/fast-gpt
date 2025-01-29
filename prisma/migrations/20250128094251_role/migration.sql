/*
  Warnings:

  - You are about to drop the column `sender` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sender",
ADD COLUMN     "role" "Sender" NOT NULL DEFAULT 'user';
