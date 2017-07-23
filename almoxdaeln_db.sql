-- MySQL dump 10.13  Distrib 5.7.18, for Linux (x86_64)
--
-- Host: localhost    Database: almoxdaeln_db
-- ------------------------------------------------------
-- Server version	5.7.18-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `EquipamentosMonitorados`
--

DROP TABLE IF EXISTS `EquipamentosMonitorados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EquipamentosMonitorados` (
  `patrimonio` bigint(20) NOT NULL,
  `Estados_id_estado` int(8) NOT NULL,
  `Tipos_id_tipo` int(32) NOT NULL,
  PRIMARY KEY (`patrimonio`),
  UNIQUE KEY `patrimonio_UNIQUE` (`patrimonio`),
  KEY `fk_EquipamentosMonitorados_Tipos1_idx` (`Tipos_id_tipo`),
  KEY `fk_EquipamentosMonitorados_Estados1_idx` (`Estados_id_estado`),
  CONSTRAINT `fk_EquipamentosMonitorados_Estados1` FOREIGN KEY (`Estados_id_estado`) REFERENCES `Estados` (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_EquipamentosMonitorados_Tipos1` FOREIGN KEY (`Tipos_id_tipo`) REFERENCES `Tipos` (`id_tipo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EquipamentosMonitorados`
--

LOCK TABLES `EquipamentosMonitorados` WRITE;
/*!40000 ALTER TABLE `EquipamentosMonitorados` DISABLE KEYS */;
/*!40000 ALTER TABLE `EquipamentosMonitorados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EquipamentosRequisicao`
--

DROP TABLE IF EXISTS `EquipamentosRequisicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EquipamentosRequisicao` (
  `id_EquipamentoRequisicao` int(32) NOT NULL AUTO_INCREMENT,
  `quantidade` int(8) NOT NULL,
  `Tipos_Id_tipo` int(32) NOT NULL,
  `Requisicoes_id_requisicao` int(32) NOT NULL,
  PRIMARY KEY (`id_EquipamentoRequisicao`),
  UNIQUE KEY `id_EquipamentoRequisicao_UNIQUE` (`id_EquipamentoRequisicao`),
  KEY `fk_EquipamentosRequisicao_Requisicoes1_idx` (`Requisicoes_id_requisicao`),
  KEY `fk_EquipamentosRequisicao_Tipos1_idx` (`Tipos_Id_tipo`),
  CONSTRAINT `fk_EquipamentosRequisicao_Requisicoes1` FOREIGN KEY (`Requisicoes_id_requisicao`) REFERENCES `Requisicoes` (`id_requisicao`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_EquipamentosRequisicao_Tipos1` FOREIGN KEY (`Tipos_Id_tipo`) REFERENCES `Tipos` (`id_tipo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EquipamentosRequisicao`
--

LOCK TABLES `EquipamentosRequisicao` WRITE;
/*!40000 ALTER TABLE `EquipamentosRequisicao` DISABLE KEYS */;
/*!40000 ALTER TABLE `EquipamentosRequisicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados`
--

DROP TABLE IF EXISTS `Estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Estados` (
  `id_estado` int(8) NOT NULL AUTO_INCREMENT,
  `estado` varchar(30) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `id_estado_UNIQUE` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados`
--

LOCK TABLES `Estados` WRITE;
/*!40000 ALTER TABLE `Estados` DISABLE KEYS */;
INSERT INTO `Estados` VALUES (1,'Emprestado'),(2,'Em Manutenção'),(3,'Reservado'),(4,'Disponível'),(5,'Fora de Serviço');
/*!40000 ALTER TABLE `Estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadosReq`
--

DROP TABLE IF EXISTS `EstadosReq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EstadosReq` (
  `id_estadosReq` int(8) NOT NULL AUTO_INCREMENT,
  `estadoReq` varchar(30) NOT NULL,
  PRIMARY KEY (`id_estadosReq`),
  UNIQUE KEY `id_estados_Req_UNIQUE` (`id_estadosReq`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadosReq`
--

LOCK TABLES `EstadosReq` WRITE;
/*!40000 ALTER TABLE `EstadosReq` DISABLE KEYS */;
INSERT INTO `EstadosReq` VALUES (1,'Em Uso'),(2,'Devolvido'),(3,'Reservado');
/*!40000 ALTER TABLE `EstadosReq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Familias`
--

DROP TABLE IF EXISTS `Familias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Familias` (
  `id_familia` int(32) NOT NULL AUTO_INCREMENT,
  `familia` varchar(50) NOT NULL,
  PRIMARY KEY (`id_familia`),
  UNIQUE KEY `id_familia_UNIQUE` (`id_familia`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Familias`
--

LOCK TABLES `Familias` WRITE;
/*!40000 ALTER TABLE `Familias` DISABLE KEYS */;
INSERT INTO `Familias` VALUES (1,'Mesa Digital'),(2,'Gerador'),(3,'Frequencímetro'),(4,'Multímetro'),(5,'Voltímetro'),(6,'Testador'),(7,'Fonte'),(8,'Década'),(9,'Microcomputador Didático'),(10,'Matriz de montagem'),(11,'Conversor'),(12,'Kit'),(13,'Transformador'),(14,'Analisador'),(15,'Ponte'),(16,'Modem'),(17,'Softstart'),(18,'Tacômetro'),(19,'Luxímetro'),(20,'Retroprojetor'),(21,'Osciloscópio');
/*!40000 ALTER TABLE `Familias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HistoricoEquipamentos`
--

DROP TABLE IF EXISTS `HistoricoEquipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HistoricoEquipamentos` (
  `id_evento` int(32) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observacao` varchar(45) COLLATE latin1_general_cs DEFAULT NULL,
  `usuario` varchar(45) CHARACTER SET latin1 NOT NULL,
  `EquipamentosMonitorados_patrimonio` bigint(20) NOT NULL,
  `Estados_id_estado` int(8) NOT NULL,
  PRIMARY KEY (`id_evento`),
  UNIQUE KEY `id_evento_UNIQUE` (`id_evento`),
  KEY `fk_HistoricoEquipamentos_EquipamentosMonitorados1_idx` (`EquipamentosMonitorados_patrimonio`),
  KEY `fk_HistoricoEquipamentos_Estados1_idx` (`Estados_id_estado`),
  CONSTRAINT `fk_HistoricoEquipamentos_EquipamentosMonitorados1` FOREIGN KEY (`EquipamentosMonitorados_patrimonio`) REFERENCES `EquipamentosMonitorados` (`patrimonio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_HistoricoEquipamentos_Estados1` FOREIGN KEY (`Estados_id_estado`) REFERENCES `Estados` (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HistoricoEquipamentos`
--

LOCK TABLES `HistoricoEquipamentos` WRITE;
/*!40000 ALTER TABLE `HistoricoEquipamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `HistoricoEquipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Requisicoes`
--

DROP TABLE IF EXISTS `Requisicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Requisicoes` (
  `id_requisicao` int(32) NOT NULL AUTO_INCREMENT,
  `materia` varchar(45) DEFAULT NULL,
  `usuario` varchar(45) NOT NULL,
  `timestampDeUso` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EstadosReq_id_estadosReq` int(8) NOT NULL,
  PRIMARY KEY (`id_requisicao`),
  UNIQUE KEY `id_evento_UNIQUE` (`id_requisicao`),
  KEY `fk_Requisicoes_EstadosReq1_idx` (`EstadosReq_id_estadosReq`),
  CONSTRAINT `fk_Requisicoes_EstadosReq1` FOREIGN KEY (`EstadosReq_id_estadosReq`) REFERENCES `EstadosReq` (`id_estadosReq`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Requisicoes`
--

LOCK TABLES `Requisicoes` WRITE;
/*!40000 ALTER TABLE `Requisicoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Requisicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipos`
--

DROP TABLE IF EXISTS `Tipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tipos` (
  `id_tipo` int(32) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `Familias_id_familia` int(32) NOT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `id_tipo_UNIQUE` (`id_tipo`),
  KEY `fk_Tipos_Familias1_idx` (`Familias_id_familia`),
  CONSTRAINT `fk_Tipos_Familia1` FOREIGN KEY (`Familias_id_familia`) REFERENCES `Familias` (`id_familia`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipos`
--

LOCK TABLES `Tipos` WRITE;
/*!40000 ALTER TABLE `Tipos` DISABLE KEYS */;
INSERT INTO `Tipos` VALUES (1,'Digital Duplo Traço',21),(2,'Analógico 3 canais',21),(3,'Analógico 4 canais',21),(4,'de Montagem',1),(5,'de Função/Formas de Onda',2),(6,'de Audiofreqüência',2),(7,'de Radiofreqüência',2),(8,'Digital',3),(9,'Analógico',4),(10,'Digital',4),(11,'de Áudio',5),(12,'de Circuito Integrado',6),(13,'de Alimentação Regulada',7),(14,'Resistiva',8),(15,'Capacitiva',8),(16,'Z80',9),(17,'80C31',9),(18,'de Circuitos',10),(19,'de Freqüência',11),(20,'CA/CC',11),(21,'Didático Para Eletrônica Industrial',12),(22,'Para Experiências Eletricidade/Eletrônica Básica',12),(23,'Z8',12),(24,'CLPs S7 200',12),(25,'CLP S7 300',12),(26,'de Rede de CLP S7 300',12),(27,'Placa de Avaliação ARM',12),(28,'Microcontrolador MSP430F169',12),(29,'Motorola HC908Q',12),(30,'30+30V 110/220V',13),(31,'trifásico 220/30V',13),(32,'de Espectro',14),(33,'LC',15),(34,'RLC',15),(35,'Padrão',16),(36,'Padrão',17),(37,'Padrão',18),(38,'Padrão',19),(39,'Padrão',20),(40,'Analógico Duplo Traço',21);
/*!40000 ALTER TABLE `Tipos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-26 22:32:47
