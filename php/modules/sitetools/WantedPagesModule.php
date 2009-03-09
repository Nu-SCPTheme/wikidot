<?php
class WantedPagesModule extends CacheableModule {
	
	protected $timeOut = 300;
	
	public function build($runData){
		$site = $runData->getTemp("site");
		$siteId = $site->getSiteId();
		
		$q = "SELECT page.*, page_link.to_page_name as wanted_unix_name FROM page, page_link " .
				"WHERE page_link.site_id = '$siteId' AND page_link.to_page_id IS NULL " .
				"AND page_link.from_page_id = page.page_id " .
				"ORDER BY wanted_unix_name, COALESCE(page.title, page.unix_name)";
		
		$db = Database::connection();
		$res = $db->query($q);
		
		$all = $res->fetchAll();
		
		$res = array();
		
		if($all){
			foreach($all as $a){
				$page = new DB_Page($a);
				$wun = $a['wanted_unix_name'];
				$res[$wun][] = $page;	
			}	
			
			$runData->contextAdd("res", $res);
		}
		
			
	}
	
}
?>
