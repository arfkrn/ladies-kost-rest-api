-- CreateTable
CREATE TABLE `Kost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(255) NOT NULL,
    `harga` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Kost_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KostImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kostId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KostImages` ADD CONSTRAINT `KostImages_kostId_fkey` FOREIGN KEY (`kostId`) REFERENCES `Kost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
