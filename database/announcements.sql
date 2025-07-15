-- Create announcements table
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('event', 'update', 'maintenance') NOT NULL DEFAULT 'event',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` TINYINT(1) NOT NULL DEFAULT '1',
  `priority` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_active` (`active`),
  KEY `idx_priority` (`priority`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;