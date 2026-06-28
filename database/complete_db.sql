-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2026 at 04:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `family_memorial`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(10) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-25 20:26:12'),
(2, 1, 'CREATE_FAMILY', 'families', 3, 'Created family: Nakkarethu', NULL, NULL, '2026-06-25 20:29:45'),
(3, 1, 'UPDATE_FAMILY', 'families', 3, 'Updated family', NULL, NULL, '2026-06-25 20:30:09'),
(4, 1, 'UPDATE_FAMILY', 'families', 3, 'Updated family', NULL, NULL, '2026-06-25 20:30:38'),
(5, 1, 'CREATE_FAMILY', 'families', 4, 'Created family: Elikottu Family', NULL, NULL, '2026-06-25 20:33:21'),
(6, 1, 'CREATE_MEMBER', 'family_members', 26, 'Created member: Idikula Yohannan', NULL, NULL, '2026-06-25 20:36:13'),
(7, 1, 'CREATE_MEMBER', 'family_members', 27, 'Created member: Thankamma Yohannan', NULL, NULL, '2026-06-25 20:38:08'),
(8, 1, 'CREATE_MEMBER', 'family_members', 28, 'Created member: Rajan Yohannan', NULL, NULL, '2026-06-25 20:40:03'),
(9, 1, 'UPDATE_MEMBER', 'family_members', 28, 'Updated member', NULL, NULL, '2026-06-25 20:40:28'),
(10, 1, 'UPDATE_MEMBER', 'family_members', 28, 'Updated member', NULL, NULL, '2026-06-25 20:40:44'),
(11, 1, 'CREATE_MEMBER', 'family_members', 29, 'Created member: Thomas Yohannan', NULL, NULL, '2026-06-25 20:51:55'),
(12, 1, 'CREATE_MEMBER', 'family_members', 30, 'Created member: Babu Yohannan', NULL, NULL, '2026-06-25 20:52:32'),
(13, 1, 'UPDATE_MEMBER', 'family_members', 30, 'Updated member', NULL, NULL, '2026-06-25 20:53:04'),
(14, 1, 'UPDATE_MEMBER', 'family_members', 28, 'Updated member', NULL, NULL, '2026-06-25 20:53:27'),
(15, 1, 'CREATE_MEMBER', 'family_members', 31, 'Created member: Kunjumol Mathai', NULL, NULL, '2026-06-25 20:55:11'),
(16, 1, 'UPDATE_MEMBER', 'family_members', 31, 'Updated member', NULL, NULL, '2026-06-25 20:55:43'),
(17, 1, 'CREATE_MEMBER', 'family_members', 32, 'Created member: James Yohannan', NULL, NULL, '2026-06-25 20:56:48'),
(18, 1, 'CREATE_MEMBER', 'family_members', 33, 'Created member: Salu Yohannan', NULL, NULL, '2026-06-25 20:57:50'),
(19, 1, 'UPDATE_MEMBER', 'family_members', 31, 'Updated member', NULL, NULL, '2026-06-25 20:58:29'),
(20, 1, 'CREATE_MEMBER', 'family_members', 34, 'Created member: Subin Rajan', NULL, NULL, '2026-06-25 21:01:45'),
(21, 1, 'CREATE_MEMBER', 'family_members', 35, 'Created member: Elsa Rajan', NULL, NULL, '2026-06-25 21:02:23'),
(22, 1, 'UPDATE_MEMBER', 'family_members', 34, 'Updated member', NULL, NULL, '2026-06-25 21:02:52'),
(23, 1, 'CREATE_MEMBER', 'family_members', 36, 'Created member: N M Mathai', NULL, NULL, '2026-06-25 21:03:34'),
(24, 1, 'CREATE_MEMBER', 'family_members', 37, 'Created member: Jency Mathai', NULL, NULL, '2026-06-25 21:04:30'),
(25, 1, 'UPDATE_FAMILY', 'families', 4, 'Updated family', NULL, NULL, '2026-06-25 21:57:51'),
(26, 1, 'UPDATE_FAMILY', 'families', 3, 'Updated family', NULL, NULL, '2026-06-25 21:58:34'),
(27, 1, 'UPDATE_FAMILY', 'families', 4, 'Updated family', NULL, NULL, '2026-06-25 21:59:00'),
(28, 1, 'GENERATE_QR', 'qr_codes', 14, 'Generated QR for Idikula Yohannan', NULL, NULL, '2026-06-25 22:08:19'),
(29, 1, 'UPDATE_MEMBER', 'family_members', 26, 'Updated member', NULL, NULL, '2026-06-25 22:11:42'),
(30, 1, 'APPROVE_MESSAGE', 'memorial_messages', 25, 'Approved memorial message', NULL, NULL, '2026-06-25 23:03:20'),
(31, 1, 'UPDATE_MEMBER', 'family_members', 26, 'Updated member', NULL, NULL, '2026-06-25 23:05:42'),
(32, 1, 'UPDATE_MEMBER', 'family_members', 26, 'Updated member', NULL, NULL, '2026-06-25 23:06:19'),
(33, 1, 'UPDATE_FAMILY', 'families', 2, 'Updated family', NULL, NULL, '2026-06-26 00:12:32'),
(34, 1, 'UPDATE_FAMILY', 'families', 2, 'Updated family', NULL, NULL, '2026-06-26 00:14:36'),
(35, 1, 'UPDATE_FAMILY', 'families', 1, 'Updated family', NULL, NULL, '2026-06-26 00:15:16'),
(36, 1, 'UPDATE_MEMBER', 'family_members', 2, 'Updated member', NULL, NULL, '2026-06-26 00:19:26'),
(37, 1, 'UPLOAD_PHOTO', 'media', 5, 'Uploaded photo', NULL, NULL, '2026-06-26 00:21:23'),
(38, 1, 'UPLOAD_PHOTO', 'media', 6, 'Uploaded photo', NULL, NULL, '2026-06-26 00:51:55'),
(39, 1, 'APPROVE_MESSAGE', 'memorial_messages', 26, 'Approved memorial message', NULL, NULL, '2026-06-26 00:53:46'),
(40, 1, 'UPDATE_MEMBER', 'family_members', 7, 'Updated member', NULL, NULL, '2026-06-26 01:01:33'),
(41, 1, 'UPDATE_MEMBER', 'family_members', 19, 'Updated member', NULL, NULL, '2026-06-26 01:02:01'),
(42, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-28 12:13:12'),
(43, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', NULL, '2026-06-28 12:14:06'),
(44, 1, 'GENERATE_QR', 'qr_codes', 14, 'Generated QR for Idikula Yohannan', NULL, NULL, '2026-06-28 12:14:10'),
(45, 1, 'GENERATE_QR', 'qr_codes', 14, 'Generated QR for Idikula Yohannan', NULL, NULL, '2026-06-28 12:15:57'),
(46, 1, 'DELETE_FAMILY', 'families', 3, 'Deleted family', NULL, NULL, '2026-06-28 20:17:01'),
(47, 1, 'UPDATE_FAMILY', 'families', 4, 'Updated family', NULL, NULL, '2026-06-28 20:21:18');

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'hide_living', '0', NULL, '2026-06-25 21:47:56', '2026-06-28 19:26:13'),
(2, 'site_name', 'Family Memorial', NULL, '2026-06-28 19:01:58', '2026-06-28 19:26:13'),
(3, 'allow_public_messages', '1', NULL, '2026-06-28 19:01:59', '2026-06-28 19:26:13'),
(4, 'auto_approve_messages', '1', NULL, '2026-06-28 19:01:59', '2026-06-28 19:26:13'),
(5, 'allow_candles', '1', NULL, '2026-06-28 19:01:59', '2026-06-28 19:26:13'),
(6, 'home_banner_quote_en', '\"Even though I walk through the darkest valley, I will fear no evil.\"', 'Home page banner quote (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(7, 'home_banner_quote_ml', '\"ഇരുൾനിറഞ്ഞ താഴ്‌വരയിലൂടെയാണ്‌ ഞാൻ നടക്കുന്നതെങ്കിലും ഞാൻ ഒരു ഭയവും കൂടാതെയിരിക്കും.\"', 'Home page banner quote (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(8, 'home_banner_cite_en', '— Psalm 23:4', 'Home page banner citation (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(9, 'home_banner_cite_ml', '— സങ്കീർത്തനങ്ങൾ 23:4', 'Home page banner citation (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(10, 'home_mission_title_en', 'Our Family Heritage', 'Home page mission section title (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(11, 'home_mission_title_ml', 'നമ്മുടെ കുടുംബ പൈതൃകം', 'Home page mission section title (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(12, 'home_mission_text_en', 'This memorial is a living archive of our family history — a place where stories are preserved, photos are cherished, and the flame of memory never fades. Explore the branches of our family tree, light a candle in loving memory, and leave your tribute for generations to come.', 'Home page mission section text (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(13, 'home_mission_text_ml', 'ഈ സ്മരണിക നമ്മുടെ കുടുംബ ചരിത്രത്തിന്റെ ഒരു ജീവിക്കുന്ന ശേഖരമാണ് — കഥകൾ സംരക്ഷിക്കപ്പെടുകയും ഫോട്ടോകൾ വിലമതിക്കപ്പെടുകയും ഓർമ്മകളുടെ ജ്വാല ഒരിക്കലും കെടാതിരിക്കുകയും ചെയ്യുന്ന ഒരു സ്ഥലം. നമ്മുടെ കുടുംബ വൃക്ഷത്തിന്റെ ശാഖകളിലൂടെ സഞ്ചരിക്കുക, പ്രിയപ്പെട്ടവരുടെ ഓർമ്മയ്ക്കായി മെഴുകുതിരി കൊളുത്തുക, വരും തലമുറകൾക്കായി നിങ്ങളുടെ ആദരാഞ്ജലി രേഖപ്പെടുത്തുക.', 'Home page mission section text (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(14, 'home_cta_title_en', 'Preserve Your Family Story', 'Home page CTA section title (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(15, 'home_cta_title_ml', 'നിങ്ങളുടെ കുടുംബ കഥ സംരക്ഷിക്കുക', 'Home page CTA section title (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(16, 'home_cta_text_en', 'Our family legacy is built on the lives we live and the memories we share. Every name, every face, every story matters.', 'Home page CTA section text (English)', '2026-06-28 20:08:30', '2026-06-28 20:14:22'),
(17, 'home_cta_text_ml', 'നമ്മുടെ കുടുംബ പാരമ്പര്യം നാം ജീവിക്കുന്ന ജീവിതങ്ങളിലും പങ്കിടുന്ന ഓർമ്മകളിലും നിർമ്മിച്ചിരിക്കുന്നു. ഓരോ പേരും, ഓരോ മുഖവും, ഓരോ കഥയും പ്രധാനമാണ്.', 'Home page CTA section text (Malayalam)', '2026-06-28 20:08:30', '2026-06-28 20:14:22');

-- --------------------------------------------------------

--
-- Table structure for table `audio_clips`
--

CREATE TABLE `audio_clips` (
  `id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(300) NOT NULL,
  `description` text DEFAULT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `duration` int(10) UNSIGNED DEFAULT NULL,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `families`
--

CREATE TABLE `families` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `name_ml` varchar(200) DEFAULT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `description_ml` text DEFAULT NULL,
  `motto` varchar(500) DEFAULT NULL,
  `motto_ml` varchar(500) DEFAULT NULL,
  `cover_photo` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `families`
--

INSERT INTO `families` (`id`, `name`, `name_ml`, `slug`, `description`, `description_ml`, `motto`, `motto_ml`, `cover_photo`, `is_active`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'The Mathai Family', 'മാത്യു കുടുംബം', 'the-mathai-family', 'A distinguished family with roots in central Kerala, known for their dedication to agriculture, education, and community welfare over multiple generations.', 'കേരളത്തിന്റെ മധ്യഭാഗത്ത് ഉത്ഭവിച്ച ഒരു പ്രമുഖ കുടുംബം, കൃഷി, വിദ്യാഭ്യാസം, കമ്മ്യൂണിറ്റി ക്ഷേമം എന്നിവയ്ക്കായി തലമുറകളായി നൽകിയ സംഭാവനകൾക്ക് പേരുകേട്ടതാണ്.', 'Unity is Strength, Love is Legacy', 'ഐക്യം ബലം, സ്നേഹം പാരമ്പര്യം', '/uploads/photos/926d1d84-f2cc-48ba-a9ac-70f2f03703a6.jpg', 1, 1, '2026-06-25 20:26:12', '2026-06-26 00:15:16', NULL),
(2, 'The Cherian Family', 'ചെറിയാൻ കുടുംബം', 'the-cherian-family', 'A lineage with roots in Niranam, Pathanamthitta, historically prominent in academic scholarship, civil services, and philanthropic ventures.', 'പത്തനംതിട്ടയിലെ നിരണം സ്വദേശികളായ ഒരു പ്രമുഖ കുടുംബം, വിദ്യാഭ്യാസ രംഗത്തും സിവിൽ സർവീസിലും ജീവകാരുണ്യ പ്രവർത്തനങ്ങളിലും ചരിത്രപരമായ പങ്കുവഹിച്ചിട്ടുണ്ട്.', 'Faith, Integrity, Knowledge', 'വിശ്വാസം, സത്യസന്ധത, അറിവ്', '/uploads/photos/07ca8655-0605-466e-8a57-191a0b55b043.webp', 1, 1, '2026-06-25 20:26:12', '2026-06-26 00:12:32', NULL),
(3, 'Nakkarethu Family', 'Nakkarethu', 'nakkarethu-family', 'A family known for its enduring commitment to faith, perseverance, and family bonds. The Nakkarethu Family carries forward a rich legacy built on dedication, mutual support, and respect for tradition across generations.', 'വിശ്വാസത്തിലും അധ്വാനത്തിലും കുടുംബബന്ധങ്ങളിലുമുള്ള അചഞ്ചലമായ പ്രതിബദ്ധതയ്ക്ക് പേരുകേട്ട കുടുംബമാണ് നക്കരേത്ത് കുടുംബം. സമർപ്പണവും പരസ്പര പിന്തുണയും പാരമ്പര്യങ്ങളോടുള്ള ആദരവും അടിസ്ഥാനമാക്കി സമ്പന്നമായ ഒരു കുടുംബപാരമ്പര്യം തലമുറകളിലൂടെ മുന്നോട്ട് കൊണ്ടുപോകുകയാണ് ഈ കുടുംബം.', 'Faith, Hard Work, Legacy', 'വിശ്വാസം, അധ്വാനം, പാരമ്പര്യം', '/uploads/photos/fd69f0b2-e47d-440e-ac30-99e96224a756.jpg', 1, 1, '2026-06-25 20:29:45', '2026-06-28 20:17:01', '2026-06-28 20:17:01'),
(4, 'Elikottu Family', 'എലിക്കോട്ടു കുടുംബം', 'elikottu-family', 'A respected family lineage rooted in strong values of togetherness, faith, and community service. Through generations, the Elikottu Family has preserved its heritage while contributing to the growth and well-being of the local community.', 'ഐക്യത്തിന്റെയും വിശ്വാസത്തിന്റെയും സമൂഹസേവനത്തിന്റെയും മൂല്യങ്ങളിൽ അധിഷ്ഠിതമായ ഒരു അഭിമാനകരമായ കുടുംബപരമ്പരയാണ് എലിക്കോട്ടു കുടുംബം. തലമുറകളിലൂടെ പാരമ്പര്യം സംരക്ഷിച്ചുകൊണ്ട് സമൂഹത്തിന്റെ പുരോഗതിക്കും ക്ഷേമത്തിനും വിലപ്പെട്ട സംഭാവനകൾ നൽകി വരുന്ന കുടുംബമാണ് ഇത്.', 'Unity, Tradition, Service', 'ഐക്യം, പാരമ്പര്യം, സേവനം', '/uploads/photos/1f3d4043-98bd-464e-a951-62d69e02ecd7.jpg', 1, 1, '2026-06-25 20:33:21', '2026-06-28 20:21:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `family_members`
--

CREATE TABLE `family_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `full_name_ml` varchar(200) DEFAULT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `nickname_ml` varchar(100) DEFAULT NULL,
  `slug` varchar(200) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `date_of_death` date DEFAULT NULL,
  `place_of_birth` varchar(300) DEFAULT NULL,
  `place_of_death` varchar(300) DEFAULT NULL,
  `biography` text DEFAULT NULL,
  `biography_ml` text DEFAULT NULL,
  `occupation` varchar(300) DEFAULT NULL,
  `occupation_ml` varchar(300) DEFAULT NULL,
  `education` text DEFAULT NULL,
  `education_ml` text DEFAULT NULL,
  `awards` text DEFAULT NULL,
  `awards_ml` text DEFAULT NULL,
  `hobbies` text DEFAULT NULL,
  `hobbies_ml` text DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `religion_ml` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `notes_ml` text DEFAULT NULL,
  `profile_photo` varchar(500) DEFAULT NULL,
  `is_deceased` tinyint(1) NOT NULL DEFAULT 0,
  `candle_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `family_members`
--

INSERT INTO `family_members` (`id`, `family_id`, `full_name`, `full_name_ml`, `nickname`, `nickname_ml`, `slug`, `gender`, `date_of_birth`, `date_of_death`, `place_of_birth`, `place_of_death`, `biography`, `biography_ml`, `occupation`, `occupation_ml`, `education`, `education_ml`, `awards`, `awards_ml`, `hobbies`, `hobbies_ml`, `religion`, `religion_ml`, `notes`, `notes_ml`, `profile_photo`, `is_deceased`, `candle_count`, `display_order`, `is_active`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Mathai K. Mathew', 'മത്തായി കെ. മാത്യു', 'Appachan', 'അപ്പച്ചൻ', 'mathai-k-mathew', 'male', '1915-08-10', '1995-12-05', 'Kottayam, Kerala', 'Kottayam, Kerala', 'Mathai K. Mathew was the patriarch of the family. He was a pioneer agriculturist, who expanded the family plantations and established community schools. He was known for his wisdom, piety, and leadership.', 'കുടുംബത്തിന്റെ സ്ഥാപകനായ മത്തായി കെ. മാത്യു ഒരു പ്രമുഖ കർഷകനായിരുന്നു. അദ്ദേഹം കുടുംബ കൃഷിയിടങ്ങൾ വികസിപ്പിക്കുകയും സ്‌കൂളുകൾ സ്ഥാപിക്കുകയും ചെയ്തു. അദ്ദേഹത്തിന്റെ ബുദ്ധിശക്തിയും ദൈവഭക്തിയും നേതൃത്വവും എല്ലാവർക്കും മാതൃകയായിരുന്നു.', 'Planter & Community Leader', 'കൃഷിക്കാരൻ & കമ്മ്യൂണിറ്റി നേതാവ്', 'Intermediate, CMS College Kottayam', 'ഇന്റർമീഡിയറ്റ്, സി.എം.എസ് കോളേജ് കോട്ടയം', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-mathai-k-mathew.jpg', 1, 121, 1, 1, 1, '2026-06-25 20:26:12', '2026-06-25 23:02:46', NULL),
(2, 1, 'Mariamma Mathai', 'മറിയാമ്മ മത്തായി', 'Ammachi', 'അമ്മച്ചി', 'mariamma-mathai', 'female', '1920-04-11', '2005-06-17', 'Thiruvalla, Kerala', 'Kottayam, Kerala', 'Mariamma Mathai was a compassionate matriarch. She dedicated her life to raising her six sons and supporting local church charities. She was an expert in traditional culinary arts and herbal remedies.', 'മറിയാമ്മ മത്തായി കാരുണ്യമുള്ള ഒരു മാതൃകയായിരുന്നു. തന്റെ ആറ് ആൺമക്കളെ വളർത്തുന്നതിനും പ്രാദേശിക സഭയുടെ കാരുണ്യപ്രവർത്തനങ്ങളെ പിന്തുണയ്ക്കുന്നതിനും അവർ ജീവിതം സമർപ്പിച്ചു. പരമ്പരാഗത പാചകകലയിലും ഔഷധപ്രയോഗങ്ങളിലും അവർ വിദഗ്ദ്ധയായിരുന്നു.', 'Homemaker', 'ഗൃഹനാഥ', 'High School', 'ഹൈസ്കൂൾ', '', '', '', '', '', '', '', '', '/uploads/photos/3ea0dab6-d500-4c4a-80a5-c7d30360cebb.jpg', 1, 146, 2, 1, 1, '2026-06-25 20:26:12', '2026-06-26 00:54:37', NULL),
(3, 1, 'John Mathai', 'ജോൺ മത്തായി', 'Joy', 'ജോയ്', 'john-mathai', 'male', '1940-02-15', '2018-03-24', 'Kottayam, Kerala', 'Ernakulam, Kerala', 'John Mathai, the eldest of the six brothers, was an exceptional civil engineer. He contributed to major infrastructure projects in Kerala and the Middle East. He had a passion for Malayalam literature and local history.', 'ആറ് സഹോദരന്മാരിൽ മുതിർന്നയാളായ ജോൺ മത്തായി ഒരു മികച്ച സിവിൽ എഞ്ചിനീയറായിരുന്നു. കേരളത്തിലെയും മിഡിൽ ഈസ്റ്റിലെയും പ്രധാന അടിസ്ഥാന സൗകര്യ പദ്ധതികളിൽ അദ്ദേഹം പങ്കാളിയായി. മലയാള സാഹിത്യത്തിലും പ്രാദേശിക ചരിത്രത്തിലും അദ്ദേഹത്തിന് താല്പര്യമുണ്ടായിരുന്നു.', 'Civil Engineer', 'സിവിൽ എഞ്ചിനീയർ', 'B.Tech in Civil Engineering, CET Trivandrum', 'സിവിൽ എഞ്ചിനീയറിംഗിൽ ബി.ടെക്, സി.ഇ.ടി തിരുവനന്തപുരം', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-john-mathai.jpg', 1, 78, 3, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(4, 1, 'Thomas Mathai', 'തോമസ് മത്തായി', 'Thankachan', 'തങ്കച്ചൻ', 'thomas-mathai', 'male', '1942-05-18', '2020-07-11', 'Kottayam, Kerala', 'Kottayam, Kerala', 'Thomas Mathai was a beloved professor of English literature. He inspired generations of students with his eloquent lectures and deep love for poetry.', 'തോമസ് മത്തായി ഇംഗ്ലീഷ് സാഹിത്യത്തിലെ പ്രിയപ്പെട്ട പ്രൊഫസറായിരുന്നു. കവിതയോടുള്ള സ്നേഹവും പ്രഭാഷണങ്ങളും കൊണ്ട് അദ്ദേഹം വിദ്യാർത്ഥികളെ സ്വാധീനിച്ചു.', 'Professor of English', 'ഇംഗ്ലീഷ് പ്രൊഫസർ', 'MA in English Literature, University of Kerala', 'ഇംഗ്ലീഷ് സാഹിത്യത്തിൽ എം.എ, കേരള സർവകലാശാല', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-thomas-mathai.jpg', 1, 85, 5, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(5, 1, 'Joseph Mathai', 'ജോസഫ് മത്തായി', 'Sunny', 'സണ്ണി', 'joseph-mathai', 'male', '1945-11-30', '2021-09-02', 'Kottayam, Kerala', 'Kottayam, Kerala', 'Joseph Mathai dedicated his life to advanced farming and dairy development. He imported modern organic methods to the family plantation, creating a model farm.', 'ജോസഫ് മത്തായി തന്റെ ജീവിതം ആധുനിക കൃഷിരീതികൾക്കും ക്ഷീരവികസനത്തിനുമായി സമർപ്പിച്ചു. കുടുംബ തോട്ടത്തിലേക്ക് അദ്ദേഹം ജൈവകൃഷി രീതികൾ കൊണ്ടുവന്നു.', 'Planter & Farmer', 'കർഷകൻ', 'B.Sc in Agriculture, KAU', 'അഗ്രിക്കൾച്ചറിൽ ബി.എസ്‌സി, കേരള കാർഷിക സർവകലാശാല', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-joseph-mathai.jpg', 1, 90, 7, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(6, 1, 'George Mathai', 'ജോർജ്ജ് മത്തായി', 'Pappan', 'പാപ്പൻ', 'george-mathai', 'male', '1948-03-22', '2022-10-15', 'Kottayam, Kerala', 'Trivandrum, Kerala', 'George Mathai was a well-known cardiologist. He founded a charitable clinic in his village providing free healthcare for underprivileged families.', 'ജോർജ്ജ് മത്തായി അറിയപ്പെടുന്ന ഒരു കാർഡിയോളജിസ്റ്റായിരുന്നു. തന്റെ ഗ്രാമത്തിൽ അദ്ദേഹം ഒരു ചാരിറ്റബിൾ ക്ലിനിക്ക് സ്ഥാപിക്കുകയും നിർധനരായ കുടുംബങ്ങൾക്ക് സൗജന്യ ചികിത്സ നൽകുകയും ചെയ്തു.', 'Cardiologist', 'ഹൃദ്രോഗ വിദഗ്ദ്ധൻ', 'MD in Cardiology, Kasturba Medical College', 'കാർഡിയോളജിയിൽ എം.ഡി, കസ്തൂർബ മെഡിക്കൽ കോളേജ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-george-mathai.jpg', 1, 112, 9, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(7, 1, 'Abraham Mathai', 'അബ്രഹാം മത്തായി', 'Roy', 'റോയ്', 'abraham-mathai', 'male', '1950-09-07', '2023-01-28', 'Kottayam, Kerala', 'Kochi, Kerala', 'Abraham Mathai was a distinguished lawyer practicing at the High Court of Kerala. He offered free legal aid to social causes and advocated for environmental protection.', 'അബ്രഹാം മത്തായി കേരള ഹൈക്കോടതിയിൽ പ്രശസ്തനായ ഒരു അഭിഭാഷകനായിരുന്നു. സാമൂഹിക പ്രശ്നങ്ങൾക്ക് അദ്ദേഹം സൗജന്യ നിയമസഹായം നൽകുകയും പരിസ്ഥിതി സംരക്ഷണ പ്രവർത്തനങ്ങൾക്ക് നേതൃത്വം നൽകുകയും ചെയ്തു.', 'Advocate, High Court', 'ഹൈക്കോടതി അഭിഭാഷകൻ', 'LLB, Government Law College Ernakulam', 'എൽ.എൽ.ബി, ഗവൺമെന്റ് ലോ കോളേജ് എറണാകുളം', '', '', '', '', '', '', '', '', '/uploads/photos/profile-abraham-mathai.jpg', 0, 53, 11, 1, 1, '2026-06-25 20:26:12', '2026-06-26 01:01:33', NULL),
(8, 1, 'Philip Mathai', 'ഫിലിപ്പ് മത്തായി', 'Babu', 'ബാബു', 'philip-mathai', 'male', '1952-12-05', '2025-02-14', 'Kottayam, Kerala', 'Bangalore, Karnataka', 'Philip Mathai, the youngest of the brothers, had an illustrious banking career. He was a passionate singer, choir master, and organized multiple cultural festivals.', 'സഹോദരന്മാരിൽ ഇളയ ആളായ ഫിലിപ്പ് മത്തായി, ഒരു ബാങ്ക് മാനേജരായി വിരമിച്ചു. അദ്ദേഹം ഒരു മികച്ച ഗായകനും ക്വയർ മാസ്റ്ററുമായിരുന്നു.', 'Senior Bank Manager', 'സീനിയർ ബാങ്ക് മാനേജർ', 'MBA in Finance', 'ഫിനാൻസിൽ എം.ബി.എ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-philip-mathai.jpg', 1, 67, 13, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(9, 1, 'Mary John', 'മേരി ജോൺ', 'Mary', 'മേരി', 'mary-john', 'female', '1945-03-20', NULL, 'Kottayam, Kerala', NULL, 'Mary John is the spouse of the late John Mathai. She was a high school teacher in English and is currently active in local social associations.', 'മേരി ജോൺ അന്തരിച്ച ജോൺ മത്തായിയുടെ ഭാര്യയാണ്. അവർ സ്കൂൾ അദ്ധ്യാപികയായിരുന്നു. ഇപ്പോൾ പള്ളിയിലെ വിവിധ സാമൂഹിക പ്രവർത്തനങ്ങളിൽ സജീവമാണ്.', 'Retired Teacher', 'വിരമിച്ച അധ്യാപിക', 'BA, B.Ed', 'ബി.എ, ബി.എഡ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-mary-john.jpg', 0, 0, 4, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(10, 1, 'Ann Thomas', 'അന്ന തോമസ്', 'Annam', 'അന്നം', 'ann-thomas', 'female', '1948-07-14', NULL, 'Changanacherry, Kerala', NULL, 'Ann Thomas is a retired librarian and spouse of the late Prof. Thomas Mathai.', 'അന്ന തോമസ് റിട്ടയേർഡ് ലൈബ്രേറിയനും പ്രൊഫ. തോമസ് മത്തായിയുടെ ഭാര്യയുമാണ്.', 'Retired Librarian', 'വിരമിച്ച ലൈബ്രേറിയൻ', 'B.Lib.Sc', 'ബി.ലിബ്.എസ്‌സി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-ann-thomas.jpg', 0, 0, 6, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(11, 1, 'Susan Joseph', 'സൂസൻ ജോസഫ്', 'Susan', 'സൂസൻ', 'susan-joseph', 'female', '1948-02-10', NULL, 'Kozhencherry, Kerala', NULL, 'Susan Joseph is the spouse of late Joseph Mathai. She has a deep love for organic gardening and church choir.', 'സൂസൻ ജോസഫ് അന്തരിച്ച ജോസഫ് മത്തായിയുടെ ഭാര്യയാണ്. പൂന്തോട്ട നിർമ്മാണത്തിലും പള്ളിയിലെ ഗായകസംഘത്തിലും അവർ സജീവമാണ്.', 'Homemaker', 'ഗൃഹനാഥ', 'BSc Chemistry', 'ബി.എസ്‌സി കെമിസ്ട്രി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-susan-joseph.jpg', 0, 0, 8, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(12, 1, 'Dr. Elizabeth George', 'ഡോ. എലിസബത്ത് ജോർജ്ജ്', 'Lizy', 'ലിസി', 'elizabeth-george', 'female', '1950-04-05', '2015-08-20', 'Ernakulam, Kerala', 'Trivandrum, Kerala', 'Dr. Elizabeth George was a dedicated pediatrician who worked hand-in-hand with her husband Dr. George Mathai in rural medical camps.', 'ഡോ. എലിസബത്ത് ജോർജ്ജ് കുട്ടികളുടെ മികച്ച ഡോക്ടറായിരുന്നു, തന്റെ ഭർത്താവ് ഡോ. ജോർജ്ജിനൊപ്പം നിരവധി സൗജന്യ ക്ലിനിക്കുകളിൽ സേവനമനുഷ്ഠിച്ചു.', 'Pediatrician', 'കുട്ടികളുടെ ഡോക്ടർ', 'MD in Pediatrics', 'പീഡിയാട്രിക്സിൽ എം.ഡി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-elizabeth-george.jpg', 1, 44, 10, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(13, 1, 'Sarah Abraham', 'സാറാ അബ്രഹാം', 'Sarah', 'സാറാ', 'sarah-abraham', 'female', '1953-06-12', NULL, 'Kottayam, Kerala', NULL, 'Sarah Abraham is the spouse of late Advocate Abraham Mathai. She is a retired bank officer.', 'സാറാ അബ്രഹാം റിട്ടയേർഡ് ബാങ്ക് ഓഫീസറും പരേതനായ അഡ്വ. അബ്രഹാമിന്റെ ഭാര്യയുമാണ്.', 'Retired Bank Officer', 'വിരമിച്ച ബാങ്ക് ഉദ്യോഗസ്ഥ', 'B.Com', 'ബി.കോം', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-sarah-abraham.jpg', 0, 0, 12, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(14, 1, 'Jessy Philip', 'ജെസ്സി ഫിലിപ്പ്', 'Jessy', 'ജെസ്സി', 'jessy-philip', 'female', '1955-11-20', NULL, 'Thiruvalla, Kerala', NULL, 'Jessy Philip is the spouse of the late Philip Mathai and has worked as an interior designer.', 'ജെസ്സി ഫിലിപ്പ് ഇന്റീരിയർ ഡിസൈനറും പരേതനായ ഫിലിപ്പ് മത്തായിയുടെ ഭാര്യയുമാണ്.', 'Interior Designer', 'ഡിസൈനർ', 'Diploma in Design', 'ഡിപ്ലോമ ഇൻ ഡിസൈൻ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-jessy-philip.jpg', 0, 0, 14, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(15, 1, 'Mathew John', 'മാത്യു ജോൺ', 'Mathew', 'മാത്യു', 'mathew-john', 'male', '1972-04-15', NULL, 'Ernakulam, Kerala', NULL, 'Mathew John is the son of John Mathai. He is working in Dubai as a software architect.', 'മാത്യു ജോൺ, ജോൺ മത്തായിയുടെ മകനാണ്. ദുബായിൽ സോഫ്റ്റ്‌വെയർ ആർക്കിടെക്റ്റായി ജോലി ചെയ്യുന്നു.', 'Software Architect', 'സോഫ്റ്റ്‌വെയർ ആർക്കിടെക്റ്റ്', 'M.Tech in CS, IIT Madras', 'എം.ടെക്, ഐ.ഐ.ടി മദ്രാസ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-mathew-john.jpg', 0, 0, 15, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(16, 1, 'Mariam John', 'മറിയം ജോൺ', 'Mariam', 'മറിയം', 'mariam-john', 'female', '1975-08-22', NULL, 'Ernakulam, Kerala', NULL, 'Mariam John is the daughter of John Mathai and is currently a research scientist in Germany.', 'മറിയം ജോൺ, ജോൺ മത്തായിയുടെ മകളാണ്. ജർമ്മനിയിൽ ശാസ്ത്രജ്ഞയായി ജോലി ചെയ്യുന്നു.', 'Research Scientist', 'ഗവേഷക', 'PhD in Biotechnology', 'പി.എച്ച്.ഡി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-mariam-john.jpg', 0, 0, 16, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(17, 1, 'Krupa Thomas', 'കൃപ തോമസ്', 'Krupa', 'കൃപ', 'krupa-thomas', 'female', '1978-03-12', NULL, 'Kottayam, Kerala', NULL, 'Krupa Thomas is the daughter of Prof. Thomas Mathai. She is a writer and digital marketing expert.', 'കൃപ തോമസ്, പ്രൊഫ. തോമസ് മത്തായിയുടെ മകളാണ്. എഴുത്തുകാരിയും മാർക്കറ്റിംഗ് വിദഗ്ദ്ധയുമാണ്.', 'Author & Digital Marketer', 'എഴുത്തുകാരി', 'MA Journalism', 'എം.എ ജേണലിസം', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-krupa-thomas.jpg', 0, 0, 17, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(18, 1, 'Jerry George', 'ജെറി ജോർജ്ജ്', 'Jerry', 'ജെറി', 'jerry-george', 'male', '1980-11-05', NULL, 'Trivandrum, Kerala', NULL, 'Jerry George is the son of Dr. George Mathai. He has followed in his parents footsteps and is currently practicing medicine as a pediatrician.', 'ജെറി ജോർജ്ജ്, ഡോ. ജോർജ്ജിന്റെ മകനാണ്. മാതാപിതാക്കളുടെ പാത പിന്തുടർന്ന് പീഡിയാട്രിക് ഡോക്ടറായി ജോലി ചെയ്യുന്നു.', 'Pediatrician', 'കുട്ടികളുടെ ഡോക്ടർ', 'MD Pediatrics', 'എം.ഡി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-jerry-george.jpg', 0, 0, 18, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(19, 1, 'Kevin Abraham', 'കെവിൻ അബ്രഹാം', 'Kevin', 'കെവിൻ', 'kevin-abraham', 'male', '1984-09-29', '2026-06-11', 'Kochi, Kerala', '', 'Kevin Abraham is the son of Advocate Abraham Mathai. He is practicing as an advocate at the High Court of Kerala.', 'കെവിൻ അബ്രഹാം, അഡ്വ. അബ്രഹാം മത്തായിയുടെ മകനാണ്. കേരള ഹൈക്കോടതിയിൽ അഭിഭാഷകനായി ജോലി ചെയ്യുന്നു.', 'Advocate, High Court', 'ഹൈക്കോടതി അഭിഭാഷകൻ', 'LLM, NLSIU Bangalore', 'എൽ.എൽ.എം, ബാംഗ്ലൂർ', '', '', '', '', '', '', '', '', '/uploads/photos/profile-kevin-abraham.jpg', 1, 0, 19, 1, 1, '2026-06-25 20:26:12', '2026-06-26 01:02:01', NULL),
(20, 2, 'Cherian C. Varghese', 'ചെറിയാൻ സി. വർഗ്ഗീസ്', 'Cherian', 'ചെറിയാൻ', 'cherian-c-varghese', 'male', '1925-01-10', '2002-11-15', 'Niranam, Kerala', 'Niranam, Kerala', 'Cherian C. Varghese was a prominent leader and education advocate in Niranam. He dedicated his life to community progress.', 'നിരനത്തെ വിദ്യാഭ്യാസ സാമൂഹിക പുരോഗതികൾക്കായി സമർപ്പിച്ച ഒരു മികച്ച കമ്മ്യൂണിറ്റി നേതാവായിരുന്നു ചെറിയാൻ സി. വർഗ്ഗീസ്.', 'Social Worker & Planter', 'സാമൂഹിക പ്രവർത്തകൻ', 'BA, Madras University', 'ബി.എ, മദ്രാസ് യൂണിവേഴ്സിറ്റി', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-cherian-c-varghese.jpg', 1, 96, 1, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:27:36', NULL),
(21, 2, 'Aleyamma Cherian', 'അലിയാമ്മ ചെറിയാൻ', 'Aleyamma', 'അലിയാമ്മ', 'aleyamma-cherian', 'female', '1930-05-18', '2018-02-20', 'Pathanamthitta, Kerala', 'Niranam, Kerala', 'Aleyamma Cherian was a beloved mother who spent her life helping poor children with their schooling costs and meals.', 'നിർധനരായ കുട്ടികളുടെ വിദ്യാഭ്യാസ ചിലവുകൾക്കും മറ്റും സഹായങ്ങൾ നൽകിയിരുന്ന ഒരു ഉദാരമനസ്കയായിരുന്നു അലിയാമ്മ ചെറിയാൻ.', 'Homemaker', 'ഗൃഹനാഥ', 'High School', 'ഹൈസ്കൂൾ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-aleyamma-cherian.jpg', 1, 110, 2, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(22, 2, 'Dr. C. V. Cherian', 'ഡോ. സി. വി. ചെറിയാൻ', 'Cherian Jr.', 'ചെറിയാൻ ജൂനിയർ', 'c-v-cherian', 'male', '1955-08-25', '2021-04-12', 'Niranam, Kerala', 'Niranam, Kerala', 'Dr. C. V. Cherian was a well-respected physician in Niranam who treated local villagers with deep care and minimal fees.', 'നിരനത്തെ ജനങ്ങളുടെ പ്രിയങ്കരനായ ഡോക്ടറായിരുന്നു സി. വി. ചെറിയാൻ. വളരെ ചെറിയ ഫീസിൽ അദ്ദേഹം രോഗികളെ പരിചരിച്ചിരുന്നു.', 'General Physician', 'ഡോക്ടർ', 'MBBS, Government Medical College Kottayam', 'എം.ബി.ബി.എസ്, കോട്ടയം മെഡിക്കൽ കോളേജ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-c-v-cherian.jpg', 1, 45, 3, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(23, 2, 'Susan Cherian', 'സൂസൻ ചെറിയാൻ', 'Susan', 'സൂസൻ', 'susan-cherian', 'female', '1960-03-15', NULL, 'Kozhencherry, Kerala', NULL, 'Susan Cherian is the spouse of late Dr. C. V. Cherian and is a retired high school headmistress.', 'സൂസൻ ചെറിയാൻ വിരമിച്ച സ്കൂൾ ഹെഡ്മിസ്ട്രസും പരേതനായ ഡോ. സി.വി ചെറിയാന്റെ ഭാര്യയുമാണ്.', 'Retired Headmistress', 'ഹെഡ്മിസ്ട്രസ്', 'MA, MEd', 'എം.എ, എം.എഡ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-susan-cherian.jpg', 0, 0, 4, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(24, 2, 'Grace Cherian', 'ഗ്രേസ് ചെറിയാൻ', 'Grace', 'ഗ്രേസ്', 'grace-cherian', 'female', '1958-12-02', '2010-09-18', 'Niranam, Kerala', 'Ernakulam, Kerala', 'Grace Cherian was a social activist who worked extensively for rural women empowerment programs in Central Kerala.', 'മധ്യകേരളത്തിലെ സ്ത്രീ ശാക്തീകരണ പ്രസ്ഥാനങ്ങളിൽ മുൻപന്തിയിൽ നിന്നിരുന്ന ഒരു സാമൂഹിക പ്രവർത്തകയായിരുന്നു ഗ്രേസ് ചെറിയാൻ.', 'Social Worker', 'സാമൂഹിക പ്രവർത്തക', 'MSW, Rajagiri College of Social Sciences', 'എം.എസ്.ഡബ്ല്യു, രാജഗിരി കോളേജ്', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-grace-cherian.jpg', 1, 30, 5, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(25, 2, 'Rohan Cherian', 'രോഹൻ ചെറിയാൻ', 'Rohan', 'രോഹൻ', 'rohan-cherian', 'male', '1988-06-20', NULL, 'Trivandrum, Kerala', NULL, 'Rohan Cherian is the grandson of Cherian C. Varghese. He is currently working as a bank analyst in Bangalore.', 'രോഹൻ ചെറിയാൻ, ചെറിയാൻ സി. വർഗ്ഗീസിന്റെ കൊച്ചുമകനാണ്. ബാംഗ്ലൂരിൽ ബാങ്ക് അനലിസ്റ്റായി ജോലി ചെയ്യുന്നു.', 'Financial Analyst', 'ബാങ്ക് അനലിസ്റ്റ്', 'MBA, IIM Bangalore', 'എം.ബി.എ, ഐ.ഐ.എം ബാംഗ്ലൂർ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/photos/profile-rohan-cherian.jpg', 0, 0, 6, 1, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(26, 4, 'Idikula Yohannan', 'ഇടിക്കുള യോഹന്നാൻ', '', '', 'idikula-yohannan', 'male', '1937-02-07', '2010-09-29', 'Pathanapuram', 'Pathanapuram', 'Idikulla Yohannan was a revered family elder whose life was marked by faith, perseverance, and a deep commitment to family values. Through his wisdom and strong character, he nurtured a legacy of unity, hard work, and mutual respect. His guidance and dedication continue to inspire future generations, leaving an enduring mark on both family and community.', 'ഇടിക്കുള യോഹന്നാൻ വിശ്വാസവും അധ്വാനവും കുടുംബസ്നേഹവും നിറഞ്ഞ ജീവിതം നയിച്ച ഒരു ആദരണീയ കുടുംബനാഥനായിരുന്നു. തന്റെ ജ്ഞാനവും ദൃഢസ്വഭാവവും കൊണ്ട് ഐക്യത്തിന്റെയും കഠിനാധ്വാനത്തിന്റെയും പരസ്പര ബഹുമാനത്തിന്റെയും മൂല്യങ്ങൾ കുടുംബത്തിൽ വളർത്തിപ്പോറ്റി. അദ്ദേഹത്തിന്റെ മാർഗ്ഗനിർദേശവും സമർപ്പണവും തലമുറകളെ ഇന്നും പ്രചോദിപ്പിച്ചുകൊണ്ടിരിക്കുന്നു. കുടുംബത്തിന്റെയും സമൂഹത്തിന്റെയും ഹൃദയങ്ങളിൽ അദ്ദേഹം ഒരു മായാത്ത പൈതൃകം അവശേഷിപ്പിച്ചു.', 'Farmer', 'കർഷകൻ', '', '', '', '', '', '', '', '', '', '', NULL, 1, 1, 0, 1, 1, '2026-06-25 20:36:13', '2026-06-25 23:06:19', NULL),
(27, 4, 'Thankamma Yohannan', 'തങ്കമ്മ യോഹന്നാൻ', NULL, NULL, 'thankamma-yohannan', 'female', '1950-04-05', '2014-05-06', 'Pathanapuram', 'Pathanapuram', NULL, NULL, 'House wife', 'വീട്ടമ്മ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 1, 1, '2026-06-25 20:38:08', '2026-06-25 20:38:08', NULL),
(28, 4, 'Rajan Yohannan', 'രാജൻ യോഹന്നാൻ', '', '', 'rajan-yohannan', 'male', '1953-06-17', NULL, 'Pathanapuram', '', '', '', 'Regional Manager', 'റീജിയണൽ മാനേജർ', '', '', '', '', '', '', '', '', '', '', NULL, 0, 0, 0, 1, 1, '2026-06-25 20:40:03', '2026-06-25 20:53:27', NULL),
(29, 4, 'Thomas Yohannan', 'തോമസ് യോഹന്നാൻ', NULL, NULL, 'thomas-yohannan', 'male', '1955-06-12', NULL, 'Pathanapuram', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 20:51:55', '2026-06-25 20:51:55', NULL),
(30, 4, 'Babu Yohannan', 'ബാബു യോഹന്നാൻ', '', '', 'babu-yohannan', 'male', NULL, NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, 0, 0, 0, 1, 1, '2026-06-25 20:52:32', '2026-06-25 20:53:04', NULL),
(31, 4, 'Kunjumol Mathai', 'കുഞ്ഞുമോൾ മത്തായി', '', '', 'kunjumol-mathai', 'female', '1962-04-18', NULL, '', '', '', '', 'House Wife', 'വീട്ടമ്മ', '', '', '', '', '', '', '', '', '', '', NULL, 0, 0, 0, 1, 1, '2026-06-25 20:55:11', '2026-06-25 20:58:29', NULL),
(32, 4, 'James Yohannan', 'ജെയിംസ് യോഹന്നാൻ', NULL, NULL, 'james-yohannan', 'male', '1966-06-15', NULL, 'Pathanapuram', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 20:56:48', '2026-06-25 20:56:48', NULL),
(33, 4, 'Salu Yohannan', 'സാലു യോഹന്നാൻ', NULL, NULL, 'salu-yohannan', 'male', '1970-02-13', NULL, 'Pathanapuram', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 20:57:50', '2026-06-25 20:57:50', NULL),
(34, 4, 'Subin Rajan', 'സുബിൻ രാജൻ', 'Big B', '', 'subin-rajan', 'male', NULL, NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, 0, 0, 0, 1, 1, '2026-06-25 21:01:45', '2026-06-25 21:02:52', NULL),
(35, 4, 'Elsa Rajan', 'എൽസ രാജൻ', 'Valyanty', 'വല്യാൻ്റി', 'elsa-rajan', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 21:02:23', '2026-06-25 21:02:23', NULL),
(36, 4, 'N M Mathai', 'എൻ എം മത്തായി', 'Joy', NULL, 'n-m-mathai', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 21:03:34', '2026-06-25 21:03:34', NULL),
(37, 4, 'Jency Mathai', 'ജെൻസി മത്തായി', NULL, NULL, 'jency-mathai', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 1, 1, '2026-06-25 21:04:30', '2026-06-25 21:04:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `grave_locations`
--

CREATE TABLE `grave_locations` (
  `id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `cemetery_name` varchar(300) DEFAULT NULL,
  `plot_number` varchar(100) DEFAULT NULL,
  `section` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grave_locations`
--

INSERT INTO `grave_locations` (`id`, `member_id`, `latitude`, `longitude`, `address`, `cemetery_name`, `plot_number`, `section`, `created_at`, `updated_at`) VALUES
(1, 1, 9.59100000, 76.52200000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-01A', 'Section A', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(2, 2, 9.59110000, 76.52210000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-01B', 'Section A', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(3, 3, 9.58826700, 76.52290400, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-40B', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(4, 4, 9.58830000, 76.52295000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-40C', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(5, 5, 9.58840000, 76.52280000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-41A', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(6, 6, 9.58850000, 76.52270000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-42A', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(7, 7, 9.58860000, 76.52260000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-43A', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(8, 8, 9.58870000, 76.52250000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-44A', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(9, 12, 9.58880000, 76.52240000, 'Kottayam, Kerala, India', 'St. Marys Orthodox Church Cemetery', 'Plot-42B', 'Section B', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(10, 20, 9.38710000, 76.50500000, 'Niranam, Pathanamthitta, India', 'St. Marys Church Cemetery Niranam', 'Plot-CV01', 'Main Section', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(11, 21, 9.38720000, 76.50510000, 'Niranam, Pathanamthitta, India', 'St. Marys Church Cemetery Niranam', 'Plot-CV02', 'Main Section', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(12, 22, 9.38730000, 76.50520000, 'Niranam, Pathanamthitta, India', 'St. Marys Church Cemetery Niranam', 'Plot-CV03', 'Main Section', '2026-06-25 20:26:12', '2026-06-25 20:26:12'),
(13, 24, 9.38740000, 76.50530000, 'Niranam, Pathanamthitta, India', 'St. Marys Church Cemetery Niranam', 'Plot-CV04', 'Main Section', '2026-06-25 20:26:12', '2026-06-25 20:26:12');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED DEFAULT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(50) NOT NULL DEFAULT 'image',
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` int(10) UNSIGNED DEFAULT NULL,
  `width` int(10) UNSIGNED DEFAULT NULL,
  `height` int(10) UNSIGNED DEFAULT NULL,
  `alt_text` varchar(300) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `is_cover` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `family_id`, `member_id`, `file_name`, `file_path`, `file_type`, `mime_type`, `file_size`, `width`, `height`, `alt_text`, `caption`, `is_cover`, `is_featured`, `sort_order`, `uploaded_by`, `created_at`, `deleted_at`) VALUES
(1, 1, 1, 'gallery-vintage.jpg', '/uploads/photos/gallery-vintage.jpg', 'image', NULL, NULL, NULL, NULL, 'Mathai with family sons in 1965', 'Mathai with family sons in 1965', 0, 1, 0, 1, '2026-06-25 20:26:12', NULL),
(2, 1, 2, 'gallery-gathering.jpg', '/uploads/photos/gallery-gathering.jpg', 'image', NULL, NULL, NULL, NULL, 'Mariamma hosting dinner at the ancestral home', 'Mariamma hosting dinner at the ancestral home', 0, 1, 0, 1, '2026-06-25 20:26:12', NULL),
(3, 1, 3, 'gallery-estate.jpg', '/uploads/photos/gallery-estate.jpg', 'image', NULL, NULL, NULL, NULL, 'John visiting the family rubber plantations', 'John visiting the family rubber plantations', 0, 1, 0, 1, '2026-06-25 20:26:12', NULL),
(4, 1, 6, 'gallery-church.jpg', '/uploads/photos/gallery-church.jpg', 'image', NULL, NULL, NULL, NULL, 'St. Marys Orthodox Church cathedral where George served', 'St. Marys Orthodox Church cathedral where George served', 0, 1, 0, 1, '2026-06-25 20:26:12', NULL),
(5, 1, 2, '34cf5495-a4e4-474c-ad4a-09014a305ef4.jpg', '/uploads/photos/34cf5495-a4e4-474c-ad4a-09014a305ef4.jpg', 'image', 'image/jpeg', 33358, NULL, NULL, NULL, 'Family Prayer random pic', 0, 0, 0, 1, '2026-06-26 00:21:23', NULL),
(6, 2, 2, 'ee3a7b1e-5281-4f51-af0c-c92166ffb277.jpg', '/uploads/photos/ee3a7b1e-5281-4f51-af0c-c92166ffb277.jpg', 'image', 'image/jpeg', 30255, NULL, NULL, NULL, 'test', 0, 0, 0, 1, '2026-06-26 00:51:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `memorial_messages`
--

CREATE TABLE `memorial_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `visitor_name` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `memorial_messages`
--

INSERT INTO `memorial_messages` (`id`, `family_id`, `member_id`, `visitor_name`, `message`, `is_approved`, `is_featured`, `approved_by`, `approved_at`, `ip_address`, `created_at`, `deleted_at`) VALUES
(1, 1, 1, 'Dr. Joseph Samuel', 'Appachan was an inspiration to all of us. His memory will always remain in our hearts.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(2, 1, 1, 'Abraham Mathew', 'Remembering the patriarch of our family on his memorial day.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(3, 1, 1, 'Unknown Visitor', 'Wonderful site, looks very neat.', 0, 0, NULL, NULL, NULL, '2026-06-25 20:26:12', NULL),
(4, 1, 2, 'Elizabeth Kurian', 'Ammachi was the kindest soul. Her traditional recipes and love are still cherished.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(5, 1, 2, 'Sarah Joseph', 'Miss you, Ammachi. Thank you for all the beautiful stories.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(6, 1, 3, 'Thomas Varghese', 'John was an outstanding engineer and a very good friend. Working with him was an honor.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(7, 1, 3, 'Anonymous', 'Miss you Uncle Joy.', 0, 0, NULL, NULL, NULL, '2026-06-25 20:26:12', NULL),
(8, 1, 4, 'Prof. Jacob George', 'Thankachan was a brilliant academic. His lectures on Shakespeare were legendary.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(9, 1, 4, 'Former Student', 'You changed my life, professor. Rest in peace.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(10, 1, 4, 'SEO Spammer', 'Cheap electronics on sale! Click here to buy bitcoin!', 0, 0, NULL, NULL, NULL, '2026-06-25 20:26:12', NULL),
(11, 1, 5, 'K. R. Pillai', 'Sunny set an example in organic farming. His agricultural models are still followed by many.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(12, 1, 5, 'Neighbor', 'Always helpful and smiling. Rest in peace, Sunny chettan.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(13, 1, 6, 'Mercy Daniel', 'Dr. George treated my grandfather with so much care. A truly noble doctor.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(14, 1, 6, 'Colleague Doctor', 'His contributions to cardiology and charity will never be forgotten.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(15, 1, 6, 'Cryptobot', 'Make money working from home! Click my link.', 0, 0, NULL, NULL, NULL, '2026-06-25 20:26:12', NULL),
(16, 1, 7, 'Adv. Suresh Kumar', 'Roy was a man of integrity in the courtroom. A great lawyer and environmentalist.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(17, 1, 7, 'Social Worker', 'His pro-bono work for environmental conservation helped save our local wetlands.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(18, 1, 8, 'Choir Member', 'Babu uncle had an angelic voice. The church choir will never be the same without him.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(19, 1, 8, 'Family Friend', 'Remembering Babu with love and prayers.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(20, 1, 12, 'Dr. John Philip', 'Elizabeth was a dedicated pediatrician and a loving mother. Her memories shine on.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(21, 2, 20, 'K. C. Chacko', 'A respected figure in Niranam. Rest in peace, Cherian.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(22, 2, 21, 'Mariamma Jacob', 'Miss you, Aleyamma. Your prayers sustained many.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(23, 2, 22, 'Colleague Doctor', 'Dr. Cherian was a pioneer in general medicine. Deepest condolences.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(24, 2, 24, 'Grace Supporter', 'A gentle lady who empowered so many rural women. Gone too soon.', 1, 0, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', NULL),
(25, 4, 26, 'hi', 'test', 1, 0, 1, '2026-06-25 23:03:20', '::1', '2026-06-25 23:00:40', NULL),
(26, 1, 2, 'Anna ann mathew', 'Ammachi was so very kind to all....', 1, 0, 1, '2026-06-26 00:53:46', '::1', '2026-06-26 00:53:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `qr_codes`
--

CREATE TABLE `qr_codes` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `code` varchar(500) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `slug` varchar(200) NOT NULL,
  `url` varchar(500) NOT NULL,
  `scan_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `generated_by` int(10) UNSIGNED DEFAULT NULL,
  `generated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_scanned_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `qr_codes`
--

INSERT INTO `qr_codes` (`id`, `family_id`, `member_id`, `code`, `file_path`, `slug`, `url`, `scan_count`, `is_active`, `generated_by`, `generated_at`, `last_scanned_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'qr-mathai-k-mathew.png', '/uploads/qrcodes/qr-mathai-k-mathew.png', 'mathai-k-mathew', 'http://localhost:5173/memorial/mathai-k-mathew', 0, 1, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(2, 1, 2, 'qr-mariamma-mathai.png', '/uploads/qrcodes/qr-mariamma-mathai.png', 'mariamma-mathai', 'http://localhost:5173/memorial/mariamma-mathai', 0, 1, 1, '2026-06-25 20:26:12', NULL, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(3, 1, 3, 'qr-john-mathai.png', '/uploads/qrcodes/qr-john-mathai.png', 'john-mathai', 'http://localhost:5173/memorial/john-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(4, 1, 4, 'qr-thomas-mathai.png', '/uploads/qrcodes/qr-thomas-mathai.png', 'thomas-mathai', 'http://localhost:5173/memorial/thomas-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(5, 1, 5, 'qr-joseph-mathai.png', '/uploads/qrcodes/qr-joseph-mathai.png', 'joseph-mathai', 'http://localhost:5173/memorial/joseph-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(6, 1, 6, 'qr-george-mathai.png', '/uploads/qrcodes/qr-george-mathai.png', 'george-mathai', 'http://localhost:5173/memorial/george-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(7, 1, 12, 'qr-elizabeth-george.png', '/uploads/qrcodes/qr-elizabeth-george.png', 'elizabeth-george', 'http://localhost:5173/memorial/elizabeth-george', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(8, 1, 7, 'qr-abraham-mathai.png', '/uploads/qrcodes/qr-abraham-mathai.png', 'abraham-mathai', 'http://localhost:5173/memorial/abraham-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(9, 1, 8, 'qr-philip-mathai.png', '/uploads/qrcodes/qr-philip-mathai.png', 'philip-mathai', 'http://localhost:5173/memorial/philip-mathai', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(10, 2, 20, 'qr-cherian-c-varghese.png', '/uploads/qrcodes/qr-cherian-c-varghese.png', 'cherian-c-varghese', 'http://localhost:5173/memorial/cherian-c-varghese', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(11, 2, 21, 'qr-aleyamma-cherian.png', '/uploads/qrcodes/qr-aleyamma-cherian.png', 'aleyamma-cherian', 'http://localhost:5173/memorial/aleyamma-cherian', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(12, 2, 22, 'qr-c-v-cherian.png', '/uploads/qrcodes/qr-c-v-cherian.png', 'c-v-cherian', 'http://localhost:5173/memorial/c-v-cherian', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(13, 2, 24, 'qr-grace-cherian.png', '/uploads/qrcodes/qr-grace-cherian.png', 'grace-cherian', 'http://localhost:5173/memorial/grace-cherian', 0, 1, 1, '2026-06-25 20:26:13', NULL, '2026-06-25 20:26:13', '2026-06-25 20:26:13', NULL),
(14, 4, 26, 'qr-idikula-yohannan.png', '/uploads/qrcodes/qr-idikula-yohannan.png', 'idikula-yohannan', 'http://localhost:5173/memorial/idikula-yohannan', 0, 1, 1, '2026-06-25 20:36:13', NULL, '2026-06-25 20:36:13', '2026-06-25 20:36:13', NULL),
(15, 4, 27, 'qr-thankamma-yohannan.png', '/uploads/qrcodes/qr-thankamma-yohannan.png', 'thankamma-yohannan', 'http://localhost:5173/memorial/thankamma-yohannan', 0, 1, 1, '2026-06-25 20:38:08', NULL, '2026-06-25 20:38:08', '2026-06-25 20:38:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `relationships`
--

CREATE TABLE `relationships` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `related_member_id` int(10) UNSIGNED NOT NULL,
  `relationship_type` enum('father','mother','spouse','child','sibling','grandfather','grandmother','grandchild','uncle','aunt','cousin','other') NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relationships`
--

INSERT INTO `relationships` (`id`, `family_id`, `member_id`, `related_member_id`, `relationship_type`, `is_primary`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 2, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(3, 1, 1, 3, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(4, 1, 2, 3, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(5, 1, 3, 1, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(6, 1, 3, 2, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(7, 1, 3, 9, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(8, 1, 9, 3, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(9, 1, 1, 4, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(10, 1, 2, 4, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(11, 1, 4, 1, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(12, 1, 4, 2, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(13, 1, 4, 10, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(14, 1, 10, 4, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(15, 1, 1, 5, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(16, 1, 2, 5, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(17, 1, 5, 1, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(18, 1, 5, 2, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(19, 1, 5, 11, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(20, 1, 11, 5, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(21, 1, 1, 6, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(22, 1, 2, 6, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(23, 1, 6, 1, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(24, 1, 6, 2, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(25, 1, 6, 12, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(26, 1, 12, 6, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(27, 1, 1, 7, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(28, 1, 2, 7, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(32, 1, 13, 7, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(33, 1, 1, 8, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(34, 1, 2, 8, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(35, 1, 8, 1, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(36, 1, 8, 2, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(37, 1, 8, 14, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(38, 1, 14, 8, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(39, 1, 3, 15, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(40, 1, 9, 15, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(41, 1, 15, 3, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(42, 1, 15, 9, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(43, 1, 3, 16, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(44, 1, 9, 16, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(45, 1, 16, 3, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(46, 1, 16, 9, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(47, 1, 4, 17, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(48, 1, 10, 17, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(49, 1, 17, 4, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(50, 1, 17, 10, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(51, 1, 6, 18, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(52, 1, 12, 18, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(53, 1, 18, 6, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(54, 1, 18, 12, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(55, 1, 7, 19, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(56, 1, 13, 19, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(59, 2, 20, 21, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(60, 2, 21, 20, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(61, 2, 20, 22, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(62, 2, 21, 22, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(63, 2, 22, 20, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(64, 2, 22, 21, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(65, 2, 22, 23, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(66, 2, 23, 22, 'spouse', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(67, 2, 20, 24, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(68, 2, 21, 24, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(69, 2, 24, 20, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(70, 2, 24, 21, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(71, 2, 22, 25, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(72, 2, 23, 25, 'child', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(73, 2, 25, 22, 'father', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(74, 2, 25, 23, 'mother', 0, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(75, 4, 27, 26, 'spouse', 0, '2026-06-25 20:38:08', '2026-06-25 20:38:08', NULL),
(78, 4, 29, 26, 'father', 0, '2026-06-25 20:51:55', '2026-06-25 20:51:55', NULL),
(79, 4, 29, 27, 'mother', 0, '2026-06-25 20:51:55', '2026-06-25 20:51:55', NULL),
(80, 4, 30, 26, 'father', 0, '2026-06-25 20:53:04', '2026-06-25 20:53:04', NULL),
(81, 4, 30, 27, 'mother', 0, '2026-06-25 20:53:04', '2026-06-25 20:53:04', NULL),
(82, 4, 28, 26, 'father', 0, '2026-06-25 20:53:27', '2026-06-25 20:53:27', NULL),
(83, 4, 28, 27, 'mother', 0, '2026-06-25 20:53:27', '2026-06-25 20:53:27', NULL),
(86, 4, 32, 26, 'father', 0, '2026-06-25 20:56:48', '2026-06-25 20:56:48', NULL),
(87, 4, 32, 27, 'mother', 0, '2026-06-25 20:56:48', '2026-06-25 20:56:48', NULL),
(88, 4, 33, 26, 'father', 0, '2026-06-25 20:57:50', '2026-06-25 20:57:50', NULL),
(89, 4, 33, 27, 'mother', 0, '2026-06-25 20:57:50', '2026-06-25 20:57:50', NULL),
(90, 4, 31, 26, 'father', 0, '2026-06-25 20:58:29', '2026-06-25 20:58:29', NULL),
(91, 4, 31, 27, 'mother', 0, '2026-06-25 20:58:29', '2026-06-25 20:58:29', NULL),
(92, 4, 35, 28, 'spouse', 0, '2026-06-25 21:02:23', '2026-06-25 21:02:23', NULL),
(93, 4, 34, 28, 'father', 0, '2026-06-25 21:02:52', '2026-06-25 21:02:52', NULL),
(94, 4, 34, 35, 'mother', 0, '2026-06-25 21:02:52', '2026-06-25 21:02:52', NULL),
(95, 4, 36, 31, 'spouse', 0, '2026-06-25 21:03:34', '2026-06-25 21:03:34', NULL),
(96, 4, 37, 36, 'father', 0, '2026-06-25 21:04:30', '2026-06-25 21:04:30', NULL),
(97, 4, 37, 31, 'mother', 0, '2026-06-25 21:04:30', '2026-06-25 21:04:30', NULL),
(99, 4, 26, 27, 'spouse', 0, '2026-06-25 23:06:19', '2026-06-25 23:06:19', NULL),
(100, 1, 2, 1, 'spouse', 0, '2026-06-26 00:19:26', '2026-06-26 00:19:26', NULL),
(101, 1, 7, 1, 'father', 0, '2026-06-26 01:01:33', '2026-06-26 01:01:33', NULL),
(102, 1, 7, 2, 'mother', 0, '2026-06-26 01:01:33', '2026-06-26 01:01:33', NULL),
(103, 1, 7, 13, 'spouse', 0, '2026-06-26 01:01:33', '2026-06-26 01:01:33', NULL),
(104, 1, 19, 7, 'father', 0, '2026-06-26 01:02:01', '2026-06-26 01:02:01', NULL),
(105, 1, 19, 13, 'mother', 0, '2026-06-26 01:02:01', '2026-06-26 01:02:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `timeline_events`
--

CREATE TABLE `timeline_events` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(300) NOT NULL,
  `title_ml` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_ml` text DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_year` int(11) DEFAULT NULL,
  `event_type` enum('birth','marriage','career','education','award','retirement','death','milestone','other') NOT NULL DEFAULT 'milestone',
  `icon` varchar(50) DEFAULT NULL,
  `media_id` int(10) UNSIGNED DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `timeline_events`
--

INSERT INTO `timeline_events` (`id`, `family_id`, `member_id`, `title`, `title_ml`, `description`, `description_ml`, `event_date`, `event_year`, `event_type`, `icon`, `media_id`, `sort_order`, `is_featured`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Born into a traditional agricultural family in Kottayam.', NULL, NULL, 1915, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(2, 1, 1, 'Married Mariamma', 'മറിയാമ്മയുമായി വിവാഹം', 'Holy matrimony conducted in Kottayam.', NULL, NULL, 1938, 'marriage', 'marriage', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(3, 1, 1, 'Established Community School', 'കമ്മ്യൂണിറ്റി സ്കൂൾ സ്ഥാപിച്ചു', 'Donated land and founded the first local high school.', NULL, NULL, 1952, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(4, 1, 1, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away peacefully surrounded by his family.', NULL, NULL, 1995, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(5, 1, 2, 'Born in Thiruvalla', 'തിരുവല്ലയിൽ ജനനം', 'Born in the prominent Nedumprath family in Thiruvalla.', NULL, NULL, 1920, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(6, 1, 2, 'Married Mathai K. Mathew', 'മത്തായിയുമായി വിവാഹം', 'Began her journey as the matriarch of the family.', NULL, NULL, 1938, 'marriage', 'marriage', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(7, 1, 2, 'Passed Away', 'സ്വർഗ്ഗസ്ഥയായി', 'Left for her heavenly abode in her 85th year.', NULL, NULL, 2005, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(8, 1, 3, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Eldest son of Mathai K. Mathew and Mariamma Mathai.', NULL, NULL, 1940, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(9, 1, 3, 'Graduated in Civil Engineering', 'സിവിൽ എഞ്ചിനീയറിംഗിൽ ബിരുദം', 'Graduated from College of Engineering Trivandrum (CET).', NULL, NULL, 1962, 'education', 'education', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(10, 1, 3, 'Married Mary John', 'മേരിയുമായി വിവാഹം', 'Married Mary John, a high school English teacher.', NULL, NULL, 1970, 'marriage', 'marriage', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(11, 1, 3, 'Retired as Chief Engineer', 'ചീഫ് എഞ്ചിനീയറായി വിരമിക്കൽ', 'Retired after serving Kerala PWD for 30 years.', NULL, NULL, 1998, 'retirement', 'retirement', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(12, 1, 3, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away peacefully at Ernakulam.', NULL, NULL, 2018, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(13, 1, 4, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Second son of the family.', NULL, NULL, 1942, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(14, 1, 4, 'Completed MA in English', 'ഇംഗ്ലീഷിൽ എം.എ പൂർത്തിയാക്കി', 'Earned degree from University of Kerala.', NULL, NULL, 1965, 'education', 'education', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(15, 1, 4, 'Appointed as Professor', 'പ്രൊഫസറായി നിയമിതനായി', 'Joined English Department at CMS College.', NULL, NULL, 1972, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(16, 1, 4, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away in Kottayam.', NULL, NULL, 2020, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(17, 1, 5, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Third son, born in 1945.', NULL, NULL, 1945, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(18, 1, 5, 'Organic Farm Launch', 'ജൈവ കൃഷി തുടക്കം', 'Pioneered eco-friendly organic farming in the family plantation.', NULL, NULL, 1978, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(19, 1, 5, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away in Kottayam.', NULL, NULL, 2021, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(20, 1, 6, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Fourth son, born in 1948.', NULL, NULL, 1948, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(21, 1, 6, 'Completed MD in Cardiology', 'കാർഡിയോളജിയിൽ എം.ഡി പൂർത്തിയാക്കി', 'Graduated from Kasturba Medical College Manipal.', NULL, NULL, 1975, 'education', 'education', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(22, 1, 6, 'Founded Charity Clinic', 'ചാരിറ്റബിൾ ക്ലിനിക്ക് സ്ഥാപിച്ചു', 'Started free weekly cardiac clinic in the village.', NULL, NULL, 1985, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(23, 1, 6, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away in Trivandrum.', NULL, NULL, 2022, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(24, 1, 7, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Fifth son, born in 1950.', NULL, NULL, 1950, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(25, 1, 7, 'Began Law Practice', 'നിയമ പരിശീലനം ആരംഭിച്ചു', 'Enrolled in Kerala High Court bar.', NULL, NULL, 1976, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(26, 1, 7, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away in Kochi.', NULL, NULL, 2023, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(27, 1, 8, 'Born in Kottayam', 'കോട്ടയത്ത് ജനനം', 'Youngest son, born in 1952.', NULL, NULL, 1952, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(28, 1, 8, 'Senior Manager Promotion', 'സീനിയർ മാനേജരായി പ്രമോഷൻ', 'Promoted to Senior Manager at State Bank.', NULL, NULL, 1990, 'career', 'career', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(29, 1, 8, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away in Bangalore.', NULL, NULL, 2025, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(30, 1, 12, 'Born in Ernakulam', 'എറണാകുളത്ത് ജനനം', 'Born in 1950.', NULL, NULL, 1950, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(31, 1, 12, 'Married Dr. George Mathai', 'ഡോ. ജോർജ്ജുമായി വിവാഹം', 'Holy Matrimony at Ernakulam Church.', NULL, NULL, 1977, 'marriage', 'marriage', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(32, 1, 12, 'Passed Away', 'സ്വർഗ്ഗസ്ഥയായി', 'Passed away after a brief illness.', NULL, NULL, 2015, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(33, 2, 20, 'Born in Niranam', 'നിരനത്തിൽ ജനനം', 'Born as the eldest of the Cherian family.', NULL, NULL, 1925, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(34, 2, 20, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away peacefully at Niranam.', NULL, NULL, 2002, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(35, 2, 21, 'Born in Pathanamthitta', 'പത്തനംതിട്ടയിൽ ജനനം', 'Born in 1930.', NULL, NULL, 1930, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(36, 2, 21, 'Passed Away', 'സ്വർഗ്ഗസ്ഥയായി', 'Passed away at Niranam.', NULL, NULL, 2018, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(37, 2, 22, 'Born in Niranam', 'നിരനത്തിൽ ജനനം', 'Born in 1955.', NULL, NULL, 1955, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(38, 2, 22, 'Passed Away', 'സ്വർഗ്ഗസ്ഥനായി', 'Passed away at Niranam.', NULL, NULL, 2021, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(39, 2, 24, 'Born in Niranam', 'നിരനത്തിൽ ജനനം', 'Born in 1958.', NULL, NULL, 1958, 'birth', 'birth', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL),
(40, 2, 24, 'Passed Away', 'സ്വർഗ്ഗസ്ഥയായി', 'Passed away in Ernakulam.', NULL, NULL, 2010, 'death', 'death', NULL, 0, 0, 1, '2026-06-25 20:26:12', '2026-06-25 20:26:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
  `avatar` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar`, `is_active`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Admin', 'admin@familymemorial.com', '$2a$10$ADAzgBPM6oo38FbYCUO/p.2ZAyzbQxCTMTvirKRghBkF/qTS.G9Vm', 'super_admin', NULL, 1, '2026-06-28 12:14:06', '2026-06-25 20:26:09', '2026-06-28 12:14:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(300) NOT NULL,
  `description` text DEFAULT NULL,
  `video_type` enum('upload','youtube') NOT NULL DEFAULT 'upload',
  `file_name` varchar(500) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `youtube_url` varchar(500) DEFAULT NULL,
  `youtube_id` varchar(100) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `duration` int(10) UNSIGNED DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `family_id`, `member_id`, `title`, `description`, `video_type`, `file_name`, `file_path`, `youtube_url`, `youtube_id`, `thumbnail`, `duration`, `is_featured`, `sort_order`, `uploaded_by`, `created_at`, `deleted_at`) VALUES
(1, 1, 3, 'Memorial Tribute: John Mathai', 'A collection of testimonies from friends, family, and colleagues.', 'youtube', NULL, NULL, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, NULL, 1, 0, 1, '2026-06-25 20:26:12', NULL),
(2, 1, 6, 'Village Charity Clinic Inauguration', 'Video clip from the opening ceremony of the rural cardiology clinic.', 'youtube', NULL, NULL, 'https://www.youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', NULL, NULL, 1, 0, 1, '2026-06-25 20:26:12', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_user` (`user_id`),
  ADD KEY `idx_log_action` (`action`),
  ADD KEY `idx_log_entity` (`entity_type`,`entity_id`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_app_settings_key` (`setting_key`);

--
-- Indexes for table `audio_clips`
--
ALTER TABLE `audio_clips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audio_member` (`member_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `families`
--
ALTER TABLE `families`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_families_slug` (`slug`),
  ADD KEY `idx_families_active` (`is_active`),
  ADD KEY `idx_families_deleted` (`deleted_at`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `family_members`
--
ALTER TABLE `family_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_members_family` (`family_id`),
  ADD KEY `idx_members_slug` (`slug`),
  ADD KEY `idx_members_deceased` (`is_deceased`),
  ADD KEY `idx_members_deleted` (`deleted_at`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `grave_locations`
--
ALTER TABLE `grave_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_grave_member` (`member_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_family` (`family_id`),
  ADD KEY `idx_media_member` (`member_id`),
  ADD KEY `idx_media_type` (`file_type`),
  ADD KEY `idx_media_deleted` (`deleted_at`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `memorial_messages`
--
ALTER TABLE `memorial_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_msg_family` (`family_id`),
  ADD KEY `idx_msg_member` (`member_id`),
  ADD KEY `idx_msg_approved` (`is_approved`),
  ADD KEY `idx_msg_deleted` (`deleted_at`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `qr_codes`
--
ALTER TABLE `qr_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_qr_family` (`family_id`),
  ADD KEY `idx_qr_member` (`member_id`),
  ADD KEY `idx_qr_slug` (`slug`),
  ADD KEY `idx_qr_deleted` (`deleted_at`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `relationships`
--
ALTER TABLE `relationships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rel_family` (`family_id`),
  ADD KEY `idx_rel_member` (`member_id`),
  ADD KEY `idx_rel_related` (`related_member_id`),
  ADD KEY `idx_rel_type` (`relationship_type`),
  ADD KEY `idx_rel_deleted` (`deleted_at`);

--
-- Indexes for table `timeline_events`
--
ALTER TABLE `timeline_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_timeline_family` (`family_id`),
  ADD KEY `idx_timeline_member` (`member_id`),
  ADD KEY `idx_timeline_date` (`event_date`),
  ADD KEY `idx_timeline_type` (`event_type`),
  ADD KEY `idx_timeline_deleted` (`deleted_at`),
  ADD KEY `media_id` (`media_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_deleted` (`deleted_at`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_video_family` (`family_id`),
  ADD KEY `idx_video_member` (`member_id`),
  ADD KEY `idx_video_type` (`video_type`),
  ADD KEY `idx_video_deleted` (`deleted_at`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `audio_clips`
--
ALTER TABLE `audio_clips`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `families`
--
ALTER TABLE `families`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `family_members`
--
ALTER TABLE `family_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `grave_locations`
--
ALTER TABLE `grave_locations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `memorial_messages`
--
ALTER TABLE `memorial_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `qr_codes`
--
ALTER TABLE `qr_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `relationships`
--
ALTER TABLE `relationships`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `timeline_events`
--
ALTER TABLE `timeline_events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `audio_clips`
--
ALTER TABLE `audio_clips`
  ADD CONSTRAINT `audio_clips_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `audio_clips_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `families`
--
ALTER TABLE `families`
  ADD CONSTRAINT `families_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `family_members`
--
ALTER TABLE `family_members`
  ADD CONSTRAINT `family_members_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `family_members_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `grave_locations`
--
ALTER TABLE `grave_locations`
  ADD CONSTRAINT `grave_locations_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `media_ibfk_3` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `memorial_messages`
--
ALTER TABLE `memorial_messages`
  ADD CONSTRAINT `memorial_messages_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `memorial_messages_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `memorial_messages_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `qr_codes`
--
ALTER TABLE `qr_codes`
  ADD CONSTRAINT `qr_codes_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `qr_codes_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `qr_codes_ibfk_3` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `relationships`
--
ALTER TABLE `relationships`
  ADD CONSTRAINT `relationships_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `relationships_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `relationships_ibfk_3` FOREIGN KEY (`related_member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `timeline_events`
--
ALTER TABLE `timeline_events`
  ADD CONSTRAINT `timeline_events_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeline_events_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timeline_events_ibfk_3` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timeline_events_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `family_members` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `videos_ibfk_3` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
