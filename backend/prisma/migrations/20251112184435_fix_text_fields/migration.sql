-- AlterTable
ALTER TABLE `comments` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `token` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `snippets` MODIFY `description` TEXT NULL,
    MODIFY `code` TEXT NOT NULL;
