-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema tagflip
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `tagflip` ;

-- -----------------------------------------------------
-- Schema tagflip
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tagflip` DEFAULT CHARACTER SET utf8 ;
USE `tagflip` ;

-- -----------------------------------------------------
-- Table `tagflip`.`annotationset`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`annotationset` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`annotationset` (
  `annotationSetId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`annotationSetId`),
  UNIQUE INDEX `name` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`annotation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`annotation` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`annotation` (
  `annotationId` INT(11) NOT NULL AUTO_INCREMENT,
  `annotationSetId` INT(11) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `color` CHAR(7) NOT NULL DEFAULT '#bbbbbb',
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`annotationId`),
  UNIQUE INDEX `UK_AnnotationSet_AnnotationName` (`annotationSetId` ASC, `name` ASC),
  INDEX `FKannotation324602` (`annotationSetId` ASC),
  CONSTRAINT `FKannotation324602`
    FOREIGN KEY (`annotationSetId`)
    REFERENCES `tagflip`.`annotationset` (`annotationSetId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`corpus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`corpus` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`corpus` (
  `corpusId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`corpusId`),
  UNIQUE INDEX `name` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`corpus_to_annotationset`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`corpus_to_annotationset` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`corpus_to_annotationset` (
  `corpusId` INT(11) NOT NULL,
  `annotationSetId` INT(11) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`corpusId`, `annotationSetId`),
  INDEX `FKcorpus_ann848816` (`annotationSetId` ASC),
  INDEX `FKcorpus_ann874314` (`corpusId` ASC),
  CONSTRAINT `FKcorpus_ann848816`
    FOREIGN KEY (`annotationSetId`)
    REFERENCES `tagflip`.`annotationset` (`annotationSetId`)
    ON DELETE CASCADE,
  CONSTRAINT `FKcorpus_ann874314`
    FOREIGN KEY (`corpusId`)
    REFERENCES `tagflip`.`corpus` (`corpusId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`document`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`document` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`document` (
  `documentId` INT(11) NOT NULL AUTO_INCREMENT,
  `corpusId` INT(11) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `documentHash` CHAR(64) NOT NULL COMMENT 'SHA-256',
  `content` LONGTEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`documentId`),
  UNIQUE INDEX `UK_Document_CorpusHash` (`corpusId` ASC, `documentHash` ASC),
  INDEX `FKdocument854677` (`corpusId` ASC),
  CONSTRAINT `FKdocument854677`
    FOREIGN KEY (`corpusId`)
    REFERENCES `tagflip`.`corpus` (`corpusId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`tag` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`tag` (
  `tagId` INT(11) NOT NULL AUTO_INCREMENT,
  `annotationId` INT(11) NOT NULL,
  `documentId` INT(11) NOT NULL,
  `startIndex` INT(11) NOT NULL,
  `endIndex` INT(11) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`tagId`),
  INDEX `FKtag983812` (`documentId` ASC),
  INDEX `FKtag961745` (`annotationId` ASC),
  CONSTRAINT `FKtag961745`
    FOREIGN KEY (`annotationId`)
    REFERENCES `tagflip`.`annotation` (`annotationId`)
    ON DELETE CASCADE,
  CONSTRAINT `FKtag983812`
    FOREIGN KEY (`documentId`)
    REFERENCES `tagflip`.`document` (`documentId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
