CREATE TABLE `eventattendance` (
  `id` VARCHAR(191) NOT NULL,
  `eventId` VARCHAR(191) NOT NULL,
  `memberId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `eventattendance_eventId_memberId_key`(`eventId`, `memberId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `eventattendance` ADD CONSTRAINT `eventattendance_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `eventattendance` ADD CONSTRAINT `eventattendance_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `sponsorshipapplication` ALTER COLUMN `nomorPengajuan` DROP DEFAULT;
CREATE UNIQUE INDEX `sponsorshipapplication_nomorPengajuan_key` ON `sponsorshipapplication`(`nomorPengajuan`);
