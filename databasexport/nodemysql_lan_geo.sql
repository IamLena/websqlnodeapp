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
-- Table structure for table `lan_geo`
--

DROP TABLE IF EXISTS `lan_geo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lan_geo` (
  `lan_geo` varchar(6) NOT NULL,
  `language` varchar(20) NOT NULL,
  `country` varchar(45) NOT NULL,
  PRIMARY KEY (`lan_geo`),
  UNIQUE KEY `lan_geo_UNIQUE` (`lan_geo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='langeo id (as en_us) : language, country';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lan_geo`
--

LOCK TABLES `lan_geo` WRITE;
/*!40000 ALTER TABLE `lan_geo` DISABLE KEYS */;
INSERT INTO `lan_geo` VALUES ('ar-AE','Arabic','U.A.E.'),('ar-BH','Arabic','Bahrain'),('ar-DZ','Arabic','Algeria'),('ar-EG','Arabic','Egypt'),('ar-IQ','Arabic','Iraq'),('ar-JO','Arabic','Jordan'),('ar-KW','Arabic','Kuwait'),('ar-LB','Arabic','Lebanon'),('ar-LY','Arabic','Libya'),('ar-MA','Arabic','Morocco'),('ar-OM','Arabic','Oman'),('ar-QA','Arabic','Qatar'),('ar-SA','Arabic','Saudi Arabia'),('ar-SY','Arabic','Syria'),('ar-TN','Arabic','Tunisia'),('ar-YE','Arabic','Yemen'),('az-AZ','Azeri','Azerbaijan'),('be-BY','Belarusian','Belarus'),('bg-BG','Bulgarian','Bulgaria'),('bs-BA','Bosnian','Bosnia and Herzegovina'),('ca-ES','Catalan','Spain'),('cs-CZ','Czech','Czech Republic'),('cy-GB','Welsh','United Kingdom'),('da-DK','Danish','Denmark'),('de-AT','German','Austria'),('de-CH','German','Switzerland'),('de-DE','German','Germany'),('de-LI','German','Liechtenstein'),('de-LU','German','Luxembourg'),('dv-MV','Divehi','Maldives'),('el-GR','Greek','Greece'),('en-AU','English','Australia'),('en-BZ','English','Belize'),('en-CA','English','Canada'),('en-CB','English','Caribbean'),('en-GB','English','United Kingdom'),('en-IE','English','Ireland'),('en-JM','English','Jamaica'),('en-NZ','English','New Zealand'),('en-PH','English','Republic of the Philippines'),('en-TT','English','Trinidad and Tobago'),('en-US','English','United States'),('en-ZA','English','South Africa'),('en-ZW','English','Zimbabwe'),('es-AR','Spanish','Argentina'),('es-BO','Spanish','Bolivia'),('es-CL','Spanish','Chile'),('es-CO','Spanish','Colombia'),('es-CR','Spanish','Costa Rica'),('es-DO','Spanish','Dominican Republic'),('es-EC','Spanish','Ecuador'),('es-ES','Spanish','Spain'),('es-GT','Spanish','Guatemala'),('es-HN','Spanish','Honduras'),('es-MX','Spanish','Mexico'),('es-NI','Spanish','Nicaragua'),('es-PA','Spanish','Panama'),('es-PE','Spanish','Peru'),('es-PR','Spanish','Puerto Rico'),('es-PY','Spanish','Paraguay'),('es-SV','Spanish','El Salvador'),('es-UY','Spanish','Uruguay'),('es-VE','Spanish','Venezuela'),('et-EE','Estonian','Estonia'),('eu-ES','Basque','Spain'),('fa-IR','Farsi','Iran'),('fi-FI','Finnish','Finland'),('fo-FO','Faroese','Faroe Islands'),('fr-BE','French','Belgium'),('fr-CA','French','Canada'),('fr-CH','French','Switzerland'),('fr-FR','French','France'),('fr-LU','French','Luxembourg'),('fr-MC','French','Principality of Monaco'),('gl-ES','Galician','Spain'),('gu-IN','Gujarati','India'),('he-IL','Hebrew','Israel'),('hi-IN','Hindi','India'),('hr-BA','Croatian','Bosnia and Herzegovina'),('hr-HR','Croatian','Croatia'),('hu-HU','Hungarian','Hungary'),('hy-AM','Armenian','Armenia'),('id-ID','Indonesian','Indonesia'),('is-IS','Icelandic','Iceland'),('it-CH','Italian','Switzerland'),('it-IT','Italian','Italy'),('ja-JP','Japanese','Japan'),('ka-GE','Georgian','Georgia'),('kk-KZ','Kazakh','Kazakhstan'),('kn-IN','Kannada','India'),('ko-KR','Korean','Korea'),('kok-IN','Konkani','India'),('ky-KG','Kyrgyz','Kyrgyzstan'),('lt-LT','Lithuanian','Lithuania'),('lv-LV','Latvian','Latvia'),('mi-NZ','Maori','New Zealand'),('mk-MK','FYRO Macedonian','Former Yugoslav Republic of Macedonia'),('mn-MN','Mongolian','Mongolia'),('mr-IN','Marathi','India'),('ms-BN','Malay','Brunei Darussalam'),('ms-MY','Malay','Malaysia'),('mt-MT','Maltese','Malta'),('nl-BE','Dutch','Belgium'),('nl-NL','Dutch','Netherlands'),('nn-NO','Norwegian','Norway'),('ns-ZA','Northern Sotho','South Africa'),('pa-IN','Punjabi','India'),('pl-PL','Polish','Poland'),('ps-AR','Pashto','Afghanistan'),('pt-BR','Portuguese','Brazil'),('pt-PT','Portuguese','Portugal'),('qu-BO','Quechua','Bolivia'),('qu-EC','Quechua','Ecuador'),('qu-PE','Quechua','Peru'),('ro-RO','Romanian','Romania'),('ru-RU','Russian','Russia'),('sa-IN','Sanskrit','India'),('se-FI','Sami','Finland'),('se-NO','Sami','Norway'),('se-SE','Sami','Sweden'),('sk-SK','Slovak','Slovakia'),('sl-SI','Slovenian','Slovenia'),('sq-AL','Albanian','Albania'),('sr-BA','Serbian','Bosnia and Herzegovina'),('sr-SP','Serbian','Serbia and Montenegro'),('sv-FI','Swedish','Finland'),('sv-SE','Swedish','Sweden'),('sw-KE','Swahili','Kenya'),('syr-SY','Syriac','Syria'),('ta-IN','Tamil','India'),('te-IN','Telugu','India'),('th-TH','Thai','Thailand'),('tl-PH','Tagalog','Philippines'),('tn-ZA','Tswana','South Africa'),('tr-TR','Turkish','Turkey'),('tt-RU','Tatar','Russia'),('uk-UA','Ukrainian','Ukraine'),('ur-PK','Urdu','Islamic Republic of Pakistan'),('uz-UZ','Uzbek','Uzbekistan'),('vi-VN','Vietnamese','Viet Nam'),('xh-ZA','Xhosa','South Africa'),('zh-CN','Chinese','S'),('zh-HK','Chinese','Hong Kong'),('zh-MO','Chinese','Macau'),('zh-SG','Chinese','Singapore'),('zh-TW','Chinese','T'),('zu-ZA','Zulu','South Africa');
/*!40000 ALTER TABLE `lan_geo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-23 16:33:00
