<?php
/**
 * Wikidot - free wiki collaboration software
 * Copyright (c) 2008, Wikidot Inc.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * For more information about licensing visit:
 * http://www.wikidot.org/license
 * 
 * @category Wikidot
 * @package Wikidot_Web
 * @version $Id: lucene_search.php,v 1.1 2008/12/04 12:16:45 redbeard Exp $
 * @copyright Copyright (c) 2008, Wikidot Inc.
 * @license http://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License
 */

require_once ("../php/setup.php");

try {
	$index = new Zend_Search_Lucene(GlobalProperties::$SEARCH_LUCENE_INDEX);
	echo "You need to delete the index first!\n";
	echo "Index location: " . GlobalProperties::$SEARCH_LUCENE_INDEX . "\n";
	exit();
} catch (Zend_Search_Lucene_Exception $e) {
}

$lucene = new Wikidot_Search_Lucene();
$lucene->indexAllSitesVerbose();