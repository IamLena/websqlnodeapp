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
-- Table structure for table `placeholder`
--

DROP TABLE IF EXISTS `placeholder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placeholder` (
  `id` varchar(36) NOT NULL,
  `link` varchar(100) DEFAULT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `os` varchar(10) DEFAULT NULL,
  `device` varchar(10) DEFAULT NULL,
  `tif_id` varchar(36) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `placeholder_os_FK_idx` (`os`),
  KEY `placeholder_dev_FK_idx` (`device`),
  KEY `origin_tif_place_FK_idx` (`tif_id`),
  CONSTRAINT `origin_tif_FK` FOREIGN KEY (`tif_id`) REFERENCES `tif` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `placeholder_dev_FK` FOREIGN KEY (`device`) REFERENCES `devices` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `placeholder_os_FK` FOREIGN KEY (`os`) REFERENCES `os` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placeholder`
--

LOCK TABLES `placeholder` WRITE;
/*!40000 ALTER TABLE `placeholder` DISABLE KEYS */;
INSERT INTO `placeholder` VALUES ('68d249b5-fa46-11ea-bdb3-a0c58986b5c2','https://www.apple.com/v/ipad/home/bf/images/overview/ipados__c32v3imah9iu_medium.jpg','new poss matrix','iso9','ipad_air2','c09d8e54-fa10-11ea-bfab-a0c58986b5c2',0);
/*!40000 ALTER TABLE `placeholder` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-23 16:32:43
