-- Vote System Database Migration Script for MapleKaede
-- Compatible with MySQL 5.7 and 8.0 - Creates all necessary tables

-- 1. Create the vote_logs table first
CREATE TABLE IF NOT EXISTS vote_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  site VARCHAR(50) NOT NULL,
  vote_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  ip_hash VARCHAR(64),
  status ENUM('success', 'failed', 'cooldown', 'duplicate') DEFAULT 'success',
  failure_reason VARCHAR(255),
  nx_awarded INT DEFAULT 0,
  votepoints_awarded INT DEFAULT 0,
  INDEX idx_username_site_time (username, site, vote_time),
  INDEX idx_ip_hash_site_time (ip_hash, site, vote_time),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Create stored procedures for adding columns/indexes if they don't exist
DELIMITER $$

DROP PROCEDURE IF EXISTS AddColumnIfNotExists$$
CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(128),
    IN columnName VARCHAR(128),
    IN columnDefinition VARCHAR(1024)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND COLUMN_NAME = columnName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DROP PROCEDURE IF EXISTS AddIndexIfNotExists$$
CREATE PROCEDURE AddIndexIfNotExists(
    IN tableName VARCHAR(128),
    IN indexName VARCHAR(128),
    IN indexColumns VARCHAR(256)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.statistics
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND INDEX_NAME = indexName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD INDEX `', indexName, '` (', indexColumns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- 3. Add any missing columns to vote_logs (in case table already exists with partial schema)
CALL AddColumnIfNotExists('vote_logs', 'ip_hash', 'VARCHAR(64) AFTER ip_address');
CALL AddColumnIfNotExists('vote_logs', 'status', "ENUM('success', 'failed', 'cooldown', 'duplicate') DEFAULT 'success' AFTER ip_hash");
CALL AddColumnIfNotExists('vote_logs', 'failure_reason', 'VARCHAR(255) AFTER status');
CALL AddColumnIfNotExists('vote_logs', 'nx_awarded', 'INT DEFAULT 0 AFTER failure_reason');
CALL AddColumnIfNotExists('vote_logs', 'votepoints_awarded', 'INT DEFAULT 0 AFTER nx_awarded');

-- Add indexes only if they don't exist
CALL AddIndexIfNotExists('vote_logs', 'idx_username_site_time', 'username, site, vote_time');
CALL AddIndexIfNotExists('vote_logs', 'idx_ip_hash_site_time', 'ip_hash, site, vote_time');
CALL AddIndexIfNotExists('vote_logs', 'idx_status', 'status');

-- 4. Create IP cooldown tracking table
CREATE TABLE IF NOT EXISTS vote_ip_cooldowns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_hash VARCHAR(64) NOT NULL,
  site VARCHAR(50) NOT NULL,
  last_vote_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  vote_count INT DEFAULT 1,
  UNIQUE KEY unique_ip_site (ip_hash, site),
  INDEX idx_last_vote (last_vote_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Create vote sites configuration table
CREATE TABLE IF NOT EXISTS vote_sites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  nx_reward INT NOT NULL DEFAULT 8000,
  cooldown_hours INT NOT NULL DEFAULT 24,
  ip_cooldown_hours INT NOT NULL DEFAULT 24,
  icon VARCHAR(10) DEFAULT '🏆',
  color_from VARCHAR(20) DEFAULT 'yellow-500',
  color_to VARCHAR(20) DEFAULT 'orange-500',
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Create vote webhooks log table (optional - for debugging)
CREATE TABLE IF NOT EXISTS vote_webhook_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  headers TEXT,
  body TEXT,
  processed BOOLEAN DEFAULT FALSE,
  error_message VARCHAR(500),
  INDEX idx_received_at (received_at),
  INDEX idx_processed (processed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Create vote statistics table (optional - for analytics)
CREATE TABLE IF NOT EXISTS vote_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  site VARCHAR(50) NOT NULL,
  total_votes INT DEFAULT 0,
  successful_votes INT DEFAULT 0,
  failed_votes INT DEFAULT 0,
  unique_users INT DEFAULT 0,
  unique_ips INT DEFAULT 0,
  total_nx_awarded INT DEFAULT 0,
  UNIQUE KEY unique_date_site (date, site),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Insert default vote site (Gtop100)
INSERT INTO vote_sites (name, display_name, url, nx_reward, cooldown_hours, ip_cooldown_hours, icon, color_from, color_to, active)
VALUES (
  'gtop100',
  'Gtop100',
  'https://gtop100.com/topsites/MapleStory/sitedetails/yourvotehere?vote=1&pingUsername=',
  8000,
  24,
  24,
  '🏆',
  'yellow-500',
  'orange-500',
  TRUE
) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- 9. Update existing vote_logs records to have 'success' status if NULL (only if records exist)
UPDATE vote_logs 
SET status = 'success' 
WHERE status IS NULL AND nx_awarded > 0;

UPDATE vote_logs 
SET status = 'failed' 
WHERE status IS NULL AND nx_awarded = 0;

-- 10. Create or replace views for reporting
DROP VIEW IF EXISTS user_vote_summary;
CREATE VIEW user_vote_summary AS
SELECT 
  username,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_votes,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_votes,
  COUNT(CASE WHEN status = 'cooldown' THEN 1 END) as cooldown_attempts,
  SUM(nx_awarded) as total_nx_earned,
  MAX(vote_time) as last_vote_time,
  COUNT(DISTINCT DATE(vote_time)) as days_voted
FROM vote_logs
GROUP BY username;

DROP VIEW IF EXISTS daily_vote_stats;
CREATE VIEW daily_vote_stats AS
SELECT 
  DATE(vote_time) as vote_date,
  site,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_votes,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_votes,
  COUNT(CASE WHEN status = 'cooldown' THEN 1 END) as cooldown_blocks,
  COUNT(DISTINCT username) as unique_voters,
  COUNT(DISTINCT ip_hash) as unique_ips,
  SUM(nx_awarded) as total_nx_awarded
FROM vote_logs
GROUP BY DATE(vote_time), site
ORDER BY vote_date DESC;

-- 11. Add indexes to accounts table if they don't exist (assuming accounts table exists)
-- If accounts table doesn't exist, these will be skipped safely
CALL AddIndexIfNotExists('accounts', 'idx_accounts_name', 'name');
CALL AddIndexIfNotExists('accounts', 'idx_accounts_votepoints', 'votepoints');

-- 12. Clean up stored procedures
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;
DROP PROCEDURE IF EXISTS AddIndexIfNotExists;

-- 13. Display migration results
SELECT 'Vote system tables migration completed successfully!' AS Status;

-- Show what was created/updated
SELECT 
    'vote_logs' as TableName,
    COUNT(*) as RecordCount,
    COUNT(DISTINCT username) as UniqueUsers,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as SuccessfulVotes
FROM vote_logs

UNION ALL

SELECT 
    'vote_ip_cooldowns' as TableName,
    COUNT(*) as RecordCount,
    NULL as UniqueUsers,
    NULL as SuccessfulVotes
FROM vote_ip_cooldowns

UNION ALL

SELECT 
    'vote_sites' as TableName,
    COUNT(*) as RecordCount,
    NULL as UniqueUsers,
    NULL as SuccessfulVotes
FROM vote_sites;

-- Show the structure of vote_logs
DESCRIBE vote_logs;