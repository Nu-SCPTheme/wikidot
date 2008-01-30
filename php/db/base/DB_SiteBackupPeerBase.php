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
 * @package Wikidot_Db_Base
 * @version $Id$
 * @copyright Copyright (c) 2008, Wikidot Inc.
 * @license http://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License
 */
 
/**
 * Base peer class mapped to the database table site_backup.
 */
class DB_SiteBackupPeerBase extends BaseDBPeer {
	public static $peerInstance;
	
	protected function internalInit(){
		$this->tableName='site_backup';
		$this->objectName='DB_SiteBackup';
		$this->primaryKeyName = 'backup_id';
		$this->fieldNames = array( 'backup_id' ,  'site_id' ,  'status' ,  'backup_source' ,  'backup_files' ,  'date' ,  'rand' );
		$this->fieldTypes = array( 'backup_id' => 'serial',  'site_id' => 'int',  'status' => 'varchar(50)',  'backup_source' => 'boolean',  'backup_files' => 'boolean',  'date' => 'timestamp',  'rand' => 'varchar(100)');
		$this->defaultValues = array( 'backup_source' => 'true',  'backup_files' => 'true');
	}
	
	public static function instance(){
		if(self::$peerInstance == null){
			$className = "DB_SiteBackupPeer";
			self::$peerInstance = new $className();
		}
		return self::$peerInstance;
	}

}