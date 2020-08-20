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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `login` varchar(10) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `lan_geo` varchar(6) NOT NULL,
  `password` varchar(100) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `img` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `lan_geo_FK_idx` (`lan_geo`),
  CONSTRAINT `lan_geo_FK` FOREIGN KEY (`lan_geo`) REFERENCES `lan_geo` (`lan_geo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='id (int auto increment) - PK\nname, email, lan_geo as FK (en_us), type, login (+ write in filename), password.\ntypes: designer, content manager, graphic artist';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('247a735f-dd48-11ea-beae-a0c58986b5c2','pe_ivan','Peter','Ivanov','peter@mail.com','ru-RU','$2a$10$F6ujT4kPifwpaKR7.j6vmOM9jJWCqJSB23F1x1hcYb5qE/4BvA35a',1,NULL),('67c3227e-dd48-11ea-beae-a0c58986b5c2','john123','John','Brown','john@gmail.com','en-US','$2a$10$P8E51nH8/NauDXnRt3yUR.VHGfysDO/rwlmkuyVkO75dmy2Hkhrzm',1,NULL),('8c14a593-dd48-11ea-beae-a0c58986b5c2','lola98','Lola','Dark','lola@gmail.com','es-PE','$2a$10$RF61xXCMRP4ueOzDvZXQSeVjTFic/D7egpRYTBlOUpKfP8gl5Yuj.',2,NULL),('b0d00700-dd48-11ea-beae-a0c58986b5c2','bobby45','Bob','Peterson','bob45@mail.com','en-GB','$2a$10$ezPQj0dgCqW6YWLeqo/sQ./71Nnkm8k/jFtw4K/Y/9jZzZi3jiI1O',2,NULL),('d71a98fe-dd48-11ea-beae-a0c58986b5c2','yaky23','Yaky','Moma','yaky@mail.com','zh-HK','$2a$10$0WiXdtYMHdagByUgAWVPn.SZT4N801CrZP.A5JQDT5gsd9l.4egdS',3,NULL),('fa2a22ce-dd48-11ea-beae-a0c58986b5c2','katusha','Katerina','Novalova','kat@gmail.com','ru-RU','$2a$10$F7Jtpn4XtCMlzUI44HSob.6e7Njkj379frxZ5WMXIZ6kURa5dkKTW',3,NULL),('ffaf9cf7-dd47-11ea-beae-a0c58986b5c2','va_poop','Vasia','Poopkin','vasya@gmail.com','en-GB','$2a$10$FDo20KEno/RJEy63NMLtquFzaQ88rlhvO3Z72k046jIvKk5VcEDqG',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-20 23:00:57
