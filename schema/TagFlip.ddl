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
  `annotationset_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`annotationset_id`),
  UNIQUE INDEX `name` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`annotation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`annotation` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`annotation` (
  `annotation_id` INT(11) NOT NULL AUTO_INCREMENT,
  `annotationset_id` INT(11) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `color` CHAR(7) NOT NULL DEFAULT '#bbbbbb',
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`annotation_id`),
  UNIQUE INDEX `UK_AnnotationSet_AnnotationName` (`annotationset_id` ASC, `name` ASC),
  INDEX `FKannotation324602` (`annotationset_id` ASC),
  CONSTRAINT `FKannotation324602`
    FOREIGN KEY (`annotationset_id`)
    REFERENCES `tagflip`.`annotationset` (`annotationset_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`corpus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`corpus` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`corpus` (
  `corpus_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`corpus_id`),
  UNIQUE INDEX `name` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`corpus_to_annotationset`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`corpus_to_annotationset` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`corpus_to_annotationset` (
  `corpus_id` INT(11) NOT NULL,
  `annotationset_id` INT(11) NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`corpus_id`, `annotationset_id`),
  INDEX `FKcorpus_ann848816` (`annotationset_id` ASC),
  INDEX `FKcorpus_ann874314` (`corpus_id` ASC),
  CONSTRAINT `FKcorpus_ann848816`
    FOREIGN KEY (`annotationset_id`)
    REFERENCES `tagflip`.`annotationset` (`annotationset_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FKcorpus_ann874314`
    FOREIGN KEY (`corpus_id`)
    REFERENCES `tagflip`.`corpus` (`corpus_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`document`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`document` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`document` (
  `document_id` INT(11) NOT NULL AUTO_INCREMENT,
  `corpus_id` INT(11) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `document_hash` CHAR(64) NOT NULL COMMENT 'SHA-256',
  `content` LONGTEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`document_id`),
  UNIQUE INDEX `UK_Document_CorpusHash` (`corpus_id` ASC, `document_hash` ASC),
  INDEX `FKdocument854677` (`corpus_id` ASC),
  CONSTRAINT `FKdocument854677`
    FOREIGN KEY (`corpus_id`)
    REFERENCES `tagflip`.`corpus` (`corpus_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tagflip`.`tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tagflip`.`tag` ;

CREATE TABLE IF NOT EXISTS `tagflip`.`tag` (
  `tag_id` INT(11) NOT NULL AUTO_INCREMENT,
  `annotation_id` INT(11) NOT NULL,
  `document_id` INT(11) NOT NULL,
  `start_index` INT(11) NOT NULL,
  `end_index` INT(11) NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`tag_id`),
  INDEX `FKtag983812` (`document_id` ASC),
  INDEX `FKtag961745` (`annotation_id` ASC),
  CONSTRAINT `FKtag961745`
    FOREIGN KEY (`annotation_id`)
    REFERENCES `tagflip`.`annotation` (`annotation_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FKtag983812`
    FOREIGN KEY (`document_id`)
    REFERENCES `tagflip`.`document` (`document_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
