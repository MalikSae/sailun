-- AlterTable
ALTER TABLE `pointledger` ADD COLUMN `redemptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `PointLedger_redemptionId_fkey` ON `pointledger`(`redemptionId`);

-- AddForeignKey
ALTER TABLE `pointledger` ADD CONSTRAINT `PointLedger_redemptionId_fkey` FOREIGN KEY (`redemptionId`) REFERENCES `redemption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
