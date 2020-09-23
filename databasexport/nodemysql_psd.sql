-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: nodemysql
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `psd`
--

DROP TABLE IF EXISTS `psd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psd` (
  `id` varchar(36) NOT NULL,
  `code` varchar(10) NOT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `designer_id` varchar(36) DEFAULT NULL,
  `lan_geo` varchar(10) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `scale` int(11) DEFAULT NULL,
  `ppi` int(11) DEFAULT NULL,
  `grab` varchar(170) DEFAULT NULL,
  `preview` varchar(170) DEFAULT NULL,
  `filename` varchar(170) DEFAULT NULL,
  `os` varchar(10) DEFAULT NULL,
  `device` varchar(10) DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `lan_geo_FK_idx` (`lan_geo`),
  KEY `parent_psd_FK_idx` (`parent_id`),
  KEY `psd_os_idx` (`os`),
  KEY `psd_dev_FK_idx` (`device`),
  KEY `designer_FK_idx` (`designer_id`),
  CONSTRAINT `designer_FK` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `lan_psd_FK` FOREIGN KEY (`lan_geo`) REFERENCES `lan_geo` (`lan_geo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `psd_dev_FK` FOREIGN KEY (`device`) REFERENCES `devices` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `psd_os_FK` FOREIGN KEY (`os`) REFERENCES `os` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `psd_parent_FK` FOREIGN KEY (`parent_id`) REFERENCES `psd` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psd`
--

LOCK TABLES `psd` WRITE;
/*!40000 ALTER TABLE `psd` DISABLE KEYS */;
INSERT INTO `psd` VALUES ('14612afd-fa48-11ea-bdb3-a0c58986b5c2','cvjhf76',NULL,'67c3227e-dd48-11ea-beae-a0c58986b5c2','en-US',1,'2020-09-19 10:16:47',272,340,1,326,'uploads/w1/38_watch/cvjhf76_some-text-here_en-US_JB_1/cvjhf76_some-text-here_en-US_JB_1_grab.png','/previews/w1/38_watch/cvjhf76_some-text-here_en-US_JB_1.png','uploads/w1/38_watch/cvjhf76_some-text-here_en-US_JB_1/cvjhf76_some-text-here_en-US_JB_1.psd','w1','38_watch','some text here',0),('39fd9ba1-fa11-11ea-bfab-a0c58986b5c2','ajkd32s','c09d7cfd-fa10-11ea-bfab-a0c58986b5c2','ffaf9cf7-dd47-11ea-beae-a0c58986b5c2','en-GB',1,'2020-09-19 03:44:08',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-GB_VP_1/ajkd32s_new-possibilities_en-GB_VP_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-GB_VP_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-GB_VP_1/ajkd32s_new-possibilities_en-GB_VP_1.psd','iso9','ipad_air2','new possibilities',0),('4992bb47-f9fc-11ea-bfab-a0c58986b5c2','3kj45',NULL,'67c3227e-dd48-11ea-beae-a0c58986b5c2','en-US',1,'2020-09-19 01:14:14',4096,2304,1,102,'uploads/Cheetah/imac/3kj45_new-possibilities-12_en-US_JB_1/3kj45_new-possibilities-12_en-US_JB_1_grab.png','/previews/Cheetah/imac/3kj45_new-possibilities-12_en-US_JB_1.png','uploads/Cheetah/imac/3kj45_new-possibilities-12_en-US_JB_1/3kj45_new-possibilities-12_en-US_JB_1.psd','Cheetah','imac','new possibilities 12',0),('808e041d-f9ea-11ea-bfab-a0c58986b5c2','ajkd32s',NULL,'67c3227e-dd48-11ea-beae-a0c58986b5c2','en-US',1,'2020-09-18 23:06:56',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_1/ajkd32s_new-possibilities_en-US_JB_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_1/ajkd32s_new-possibilities_en-US_JB_1.psd','iso9','ipad_air2','new possibilities',0),('85512e5c-fa47-11ea-bdb3-a0c58986b5c2','sdkj09',NULL,'67c3227e-dd48-11ea-beae-a0c58986b5c2','en-US',1,'2020-09-19 10:12:47',272,340,1,326,'uploads/w1/38_watch/sdkj09_this-is-my-content_en-US_JB_1/sdkj09_this-is-my-content_en-US_JB_1_grab.png','/previews/w1/38_watch/sdkj09_this-is-my-content_en-US_JB_1.png','uploads/w1/38_watch/sdkj09_this-is-my-content_en-US_JB_1/sdkj09_this-is-my-content_en-US_JB_1.psd','w1','38_watch','this is my content',0),('a3053be3-fa44-11ea-bdb3-a0c58986b5c2','ajkd32s','808e041d-f9ea-11ea-bfab-a0c58986b5c2','b54ac212-fa42-11ea-bdb3-a0c58986b5c2','fr-FR',1,'2020-09-19 09:52:08',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1.psd','iso9','ipad_air2','new possibilities',0),('c09d7cfd-fa10-11ea-bfab-a0c58986b5c2','ajkd32s','808e041d-f9ea-11ea-bfab-a0c58986b5c2','67c3227e-dd48-11ea-beae-a0c58986b5c2','en-US',2,'2020-09-19 03:40:44',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_2/ajkd32s_new-possibilities_en-US_JB_2_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_2.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_2/ajkd32s_new-possibilities_en-US_JB_2.psd','iso9','ipad_air2','new possibilities',0),('c8ca7b23-fa46-11ea-bdb3-a0c58986b5c2','ajkd32s','c09d7cfd-fa10-11ea-bfab-a0c58986b5c2','247a735f-dd48-11ea-beae-a0c58986b5c2','ru-RU',1,'2020-09-19 10:07:31',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1.psd','iso9','ipad_air2','new possibilities',0),('dffa211b-fa42-11ea-bdb3-a0c58986b5c2','ajkd32s','c09d7cfd-fa10-11ea-bfab-a0c58986b5c2','b54ac212-fa42-11ea-bdb3-a0c58986b5c2','fr-FR',1,'2020-09-19 09:39:32',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1.psd','iso9','ipad_air2','new possibilities',0),('eebae43d-fa10-11ea-bfab-a0c58986b5c2','ajkd32s','808e041d-f9ea-11ea-bfab-a0c58986b5c2','247a735f-dd48-11ea-beae-a0c58986b5c2','ru-RU',1,'2020-09-19 03:42:01',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1_grab.png','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1.png','uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1.psd','iso9','ipad_air2','new possibilities',0);
/*!40000 ALTER TABLE `psd` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-23 16:32:55
