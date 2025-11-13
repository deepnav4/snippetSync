/*
  Warnings:

  - You are about to drop the column `shareSlug` on the `snippets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `snippets_shareSlug_idx` ON `snippets`;

-- DropIndex
DROP INDEX `snippets_shareSlug_key` ON `snippets`;

-- AlterTable
ALTER TABLE `snippets` DROP COLUMN `shareSlug`;

-- CreateTable
CREATE TABLE `share_codes` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `snippetId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `share_codes_code_key`(`code`),
    INDEX `share_codes_code_idx`(`code`),
    INDEX `share_codes_snippetId_idx`(`snippetId`),
    INDEX `share_codes_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `share_codes` ADD CONSTRAINT `share_codes_snippetId_fkey` FOREIGN KEY (`snippetId`) REFERENCES `snippets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
