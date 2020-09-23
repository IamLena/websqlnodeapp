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
-- Table structure for table `os`
--

DROP TABLE IF EXISTS `os`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `os` (
  `nickname` varchar(10) NOT NULL,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`nickname`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `os`
--

LOCK TABLES `os` WRITE;
/*!40000 ALTER TABLE `os` DISABLE KEYS */;
INSERT INTO `os` VALUES ('ios1','iOS 1'),('iso10','iOS 10'),('iso11','iOS 11'),('iso12','iOS 12'),('iso13','iOS 13'),('ios2','iOS 2'),('iso3','iOS 3'),('iso4','iOS 4'),('iso5','iOS 5'),('iso6','iOS 6'),('iso7','iOS 7'),('iso8','iOS 8'),('iso9','iOS 9'),('mac8','Mac OS 8'),('mac9','Mac OS 9'),('Cheetah','Mac OS X 10.0'),('Puma','Mac OS X 10.1'),('Jaguar','Mac OS X 10.2'),('lion','Mac OS X Lion'),('panther','Mac OS X Panther'),('Kodiak','Mac OS X Public Beta'),('cotalina','macOS Catalina'),('highsierra','macOS High Sierra'),('mojave','macOS Mojave'),('sierra','macOS Sierra'),('elcapitan','OS X El Capitan'),('mavericks','OS X Mavericks'),('mountain','OS X Mountain'),('yosemite','OS X Yosemite'),('sys2','System 2'),('sys3','System 3'),('sys4','System 4'),('sys7','System 7'),('sys5','System Software 5'),('sys6','System Software 6'),('w1','watchOS 1'),('w2','watchOS 2'),('w3','watchOS 3'),('w4','watchOS 4'),('w5','watchOS 5'),('w6','watchOS 6');
/*!40000 ALTER TABLE `os` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-23 16:32:53
