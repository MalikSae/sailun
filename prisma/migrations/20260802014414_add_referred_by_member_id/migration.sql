-- AlterTable
ALTER TABLE `member` ADD COLUMN `referredByMemberId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `eventattendance_eventId_idx` ON `eventattendance`(`eventId`);

-- RenameIndex
ALTER TABLE `eventattendance` RENAME INDEX `eventattendance_memberId_fkey` TO `eventattendance_memberId_idx`;
