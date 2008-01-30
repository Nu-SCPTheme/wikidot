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
 * Base peer class mapped to the database table moderator.
 */
class DB_ModeratorPeerBase extends BaseDBPeer {
	public static $peerInstance;
	
	protected function internalInit(){
		$this->tableName='moderator';
		$this->objectName='DB_Moderator';
		$this->primaryKeyName = 'moderator_id';
		$this->fieldNames = array( 'moderator_id' ,  'site_id' ,  'user_id' ,  'permissions' );
		$this->fieldTypes = array( 'moderator_id' => 'serial',  'site_id' => 'int',  'user_id' => 'int',  'permissions' => 'char(10)');
		$this->defaultValues = array();
	}
	
	public static function instance(){
		if(self::$peerInstance == null){
			$className = "DB_ModeratorPeer";
			self::$peerInstance = new $className();
		}
		return self::$peerInstance;
	}

}