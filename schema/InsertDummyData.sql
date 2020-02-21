-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.1.40-MariaDB - Source distribution
-- Server Betriebssystem:        Linux
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Daten aus Tabelle tagflip.annotation: ~20 rows (ungefähr)
/*!40000 ALTER TABLE `annotation` DISABLE KEYS */;
INSERT INTO `annotation` (`a_id`, `s_id`, `name`, `color`) VALUES
	(1, 1, 'Subjekt', '#9eb6ff'),
	(2, 1, 'Prädikat', '#00B75B'),
	(3, 1, 'Objekt', '#F05053'),
	(4, 2, 'Hardskill', '#F05053'),
	(5, 2, 'Benefit', '#A3B7A3'),
	(6, 2, 'Level', '#FFBFF6'),
	(7, 2, 'Necessity', '#7BA6D8'),
	(8, 2, 'JobTitle', '#ec52ff'),
	(9, 2, 'Location', '#BC8237'),
	(10, 2, 'CompanyName', '#3860ce'),
	(11, 3, 'Deutsch', '#f05053'),
	(12, 3, 'Englisch', '#7a90e0'),
	(13, 3, 'Spanisch', '#FEFF89'),
	(14, 3, 'Russisch', '#9eb6ff'),
	(15, 3, 'Chinesisch', '#00e572'),
	(16, 3, 'Japanisch', '#FA8072'),
	(17, 3, 'Niederländisch', '#5AC18E'),
	(18, 3, 'Französisch', '#007F7F'),
	(19, 3, 'Polnisch', '#800000'),
	(20, 3, 'Schwedisch', '#FFF68F');
/*!40000 ALTER TABLE `annotation` ENABLE KEYS */;

-- Exportiere Daten aus Tabelle tagflip.annotationset: ~4 rows (ungefähr)
/*!40000 ALTER TABLE `annotationset` DISABLE KEYS */;
INSERT INTO `annotationset` (`s_id`, `name`, `description`) VALUES
	(1, 'Grammatik', 'Enthält Annotationen zur Bestimmung grammatikalischer Bausteine von deutschen Texten.'),
	(2, 'Job-Annotationen', 'Dieses Set enthält alle grundlegenden Annotationen, welche zur Beschreibung einer Stellenanzeige benötigt werden.'),
	(3, 'Sprachen', 'Ein Set welches dazu dient, unterschiedliche Sprachen innerhalb eines Textes zu unterscheiden. So können beispielsweise Chat-Verläufe, in welchen mehrere Fremdsprachen verwendet werden, auf die Sprache analysiert werden.'),
	(4, 'Leeres Set', 'Ein Set ohne Annotationen, für Test-Zwecke.');
/*!40000 ALTER TABLE `annotationset` ENABLE KEYS */;

-- Exportiere Daten aus Tabelle tagflip.corpus: ~4 rows (ungefähr)
/*!40000 ALTER TABLE `corpus` DISABLE KEYS */;
INSERT INTO `corpus` (`c_id`, `name`, `description`) VALUES
	(1, 'Stellenanzeigen (IT)', 'In diesem Textkorpus ist eine Menge von IT-Stellenbeschreibungen enthalten.'),
	(2, 'Romane', 'Der Inhalt dieses Korpus ist eine Sammlung verschiedenster Romane.'),
	(3, 'Lorem Ipsum Sammlung', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'),
	(4, 'Newsatrikel', NULL);
/*!40000 ALTER TABLE `corpus` ENABLE KEYS */;

-- Exportiere Daten aus Tabelle tagflip.corpus_annotationset: ~4 rows (ungefähr)
/*!40000 ALTER TABLE `corpus_annotationset` DISABLE KEYS */;
INSERT INTO `corpus_annotationset` (`s_id`, `c_id`) VALUES
	(1, 2),
	(1, 4),
	(2, 1),
	(3, 4);
/*!40000 ALTER TABLE `corpus_annotationset` ENABLE KEYS */;

-- Exportiere Daten aus Tabelle tagflip.document: ~6 rows (ungefähr)
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
INSERT INTO `document` (`d_id`, `c_id`, `filename`, `document_hash`, `last_edited`) VALUES
	(1, 1, '/home/jakuk001/Nextcloud/TagFlip/Documents/1/4474635_stripped.txt', 'dd4650d75ea67d687230afedd076f779f803b8cf635b68e98ae457eb36ea3069', '2020-02-06 14:22:28'),
	(2, 1, '/home/jakuk001/Nextcloud/TagFlip/Documents/1/4486492_stripped.txt', 'f03d8fa6dc737c3430e77e61b8655e636d51a958b49ab902323a1760e997ea84', '2020-02-06 11:32:46'),
	(3, 1, '/home/jakuk001/Nextcloud/TagFlip/Documents/1/4744446_stripped.txt', '797d2ab6af8f2563c8556f272324eb65ed640174c6407b79a8bffcf739db5ca9', NULL),
	(4, 2, '/home/jakuk001/Nextcloud/TagFlip/Documents/2/HarryPotter.txt', '34a53115581d1361b6dcdb2bef5b035ff1ffe0468c1e574e2f237787fe83b3d8', '2020-02-05 14:22:34'),
	(5, 4, '/home/jakuk001/Nextcloud/TagFlip/Documents/4/GoogleGlass.txt', 'e07623440b60f6c3ef449e9670f72ba6dead8e9ede5c0f491e1b61f21b1df951', NULL),
	(6, 4, '/home/jakuk001/Nextcloud/TagFlip/Documents/4/WhatsApp.txt', '0d0bda2fadb82338a1191d79640e3b2dd0e080aa9c814afdecdfa31f0ac325c3', NULL);
/*!40000 ALTER TABLE `document` ENABLE KEYS */;

-- Exportiere Daten aus Tabelle tagflip.tag: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
