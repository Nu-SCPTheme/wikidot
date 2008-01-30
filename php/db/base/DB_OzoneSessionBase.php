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
 * Base class mapped to the database table ozone_session.
 */
class DB_OzoneSessionBase extends BaseDBObject {

	protected function internalInit(){
		$this->tableName='ozone_session';
		$this->peerName = 'DB_OzoneSessionPeer';
		$this->primaryKeyName = 'session_id';
		$this->fieldNames = array( 'session_id' ,  'started' ,  'last_accessed' ,  'ip_address' ,  'check_ip' ,  'infinite' ,  'user_id' ,  'serialized_datablock' );
		
		//$this->fieldDefaultValues=
	}


	
			public function getOzoneUser(){
			if(is_array($this->prefetched)){
			if(in_array('ozone_user', $this->prefetched)){
				if(in_array('ozone_user', $this->prefetchedObjects)){
					return $this->prefetchedObjects['ozone_user'];
				} else {
					
					$obj = new DB_OzoneUser($this->sourceRow);
					$obj->setNew(false);
					//$obj->prefetched = $this->prefetched;
					//$obj->sourceRow = $this->sourceRow;
					$this->prefetchedObjects['ozone_user'] = $obj;
					return $obj;
				}
			}
		}
		$foreignPeerClassName = 'DB_OzoneUserPeer';	
		$fpeer = new $foreignPeerClassName();
		
		$criteria = new Criteria();
		
		$criteria->add("user_id", $this->fieldValues['user_id']);
		
		$result = $fpeer->selectOneByCriteria($criteria);
		return $result;
	}
	
		public function setOzoneUser($primaryObject){
			$this->fieldValues['user_id'] = $primaryObject->getFieldValue('user_id');
	}
		
	
		
	public function getSessionId() {
		return $this->getFieldValue('session_id');
	}
	
	public function setSessionId($v1, $raw=false) {
		$this->setFieldValue('session_id', $v1, $raw); 
	}
	
		
	public function getStarted() {
		return $this->getFieldValue('started');
	}
	
	public function setStarted($v1, $raw=false) {
		$this->setFieldValue('started', $v1, $raw); 
	}
	
		
	public function getLastAccessed() {
		return $this->getFieldValue('last_accessed');
	}
	
	public function setLastAccessed($v1, $raw=false) {
		$this->setFieldValue('last_accessed', $v1, $raw); 
	}
	
		
	public function getIpAddress() {
		return $this->getFieldValue('ip_address');
	}
	
	public function setIpAddress($v1, $raw=false) {
		$this->setFieldValue('ip_address', $v1, $raw); 
	}
	
		
	public function getCheckIp() {
		return $this->getFieldValue('check_ip');
	}
	
	public function setCheckIp($v1, $raw=false) {
		$this->setFieldValue('check_ip', $v1, $raw); 
	}
	
		
	public function getInfinite() {
		return $this->getFieldValue('infinite');
	}
	
	public function setInfinite($v1, $raw=false) {
		$this->setFieldValue('infinite', $v1, $raw); 
	}
	
		
	public function getUserId() {
		return $this->getFieldValue('user_id');
	}
	
	public function setUserId($v1, $raw=false) {
		$this->setFieldValue('user_id', $v1, $raw); 
	}
	
		
	public function getSerializedDatablock() {
		return $this->getFieldValue('serialized_datablock');
	}
	
	public function setSerializedDatablock($v1, $raw=false) {
		$this->setFieldValue('serialized_datablock', $v1, $raw); 
	}
	
		
	

}
