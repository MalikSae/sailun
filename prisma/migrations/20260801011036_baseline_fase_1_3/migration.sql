-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CLUB', 'DEALER', 'MEMBER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `club` (
    `id` VARCHAR(191) NOT NULL,
    `namaKomunitas` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `jumlahAnggota` INTEGER NOT NULL,
    `tahunMobilMulai` INTEGER NOT NULL,
    `tahunMobilAkhir` INTEGER NOT NULL,
    `namaKetua` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `status` ENUM('unverified', 'active', 'inactive') NOT NULL DEFAULT 'unverified',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `club_slug_key`(`slug`),
    UNIQUE INDEX `club_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsorshipapplication` (
    `id` VARCHAR(191) NOT NULL,
    `clubId` VARCHAR(191) NOT NULL,
    `namaAcara` VARCHAR(191) NOT NULL,
    `tanggalAcara` DATETIME(3) NOT NULL,
    `danaDiajukan` DECIMAL(65, 30) NOT NULL,
    `benefitDitawarkan` TEXT NOT NULL,
    `tierRekomendasi` ENUM('MICRO', 'SMALL', 'MEDIUM', 'BIG') NULL,
    `tierFinal` ENUM('MICRO', 'SMALL', 'MEDIUM', 'BIG') NULL,
    `catatanAdmin` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` VARCHAR(191) NOT NULL,
    `sponsorshipApplicationId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_sponsorshipApplicationId_key`(`sponsorshipApplicationId`),
    UNIQUE INDEX `event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `usia` INTEGER NOT NULL,
    `telepon` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tipeMobil` VARCHAR(191) NOT NULL,
    `tahunMobil` INTEGER NOT NULL,
    `gender` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,
    `clubId` VARCHAR(191) NOT NULL,
    `eventAsalId` VARCHAR(191) NULL,
    `referralCode` VARCHAR(191) NOT NULL,
    `qrCardId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `member_userId_key`(`userId`),
    UNIQUE INDEX `member_telepon_key`(`telepon`),
    UNIQUE INDEX `member_email_key`(`email`),
    UNIQUE INDEX `member_referralCode_key`(`referralCode`),
    UNIQUE INDEX `member_qrCardId_key`(`qrCardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer` (
    `id` VARCHAR(191) NOT NULL,
    `namaDealer` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealerstaff` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dealerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `dealerstaff_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `dealerId` VARCHAR(191) NOT NULL,
    `produk` VARCHAR(191) NOT NULL,
    `nominal` DECIMAL(65, 30) NOT NULL,
    `diskon` DECIMAL(65, 30) NOT NULL,
    `referralCodeUsed` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'CONFIRMED', 'VOIDED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pointledger` (
    `id` VARCHAR(191) NOT NULL,
    `targetType` ENUM('MEMBER', 'CLUB') NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `jumlah` INTEGER NOT NULL,
    `tipe` ENUM('CREDIT', 'HOLD', 'DEBIT', 'REVERSAL') NOT NULL,
    `tanggalKedaluwarsa` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `redemptioncatalog` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `hargaPoin` INTEGER NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `redemption` (
    `id` VARCHAR(191) NOT NULL,
    `targetType` ENUM('MEMBER', 'CLUB') NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `catalogItemId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pointsetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pointsetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `club` ADD CONSTRAINT `club_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sponsorshipapplication` ADD CONSTRAINT `sponsorshipapplication_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_sponsorshipApplicationId_fkey` FOREIGN KEY (`sponsorshipApplicationId`) REFERENCES `sponsorshipapplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_eventAsalId_fkey` FOREIGN KEY (`eventAsalId`) REFERENCES `event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealerstaff` ADD CONSTRAINT `dealerstaff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dealerstaff` ADD CONSTRAINT `dealerstaff_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `dealer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `dealer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pointledger` ADD CONSTRAINT `pointledger_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `redemption` ADD CONSTRAINT `redemption_catalogItemId_fkey` FOREIGN KEY (`catalogItemId`) REFERENCES `redemptioncatalog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
