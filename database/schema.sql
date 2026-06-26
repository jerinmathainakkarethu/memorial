-- Family Legacy QR Memorial - MySQL Database Schema
-- Version 1.0

CREATE DATABASE IF NOT EXISTS family_memorial
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE family_memorial;

DROP TABLE IF EXISTS grave_locations, audio_clips, activity_logs, memorial_messages, qr_codes, timeline_events, videos, media, relationships, family_members, families, users;

-- ============================================================
-- USERS TABLE (Admin & Super Admin)
-- ============================================================
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  avatar VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_deleted (deleted_at)
) ENGINE=InnoDB;

-- ============================================================
-- FAMILIES TABLE
-- ============================================================
CREATE TABLE families (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  name_ml VARCHAR(200) NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT NULL,
  description_ml TEXT NULL,
  motto VARCHAR(500) NULL,
  motto_ml VARCHAR(500) NULL,
  cover_photo VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_families_slug (slug),
  INDEX idx_families_active (is_active),
  INDEX idx_families_deleted (deleted_at),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- APPLICATION SETTINGS TABLE
-- ============================================================
CREATE TABLE app_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value VARCHAR(255) NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_app_settings_key (setting_key)
) ENGINE=InnoDB;

-- ============================================================
-- FAMILY MEMBERS TABLE
-- ============================================================
CREATE TABLE family_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  full_name_ml VARCHAR(200) NULL,
  nickname VARCHAR(100) NULL,
  nickname_ml VARCHAR(100) NULL,
  slug VARCHAR(200) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  date_of_birth DATE NULL,
  date_of_death DATE NULL,
  place_of_birth VARCHAR(300) NULL,
  place_of_death VARCHAR(300) NULL,
  biography TEXT NULL,
  biography_ml TEXT NULL,
  occupation VARCHAR(300) NULL,
  occupation_ml VARCHAR(300) NULL,
  education TEXT NULL,
  education_ml TEXT NULL,
  awards TEXT NULL,
  awards_ml TEXT NULL,
  hobbies TEXT NULL,
  hobbies_ml TEXT NULL,
  religion VARCHAR(100) NULL,
  religion_ml VARCHAR(100) NULL,
  notes TEXT NULL,
  notes_ml TEXT NULL,
  profile_photo VARCHAR(500) NULL,
  is_deceased TINYINT(1) NOT NULL DEFAULT 0,
  candle_count INT UNSIGNED NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_members_family (family_id),
  INDEX idx_members_slug (slug),
  INDEX idx_members_deceased (is_deceased),
  INDEX idx_members_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- RELATIONSHIPS TABLE
-- ============================================================
CREATE TABLE relationships (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  related_member_id INT UNSIGNED NOT NULL,
  relationship_type ENUM(
    'father', 'mother', 'spouse', 'child', 'sibling',
    'grandfather', 'grandmother', 'grandchild',
    'uncle', 'aunt', 'cousin', 'other'
  ) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_rel_family (family_id),
  INDEX idx_rel_member (member_id),
  INDEX idx_rel_related (related_member_id),
  INDEX idx_rel_type (relationship_type),
  INDEX idx_rel_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE,
  FOREIGN KEY (related_member_id) REFERENCES family_members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MEDIA TABLE (Photos)
-- ============================================================
CREATE TABLE media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NULL,
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL DEFAULT 'image',
  mime_type VARCHAR(100) NULL,
  file_size INT UNSIGNED NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  alt_text VARCHAR(300) NULL,
  caption TEXT NULL,
  is_cover TINYINT(1) NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  uploaded_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_media_family (family_id),
  INDEX idx_media_member (member_id),
  INDEX idx_media_type (file_type),
  INDEX idx_media_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- VIDEOS TABLE
-- ============================================================
CREATE TABLE videos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT NULL,
  video_type ENUM('upload', 'youtube') NOT NULL DEFAULT 'upload',
  file_name VARCHAR(500) NULL,
  file_path VARCHAR(500) NULL,
  youtube_url VARCHAR(500) NULL,
  youtube_id VARCHAR(100) NULL,
  thumbnail VARCHAR(500) NULL,
  duration INT UNSIGNED NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  uploaded_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_video_family (family_id),
  INDEX idx_video_member (member_id),
  INDEX idx_video_type (video_type),
  INDEX idx_video_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- TIMELINE EVENTS TABLE
-- ============================================================
CREATE TABLE timeline_events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NULL,
  title VARCHAR(300) NOT NULL,
  title_ml VARCHAR(300) NULL,
  description TEXT NULL,
  description_ml TEXT NULL,
  event_date DATE NULL,
  event_year INT NULL,
  event_type ENUM(
    'birth', 'marriage', 'career', 'education', 'award',
    'retirement', 'death', 'milestone', 'other'
  ) NOT NULL DEFAULT 'milestone',
  icon VARCHAR(50) NULL,
  media_id INT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_timeline_family (family_id),
  INDEX idx_timeline_member (member_id),
  INDEX idx_timeline_date (event_date),
  INDEX idx_timeline_type (event_type),
  INDEX idx_timeline_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE SET NULL,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- QR CODES TABLE
-- ============================================================
CREATE TABLE qr_codes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  code VARCHAR(500) NOT NULL UNIQUE,
  file_path VARCHAR(500) NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  scan_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  generated_by INT UNSIGNED NULL,
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_scanned_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_qr_family (family_id),
  INDEX idx_qr_member (member_id),
  INDEX idx_qr_slug (slug),
  INDEX idx_qr_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- MEMORIAL MESSAGES TABLE
-- ============================================================
CREATE TABLE memorial_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  family_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  visitor_name VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  approved_by INT UNSIGNED NULL,
  approved_at DATETIME NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_msg_family (family_id),
  INDEX idx_msg_member (member_id),
  INDEX idx_msg_approved (is_approved),
  INDEX idx_msg_deleted (deleted_at),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE activity_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id INT UNSIGNED NULL,
  description TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_log_user (user_id),
  INDEX idx_log_action (action),
  INDEX idx_log_entity (entity_type, entity_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- GRAVE LOCATIONS TABLE (Future use)
-- ============================================================
CREATE TABLE grave_locations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  member_id INT UNSIGNED NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  address TEXT NULL,
  cemetery_name VARCHAR(300) NULL,
  plot_number VARCHAR(100) NULL,
  section VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_grave_member (member_id),
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- AUDIO CLIPS TABLE (Future use)
-- ============================================================
CREATE TABLE audio_clips (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  member_id INT UNSIGNED NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  duration INT UNSIGNED NULL,
  uploaded_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_audio_member (member_id),
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA: Default Super Admin
-- ============================================================
-- Password: admin@123 (bcrypt hash)
INSERT INTO users (name, email, password_hash, role) VALUES
('Super Admin', 'admin@familymemorial.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'super_admin');
