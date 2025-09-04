DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` int unsigned NOT NULL,
  `ios_app_version` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ios 최신 앱 버전',
  `ios_app_build_number` int NOT NULL COMMENT 'ios 최신 앱 빌드번호',
  `ios_app_required_build_number` int NOT NULL COMMENT 'ios 요구 빌드 번호',
  `ios_market_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aos_app_version` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'aos 최신 앱 버전',
  `aos_app_build_number` int NOT NULL COMMENT 'aos 최신 앱 빌드번호',
  `aos_app_required_build_number` int NOT NULL COMMENT 'aos 요구 빌드 번호',
  `aos_market_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL COMMENT '등록 일자',
  `update_date` datetime NOT NULL COMMENT '수정 일자',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `data_key`;
CREATE TABLE `data_key` (
  `id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_key` bigint unsigned NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `faq`;
CREATE TABLE `faq` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `faq_category_id` int unsigned NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ON','OFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_seq` int unsigned NOT NULL,
  `create_date` datetime NOT NULL COMMENT '등록 일자',
  `update_date` datetime NOT NULL COMMENT '수정 일자',
  PRIMARY KEY (`id`),
  KEY `idx_vs_id` (`view_seq`,`id`),
  KEY `idx_s_vs_id` (`status`,`view_seq`,`id`),
  KEY `idx_fcid_id` (`faq_category_id`,`id`),
  KEY `idx_fcid_s_id` (`faq_category_id`,`status`,`id`),
  KEY `idx_fcid_s_vs_id` (`faq_category_id`,`status`,`view_seq`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `faq_category`;
CREATE TABLE `faq_category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ON','OFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `view_seq` int unsigned NOT NULL,
  `create_date` datetime NOT NULL COMMENT '등록 일자',
  `update_date` datetime NOT NULL COMMENT '수정 일자',
  PRIMARY KEY (`id`),
  KEY `idx_vs_id` (`view_seq`,`id`),
  KEY `idx_s_vs_id` (`status`,`view_seq`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `fcm_token`;
CREATE TABLE `fcm_token` (
  `id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `os` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `os_version` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `build_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_manufacturer` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_os` (`os`),
  KEY `idx_uid_os` (`user_id`,`os`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notice_date` datetime NOT NULL,
  `status` enum('ON','OFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '상태 (ON=노출, OFF=숨김)',
  `create_date` datetime NOT NULL COMMENT '등록 일자',
  `update_date` datetime NOT NULL COMMENT '수정 일자',
  PRIMARY KEY (`id`),
  KEY `idx_s_id` (`status`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_key` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 KEY',
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sns_user_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '이름',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_push_notification` tinyint(1) NOT NULL DEFAULT '1' COMMENT '신규 광고 및 이벤트 알림',
  `reg_os` enum('ios','aos') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reg_type` enum('GUEST','KAKAO','NAVER','GOOGLE','APPLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reg_app_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reg_install_app_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login_date` datetime DEFAULT NULL,
  `resign_date` datetime DEFAULT NULL,
  `status` enum('ON','RESIGN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '상태 (ON=사용, RESIGN=탈퇴)',
  `create_date` datetime NOT NULL COMMENT '등록 일자',
  `update_date` datetime NOT NULL COMMENT '수정 일자',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_key_UNIQUE` (`user_key`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `idx_cd` (`create_date`),
  KEY `idx_s_ld` (`status`,`login_date`),
  KEY `idx_s_cd` (`status`,`create_date`),
  KEY `idx_s_rd` (`status`,`resign_date`),
  KEY `idx_s_isltnlm_ld` (`status`,`login_date`),
  KEY `idx_s_ipac_lacymd_lacpsymd` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `user_id` int unsigned NOT NULL,
  `app_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login_key` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `os` enum('ios','aos') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `os_version` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `build_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_id` int unsigned NOT NULL,
  `expire_date` datetime DEFAULT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`app_key`),
  UNIQUE KEY `login_key_UNIQUE` (`login_key`),
  KEY `idx_ak_uid` (`app_key`,`user_id`),
  KEY `idx_uid_ud` (`user_id`,`update_date`),
  KEY `idx_ud` (`update_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_login_sns`;
CREATE TABLE `user_login_sns` (
  `type` enum('KAKAO','NAVER','GOOGLE','APPLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sns_user_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sns_access_token` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sns_access_token_exp` datetime DEFAULT NULL,
  `sns_refresh_token` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sns_refresh_token_exp` datetime DEFAULT NULL,
  `expire_date` datetime DEFAULT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`type`,`sns_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_resign`;
CREATE TABLE `user_resign` (
  `user_id` int unsigned NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `idx_cd` (`create_date`),
  KEY `idx_m_cd` (`create_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
