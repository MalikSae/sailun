-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CLUB', 'DEALER', 'MEMBER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Club` (
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

    UNIQUE INDEX `Club_slug_key`(`slug`),
    UNIQUE INDEX `Club_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SponsorshipApplication` (
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
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `sponsorshipApplicationId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Event_sponsorshipApplicationId_key`(`sponsorshipApplicationId`),
    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
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

    UNIQUE INDEX `Member_userId_key`(`userId`),
    UNIQUE INDEX `Member_telepon_key`(`telepon`),
    UNIQUE INDEX `Member_email_key`(`email`),
    UNIQUE INDEX `Member_referralCode_key`(`referralCode`),
    UNIQUE INDEX `Member_qrCardId_key`(`qrCardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dealer` (
    `id` VARCHAR(191) NOT NULL,
    `namaDealer` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DealerStaff` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dealerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DealerStaff_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
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
CREATE TABLE `PointLedger` (
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
CREATE TABLE `RedemptionCatalog` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `hargaPoin` INTEGER NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Redemption` (
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
CREATE TABLE `PointSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PointSetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Club` ADD CONSTRAINT `Club_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SponsorshipApplication` ADD CONSTRAINT `SponsorshipApplication_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_sponsorshipApplicationId_fkey` FOREIGN KEY (`sponsorshipApplicationId`) REFERENCES `SponsorshipApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_eventAsalId_fkey` FOREIGN KEY (`eventAsalId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealerStaff` ADD CONSTRAINT `DealerStaff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealerStaff` ADD CONSTRAINT `DealerStaff_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointLedger` ADD CONSTRAINT `PointLedger_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Redemption` ADD CONSTRAINT `Redemption_catalogItemId_fkey` FOREIGN KEY (`catalogItemId`) REFERENCES `RedemptionCatalog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
