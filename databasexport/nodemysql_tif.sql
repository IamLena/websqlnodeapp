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
-- Table structure for table `tif`
--

DROP TABLE IF EXISTS `tif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tif` (
  `id` varchar(36) NOT NULL,
  `psd_id` varchar(36) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `scale` int(11) DEFAULT NULL,
  `ppi` int(11) DEFAULT NULL,
  `filename` varchar(170) DEFAULT NULL,
  `preview` varchar(170) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `tif_psd_FK_idx` (`psd_id`),
  CONSTRAINT `tif_psd_FK` FOREIGN KEY (`psd_id`) REFERENCES `psd` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tif`
--

LOCK TABLES `tif` WRITE;
/*!40000 ALTER TABLE `tif` DISABLE KEYS */;
INSERT INTO `tif` VALUES ('14613caa-fa48-11ea-bdb3-a0c58986b5c2','14612afd-fa48-11ea-bdb3-a0c58986b5c2',272,340,1,326,'uploads/w1/38_watch/cvjhf76_some-text-here_en-US_JB_1/cvjhf76_some-text-here_en-US_JB_1.tif','/previews/w1/38_watch/cvjhf76_some-text-here_en-US_JB_1.png',0),('39fda819-fa11-11ea-bfab-a0c58986b5c2','39fd9ba1-fa11-11ea-bfab-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-GB_VP_1/ajkd32s_new-possibilities_en-GB_VP_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-GB_VP_1.png',0),('808e2113-f9ea-11ea-bfab-a0c58986b5c2','808e041d-f9ea-11ea-bfab-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_1/ajkd32s_new-possibilities_en-US_JB_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_1.png',0),('a3054f49-fa44-11ea-bdb3-a0c58986b5c2','a3053be3-fa44-11ea-bdb3-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1.png',0),('c09d8e54-fa10-11ea-bfab-a0c58986b5c2','c09d7cfd-fa10-11ea-bfab-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_2/ajkd32s_new-possibilities_en-US_JB_2.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_en-US_JB_2.png',0),('c8ca8d51-fa46-11ea-bdb3-a0c58986b5c2','c8ca7b23-fa46-11ea-bdb3-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1.png',0),('dffa300f-fa42-11ea-bdb3-a0c58986b5c2','dffa211b-fa42-11ea-bdb3-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1/ajkd32s_new-possibilities_fr-FR_JJ_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_fr-FR_JJ_1.png',0),('eebaf163-fa10-11ea-bfab-a0c58986b5c2','eebae43d-fa10-11ea-bfab-a0c58986b5c2',1536,2048,1,264,'uploads/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1/ajkd32s_new-possibilities_ru-RU_PI_1.tif','/previews/iso9/ipad_air2/ajkd32s_new-possibilities_ru-RU_PI_1.png',0);
/*!40000 ALTER TABLE `tif` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-23 16:32:57
