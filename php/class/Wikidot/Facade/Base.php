<?php

abstract class Wikidot_Facade_Base {
	
	/**
	 * 
	 * @var DB_OzoneUser
	 */
	protected $performer = null;
	
	/**
	 * 
	 * @var DB_OzoneUser
	 */
	protected $user = null;
	
	/**
	 * 
	 * @var DB_Site
	 */
	public $site = null;
	
	/**
	 * 
	 * @var DB_Category
	 */
	protected $category = null;
	
	/**
	 * 
	 * @var DB_Page
	 */
	protected $page = null;
	
	/**
	 * 
	 * @var DB_Page
	 */
	protected $parent_page = null;
	
	/**
	 * 
	 * @var string
	 */
	protected $title = null;
	
	/**
	 * 
	 * @var string
	 */
	protected $source = null;
	
	/**
	 * 
	 * @var array
	 */
	protected $tags = null;
	
	/**
	 * construct Facade object
	 * 
	 * @param $performer DB_OzoneUser
	 */
	public function __construct($performer = null) {
		$this->performer = $performer;
	}
	
	/**
	 * Parse the arguments array and resolve objects from their names.
	 * 
	 * @param array $args the argument array
	 * @param array $requiredArgs the required argument array keys
	 * @return array the array of arguments filtered and resolved to native types
	 */
	protected function parseArgs($args, $requiredArgs = array()) {
		if (! is_array($args)) {
			throw new Wikidot_Facade_Exception_WrongArguments("Argument is not an array");
		}
		
		// simple types
		foreach ($args as $key => $value) {
			switch ($key) {
				case "performer":
					if ($this->performer) {
						//throw new Wikidot_Facade_Exception_WrongArguments("Array key performer is for internal use only");
					} else {
						$this->performer = $this->_parseUser($value);
					}
					break;
				case "user":
					$this->user = $this->_parseUser($value);
					break;
				case "site":
					$this->site = $this->_parseSite($value);
					break;
				case "category":
					$this->category = $value;
					break;
				case "page":
					$this->page = $value;
					break;
				case "parent_page":
					$this->parent_page = $value;
					break;
				case "title":
					$this->title = $this->_parseString($value, "title");
					break;
				case "source":
					$this->source = $this->_parseString($value, "source");
					break;
				case "tags":
					$this->tags = $this->_parseTags($value);
					break;
				default:
					throw new Wikidot_Facade_Exception_WrongArguments("Invalid argument array key: $key");
					break;
			}
		}
		
		// more sophisticated ones...
		if ($this->category) {
			$this->category = $this->_parseCategory($this->site, $this->category);
		}
		
		if ($this->page) {
			$this->page = $this->_parsePage($this->site, $this->page);
		}
		
		if ($this->parent_page) {
			$this->parent_page = $this->_parsePage($this->site, $this->parent_page);
		}
		
		foreach ($requiredArgs as $key) {
			if (! $this->$key) {
				throw new Wikidot_Facade_Exception_WrongArguments("Required argument array key not passed: $key");
			}
		}
	}
	
	protected function repr($object, $hint = null) {
		// first deal with arrays of objects
		if (is_array($object)) {
			$array = array();
			foreach ($object as $item) {
				$array[] = $this->repr($item, $hint);
			}
			return $array;
		}
		
		// page
		if ($object instanceof DB_Page) {
			return $this->_reprPage($object, $hint);
		}
		
		// category
		if ($object instanceof DB_Category) {
			return $this->_reprCategory($object);
		}
		
		// site
		if ($object instanceof DB_Site) {
			return $this->_reprSite($object);
		}
		
		// the result is of none supported types
		throw new Wikidot_Facade_Exception_WrongReturnValue("Invalid type of returned value");
	}
	
	protected function _parseString($value, $key = "") {
		if (is_string($value)) {
			return $value;
		}
		if (is_numeric($value)) {
			return "$value";
		}
		throw new Wikidot_Facade_Exception_WrongArguments("Argument $key must be a string");
	}
	
	protected function _parseTags($tags) {
		if (is_string($tags)) {
			$tags = preg_split(trim("/[ ,]+/", $tags));
		}
		if (is_array($tags)) {
			return $tags;
		}
		throw new Wikidot_Facade_Exception_WrongArguments("Invalid tags argument (it must be array or string)");
	}
	
	protected function _parseUser($user) {
		if (is_int($user)) { // int = ID
			$user = DB_OzoneUserPeer::instance()->selectByPrimaryKey($user);
		}
		
		if ($user instanceof DB_OzoneUser) {
			return $user;
		}
		throw new Wikidot_Facade_Exception_WrongArguments("User does not exist");
	}
	
	protected function _parseSite($site) {
		if (is_int($site)) { // int = ID
			
			$site = DB_SitePeer::instance()->selectByPrimaryKey($site);
			
		} elseif (is_string($site)) { // string = name
			
			$c = new Criteria();
			$c->add("unix_name", WDStringUtils::toUnixName($site));
			$site = DB_SitePeer::instance()->selectOne($c);
			
		}
		
		if ($site instanceof DB_Site) {
			return $site;
		}
		
		throw new Wikidot_Facade_Exception_WrongArguments("Site does not exist");
	}
	
	protected function _parseCategory($site, $category) {
		if (is_int($category)) { // int = ID
			
			$category = DB_SitePeer::instance()->selectByPrimaryKey($category);
			
		} elseif (is_string($category)) {
			
			if ($site) {
				$c = new Criteria();
				$c->add("name", WDStringUtils::toUnixName($category));
				$c->add("site_id", $site->getSiteId());
				$category = DB_CategoryPeer::instance()->selectOne($c);
			}
		}
		
		if ($category instanceof DB_Category) {
			return $category;
		}
		throw new Wikidot_Facade_Exception_WrongArguments("Category does not exist");
	}
	
	protected function _parsePage($site, $page) {
		if (is_int($page)) { // int = ID
			
			$page = DB_PagePeer::instance()->selectByPrimaryKey($page);
			
		} elseif (is_string($page)) {
			
			if ($site) {
				
				$page = preg_replace("/^_default:/", "", $page);
				
				$c = new Criteria();
				$c->add("unix_name", WDStringUtils::toUnixName($page));
				$c->add("site_id", $site->getSiteId());
				$page = DB_PagePeer::instance()->selectOne($c);
			}
		}
		
		if ($page instanceof DB_Page) {
			return $page;
		}
		throw new Wikidot_Facade_Exception_WrongArguments("Page does not exist");
	}
	
	/**
	 * string representation of date from ODate
	 * 
	 * @param $date ODate
	 * @return string
	 */
	protected function _reprDate($date) {
		return $date->getDate();
	}
	
	/**
	 * string representation of compiled page
	 * 
	 * @param $compiled DB_PageCompiled
	 * @return string
	 */
	protected function _reprPageCompiled($compiled) {
		$d = utf8_encode("\xFE");
		$content = $compiled->getText();
        $content = preg_replace("/" . $d . "module \"([a-zA-Z0-9\/_]+?)\"(.+?)?" . $d . "/", '', $content);
        // TODO fix links: 
    	//$content = preg_replace(';(<.*?)(src|href)="/([^"]+)"([^>]*>);si', '\\1\\2="http://'.$site->getDomain().'/\\3"\\4', $content);
		$content = preg_replace(';<script\s+[^>]+>.*?</script>;is', '', $content);
		$content = preg_replace(';(<[^>]*\s+)on[a-z]+="[^"]+"([^>]*>);si', '\\1 \\2', $content);
		return $content;
	}
	
	/**
	 * representation of site
	 * 
	 * @param $site DB_Site
	 * @return array
	 */
	protected function _reprSite($site) {
		return array(
			"name" => $site->getUnixName(),
			"title" => $site->getName(),
			"private" => $site->getPrivate(),
		);
	}
	
	/**
	 * representation of category
	 * 
	 * @param $category DB_Category
	 * @return array
	 */
	protected function _reprCategory($category) {
		return array(
			"name" => $category->getName(),
		);
	}
	
	/**
	 * External representation of a page object
	 *  
	 * @param DB_Page $page
	 * @param string $hint
	 * @return array
	 */
	protected function _reprPage($page, $hint) {
		if ($hint == "meta") {
			$category = $page->getCategoryName();
			$name = preg_replace("|^$category:|", "", $page->getUnixName());
			$tags = $page->getTagsAsArray();
			
			$parent_page_name = null;
			if ($parent_page_id = $page->getParentPageId()) {
				if ($parent_page = DB_PagePeer::instance()->selectByPrimaryKey($parent_page_id)) {
					$parent_page_name = $parent_page->getUnixName();
				}
			}
			
			$user_created_name = null;
			if ($user_created_id = $page->getOwnerUserId()) {
				if ($user_created = DB_OzoneUserPeer::instance()->selectByPrimaryKey($user_created_id)) {
					$user_created_name = $user_created->getNickName();
				}
			}
			
			return array(
				"site" => $page->getSite()->getUnixName(),
    			"category" => $category,
				"name" => $name,
				"full_name" => $page->getUnixName(),
				"title" => $page->getTitleRaw(),
				"title_shown" => $page->getTitle(),
				"title_or_unix_name" => $page->getTitleOrUnixName(),
				"tag_string" => join(" ", $tags),
				"tag_array" => $tags,
				"parent_page" => $parent_page_name,
				"date_edited" => $this->_reprDate($page->getDateLastEdited()),
				"user_edited" => $page->getLastEditUserString(),
				"date_created" => $this->_reprDate($page->getDateCreated()),
				"user_created" => $user_created_name,
			);
		} else {
			return array(
				"source" => $page->getSource(),
				"html" => $this->_reprPageCompiled($page->getCompiled()),
				"meta" => $this->_reprPage($page, "meta"),
			);
		}
	}
}
