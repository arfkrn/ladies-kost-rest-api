/*
  Warnings:

  - You are about to drop the column `gambar` on the `kost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Kost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kost` DROP COLUMN `gambar`;

-- CreateTable
CREATE TABLE `KostImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kostId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Kost_id_key` ON `Kost`(`id`);

-- AddForeignKey
ALTER TABLE `KostImages` ADD CONSTRAINT `KostImages_kostId_fkey` FOREIGN KEY (`kostId`) REFERENCES `Kost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
