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
 * @package Wikidot
 * @version $Id$
 * @copyright Copyright (c) 2008, Wikidot Inc.
 * @license http://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License
 */

class ForumCommentsModule extends SmartyModule {
	
	protected $processPage = false;
	
	public function build($runData){
		$site = $runData->getTemp("site");
		$page = $runData->getTemp("page");
		// check for a discussion thread. if not exists - create it!
		
		$c = new Criteria();
		$c->add("page_id", $page->getPageId());
		$c->add("site_id", $site->getSiteId());
		
		$thread = DB_ForumThreadPeer::instance()->selectOne($c);
		
		if($thread == null){
			// create thread!!!
			$c = new Criteria();
			$c->add("site_id", $site->getSiteId());
			$c->add("per_page_discussion", true);
			
			$category = DB_ForumCategoryPeer::instance()->selectOne($c);
			
			if($category == null){
				// create this category!
				$category = new DB_ForumCategory();
				$category->setName(_("Per page discussions"));
				$category->setDescription(_("This category groups discussions related to particular pages within this site."));
				$category->setPerPageDiscussion(true);
				$category->setSiteId($site->getSiteId());
				
				// choose group. create one?
				$c = new Criteria();
				$c->add("site_id", $site->getSiteId());
				$c->add("name", "Hidden");
				$group = DB_ForumGroupPeer::instance()->selectOne($c);
				if($group == null){
					$group = new DB_ForumGroup();
					$group->setName(_("Hidden"));
					$group->setDescription(_("Hidden group used for storing some discussion threads."));
					$group->setSiteId($site->getSiteId());
					$group->setVisible(false);
					$group->save();
				}
				$category->setGroupId($group->getGroupId());
				$category->save();
			}
			
			// now create thread...
			$thread = new DB_ForumThread();
			$thread->setCategoryId($category->getCategoryId());
			$thread->setSiteId($site->getSiteId());
			$thread->setPageId($page-getPageId());
			$thread->setUserId(-1);
			$thread->setDateStarted(new ODate());
			$thread->setNumberPosts(0);
			$thread->save();
			
			$page->setThreadId($thread->getThreadId());
			$page->save();
			
			$category->setNumberThreads($category->getNumberThreads()+1);
			$category->save();	
		}else{
			$category = $thread->getForumCategory();
		}
		
		$c = new Criteria();
		$c->add("thread_id", $thread->getThreadId());
		$c->add("site_id", $site->getSiteId());
		$c->addJoin("user_id", "ozone_user.user_id");
		$c->addOrderAscending("post_id");
		
		$posts = DB_ForumPostPeer::instance()->select($c);
		
		// make a mapping first.
		$map = array();
		$levels = array();

		foreach($posts as $post){
			$parentId = $post->getParentId();
			$postId = $post->getPostId();
			if($parentId === null){
				// if no parrent - simply add at the end of $map
				$map[] =  $postId;
				$levels[$postId] = 0;
			} else {
				// find a parent
				
				$cpos = array_search($parentId, $map);
				$clevel = $levels[$parentId];
				// find a place for the post, i.e. the place where level_next == level or the end of array	
				$cpos++;
				while(isset($map[$cpos]) && $levels[$map[$cpos]]>$clevel){
					$cpos++;	
				}
				// insert at this position!!!

				array_splice($map, $cpos, 0, $postId);
				$levels[$postId] = $clevel+1;
			}
		}

		// create container control list
		
		$cc = array();
		foreach($map as $pos => $m){
			// open if previous post has LOWER level
			$clevel = $levels[$m];

			if(isset($map[$pos+1])){
				$nlevel = $levels[$map[$pos+1]];
				if( $nlevel>$clevel){
					$cc[$pos] = 'k';	
				}
				if($nlevel < $clevel){
					$cc[$pos]=str_repeat('c', $clevel-$nlevel);	
				}
					
			}else{
				$cc[$pos]=str_repeat('c', $clevel);	
			}  	
		}

		$runData->contextAdd("postmap", $map);
		$runData->contextAdd("levels", $levels);
		$runData->contextAdd("containerControl", $cc);
		
		$runData->contextAdd("thread", $thread);
		$runData->contextAdd("category", $category);
		$runData->contextAdd("posts", $posts);
		
		$uri = GlobalProperties::$MODULES_JS_URL.'/forum/ForumViewThreadModule.js';
		$this->extraJs[] = $uri;
	}
	
}
