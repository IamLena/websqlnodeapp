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
-- Table structure for table `os_dev_comp`
--

DROP TABLE IF EXISTS `os_dev_comp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `os_dev_comp` (
  `os_nick` varchar(10) NOT NULL,
  `dev_nick` varchar(10) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `os_dev_OS_KF_idx` (`os_nick`),
  KEY `os_dev_DEV_FK_idx` (`dev_nick`),
  CONSTRAINT `os_dev_DEV_FK` FOREIGN KEY (`dev_nick`) REFERENCES `devices` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `os_dev_OS_KF` FOREIGN KEY (`os_nick`) REFERENCES `os` (`nickname`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `os_dev_comp`
--

LOCK TABLES `os_dev_comp` WRITE;
/*!40000 ALTER TABLE `os_dev_comp` DISABLE KEYS */;
INSERT INTO `os_dev_comp` VALUES ('Cheetah','imac',3),('cotalina','imac',15),('elcapitan','imac',27),('highsierra','imac',39),('ios1','iphone6',58),('ios1','iphone_se',59),('ios2','iphone6',70),('ios2','iphone_se',71),('iso10','iphone6',82),('iso10','iphone_se',83),('iso11','iphone6',94),('iso11','iphone_se',95),('iso11','ipod_touch',96),('iso12','38_watch',97),('iso12','42_watch',98),('iso12','imac',99),('iso12','ipad_air2',100),('iso12','ipad_mini2',101),('iso12','ipad_mini3',102),('iso12','ipad_mini4',103),('iso12','ipad_mini5',104),('iso12','ipad_pro97',105),('iso12','iphone6',106),('iso12','iphone_se',107),('iso12','ipod_touch',108),('iso13','38_watch',109),('iso13','42_watch',110),('iso13','imac',111),('iso13','ipad_air2',112),('iso13','ipad_mini2',113),('iso13','ipad_mini3',114),('iso13','ipad_mini4',115),('iso13','ipad_mini5',116),('iso13','ipad_pro97',117),('iso13','iphone6',118),('iso13','iphone_se',119),('iso13','ipod_touch',120),('iso3','38_watch',121),('iso3','42_watch',122),('iso3','imac',123),('iso3','ipad_air2',124),('iso3','ipad_mini2',125),('iso3','ipad_mini3',126),('iso3','ipad_mini4',127),('iso3','ipad_mini5',128),('iso3','ipad_pro97',129),('iso3','iphone6',130),('iso3','iphone_se',131),('iso3','ipod_touch',132),('iso4','38_watch',133),('iso4','42_watch',134),('iso4','imac',135),('iso4','ipad_air2',136),('iso4','ipad_mini2',137),('iso4','ipad_mini3',138),('iso4','ipad_mini4',139),('iso4','ipad_mini5',140),('iso4','ipad_pro97',141),('iso4','iphone6',142),('iso4','iphone_se',143),('iso4','ipod_touch',144),('iso5','38_watch',145),('iso5','42_watch',146),('iso5','imac',147),('iso5','ipad_air2',148),('iso5','ipad_mini2',149),('iso5','ipad_mini3',150),('iso5','ipad_mini4',151),('iso5','ipad_mini5',152),('iso5','ipad_pro97',153),('iso5','iphone6',154),('iso5','iphone_se',155),('iso5','ipod_touch',156),('iso6','38_watch',157),('iso6','42_watch',158),('iso6','imac',159),('iso6','ipad_air2',160),('iso6','ipad_mini2',161),('iso6','ipad_mini3',162),('iso6','ipad_mini4',163),('iso6','ipad_mini5',164),('iso6','ipad_pro97',165),('iso6','iphone6',166),('iso6','iphone_se',167),('iso6','ipod_touch',168),('iso7','38_watch',169),('iso7','42_watch',170),('iso7','imac',171),('iso7','ipad_air2',172),('iso7','ipad_mini2',173),('iso7','ipad_mini3',174),('iso7','ipad_mini4',175),('iso7','ipad_mini5',176),('iso7','ipad_pro97',177),('iso7','iphone6',178),('iso7','iphone_se',179),('iso7','ipod_touch',180),('iso8','38_watch',181),('iso8','42_watch',182),('iso8','imac',183),('iso8','ipad_air2',184),('iso8','ipad_mini2',185),('iso8','ipad_mini3',186),('iso8','ipad_mini4',187),('iso8','ipad_mini5',188),('iso8','ipad_pro97',189),('iso8','iphone6',190),('iso8','iphone_se',191),('iso8','ipod_touch',192),('iso9','38_watch',193),('iso9','42_watch',194),('iso9','imac',195),('iso9','ipad_air2',196),('iso9','ipad_mini2',197),('iso9','ipad_mini3',198),('iso9','ipad_mini4',199),('iso9','ipad_mini5',200),('iso9','ipad_pro97',201),('iso9','iphone6',202),('iso9','iphone_se',203),('iso9','ipod_touch',204),('Jaguar','38_watch',205),('Jaguar','42_watch',206),('Jaguar','imac',207),('Jaguar','ipad_air2',208),('Jaguar','ipad_mini2',209),('Jaguar','ipad_mini3',210),('Jaguar','ipad_mini4',211),('Jaguar','ipad_mini5',212),('Jaguar','ipad_pro97',213),('Jaguar','iphone6',214),('Jaguar','iphone_se',215),('Jaguar','ipod_touch',216),('Kodiak','38_watch',217),('Kodiak','42_watch',218),('Kodiak','imac',219),('Kodiak','ipad_air2',220),('Kodiak','ipad_mini2',221),('Kodiak','ipad_mini3',222),('Kodiak','ipad_mini4',223),('Kodiak','ipad_mini5',224),('Kodiak','ipad_pro97',225),('Kodiak','iphone6',226),('Kodiak','iphone_se',227),('Kodiak','ipod_touch',228),('lion','38_watch',229),('lion','42_watch',230),('lion','imac',231),('lion','ipad_air2',232),('lion','ipad_mini2',233),('lion','ipad_mini3',234),('lion','ipad_mini4',235),('lion','ipad_mini5',236),('lion','ipad_pro97',237),('lion','iphone6',238),('lion','iphone_se',239),('lion','ipod_touch',240),('mac8','38_watch',241),('mac8','42_watch',242),('mac8','imac',243),('mac8','ipad_air2',244),('mac8','ipad_mini2',245),('mac8','ipad_mini3',246),('mac8','ipad_mini4',247),('mac8','ipad_mini5',248),('mac8','ipad_pro97',249),('mac8','iphone6',250),('mac8','iphone_se',251),('mac8','ipod_touch',252),('mac9','38_watch',253),('mac9','42_watch',254),('mac9','imac',255),('mac9','ipad_air2',256),('mac9','ipad_mini2',257),('mac9','ipad_mini3',258),('mac9','ipad_mini4',259),('mac9','ipad_mini5',260),('mac9','ipad_pro97',261),('mac9','iphone6',262),('mac9','iphone_se',263),('mac9','ipod_touch',264),('mavericks','38_watch',265),('mavericks','42_watch',266),('mavericks','imac',267),('mavericks','ipad_air2',268),('mavericks','ipad_mini2',269),('mavericks','ipad_mini3',270),('mavericks','ipad_mini4',271),('mavericks','ipad_mini5',272),('mavericks','ipad_pro97',273),('mavericks','iphone6',274),('mavericks','iphone_se',275),('mavericks','ipod_touch',276),('mojave','38_watch',277),('mojave','42_watch',278),('mojave','imac',279),('mojave','ipad_air2',280),('mojave','ipad_mini2',281),('mojave','ipad_mini3',282),('mojave','ipad_mini4',283),('mojave','ipad_mini5',284),('mojave','ipad_pro97',285),('mojave','iphone6',286),('mojave','iphone_se',287),('mojave','ipod_touch',288),('mountain','38_watch',289),('mountain','42_watch',290),('mountain','imac',291),('mountain','ipad_air2',292),('mountain','ipad_mini2',293),('mountain','ipad_mini3',294),('mountain','ipad_mini4',295),('mountain','ipad_mini5',296),('mountain','ipad_pro97',297),('mountain','iphone6',298),('mountain','iphone_se',299),('mountain','ipod_touch',300),('panther','38_watch',301),('panther','42_watch',302),('panther','imac',303),('panther','ipad_air2',304),('panther','ipad_mini2',305),('panther','ipad_mini3',306),('panther','ipad_mini4',307),('panther','ipad_mini5',308),('panther','ipad_pro97',309),('panther','iphone6',310),('panther','iphone_se',311),('panther','ipod_touch',312),('Puma','38_watch',313),('Puma','42_watch',314),('Puma','imac',315),('Puma','ipad_air2',316),('Puma','ipad_mini2',317),('Puma','ipad_mini3',318),('Puma','ipad_mini4',319),('Puma','ipad_mini5',320),('Puma','ipad_pro97',321),('Puma','iphone6',322),('Puma','iphone_se',323),('Puma','ipod_touch',324),('sierra','38_watch',325),('sierra','42_watch',326),('sierra','imac',327),('sierra','ipad_air2',328),('sierra','ipad_mini2',329),('sierra','ipad_mini3',330),('sierra','ipad_mini4',331),('sierra','ipad_mini5',332),('sierra','ipad_pro97',333),('sierra','iphone6',334),('sierra','iphone_se',335),('sierra','ipod_touch',336),('sys2','38_watch',337),('sys2','42_watch',338),('sys2','imac',339),('sys2','ipad_air2',340),('sys2','ipad_mini2',341),('sys2','ipad_mini3',342),('sys2','ipad_mini4',343),('sys2','ipad_mini5',344),('sys2','ipad_pro97',345),('sys2','iphone6',346),('sys2','iphone_se',347),('sys2','ipod_touch',348),('sys3','38_watch',349),('sys3','42_watch',350),('sys3','imac',351),('sys3','ipad_air2',352),('sys3','ipad_mini2',353),('sys3','ipad_mini3',354),('sys3','ipad_mini4',355),('sys3','ipad_mini5',356),('sys3','ipad_pro97',357),('sys3','iphone6',358),('sys3','iphone_se',359),('sys3','ipod_touch',360),('sys4','38_watch',361),('sys4','42_watch',362),('sys4','imac',363),('sys4','ipad_air2',364),('sys4','ipad_mini2',365),('sys4','ipad_mini3',366),('sys4','ipad_mini4',367),('sys4','ipad_mini5',368),('sys4','ipad_pro97',369),('sys4','iphone6',370),('sys4','iphone_se',371),('sys4','ipod_touch',372),('sys5','38_watch',373),('sys5','42_watch',374),('sys5','imac',375),('sys5','ipad_air2',376),('sys5','ipad_mini2',377),('sys5','ipad_mini3',378),('sys5','ipad_mini4',379),('sys5','ipad_mini5',380),('sys5','ipad_pro97',381),('sys5','iphone6',382),('sys5','iphone_se',383),('sys5','ipod_touch',384),('sys6','38_watch',385),('sys6','42_watch',386),('sys6','imac',387),('sys6','ipad_air2',388),('sys6','ipad_mini2',389),('sys6','ipad_mini3',390),('sys6','ipad_mini4',391),('sys6','ipad_mini5',392),('sys6','ipad_pro97',393),('sys6','iphone6',394),('sys6','iphone_se',395),('sys6','ipod_touch',396),('sys7','38_watch',397),('sys7','42_watch',398),('sys7','imac',399),('sys7','ipad_air2',400),('sys7','ipad_mini2',401),('sys7','ipad_mini3',402),('sys7','ipad_mini4',403),('sys7','ipad_mini5',404),('sys7','ipad_pro97',405),('sys7','iphone6',406),('sys7','iphone_se',407),('sys7','ipod_touch',408),('w1','38_watch',409),('w1','42_watch',410),('w2','38_watch',421),('w2','42_watch',422),('w3','38_watch',433),('w3','42_watch',434),('w4','38_watch',445),('w4','42_watch',446),('w5','38_watch',457),('w5','42_watch',458),('w6','38_watch',469),('w6','42_watch',470),('yosemite','imac',483);
/*!40000 ALTER TABLE `os_dev_comp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-20 23:01:02
