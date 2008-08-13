<!DOCTYPE html 
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{$site->getLanguage()}" lang="{$site->getLanguage()}">

<head>
 	<title>{$site->getName()}{if $wikiPage && $wikiPage->getTitle()}: {$wikiPage->getTitle()|escape}{/if}</title>
 	<script type="text/javascript" src="/common--javascript/json.js"></script>
 	
	<script type="text/javascript" src="/common--javascript/combined.js"></script>
	
 	<script type="text/javascript" src="/common--javascript/OZONE.js"></script>
 	<script type="text/javascript" src="/common--javascript/dialog/OZONE.dialog.js"></script>
 	
 	<script  type="text/javascript">
 		// global request information
 		{literal}
 		var WIKIREQUEST = {};
 		WIKIREQUEST.info = {};
 		{/literal}
 		WIKIREQUEST.info.domain = "{$site->getDomain()}";
 		WIKIREQUEST.info.siteId = {$site->getSiteId()};
 		WIKIREQUEST.info.categoryId = {$category->getCategoryId()};
 		WIKIREQUEST.info.themeId = {$theme->getThemeId()};
 		WIKIREQUEST.info.requestPageName = "{$wikiPageName}";
 		OZONE.request.timestamp = %%%CURRENT_TIMESTAMP%%%;
 		OZONE.request.date = new Date();
 		WIKIREQUEST.info.lang = '{$site->getLanguage()}';
 		{if $wikiPage}
 		WIKIREQUEST.info.pageUnixName = "{$wikiPage->getUnixName()}";
 		WIKIREQUEST.info.pageId = {$wikiPage->getPageId()};
 		{/if}
 		WIKIREQUEST.info.lang = "{$site->getLanguage()}";
 		OZONE.lang = "{$site->getLanguage()}";
// 		window.onload = WikidotInit();

		var URL_HOST = '{$URL_HOST}';
		var URL_DOMAIN = '{$URL_DOMAIN}';
 	</script>
 	
 	<meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
    <meta http-equiv="content-language" content="{$site->getLanguage()}"/>
 	
 	
 	<script type="text/javascript" src="/common--javascript/WIKIDOT.js"></script>
 	<script type="text/javascript" src="/common--javascript/WIKIDOT.page.js"></script>
 	<script type="text/javascript" src="/common--javascript/WIKIDOT.editor.js"></script>
 	
 	{if $useCustomDomainScript}
 		{module name="login/CustomDomainScriptModule"}
 	{/if}
 	{if $usePrivateWikiScript}
 		<script type="text/javascript" src="{$privateWikiScriptUrl}"></script>
 	{/if}
   	<style type="text/css" id="internal-style">
   		
   		{foreach from=$theme->getStyleUrls() item=file}
   			@import url({$file});
   		{/foreach}
   		
    </style>
    
    <link rel="shortcut icon" href="/common--theme/base/images/favicon.gif"/>
    <link rel="icon" type="image/gif" href="/common--theme/base/images/favicon.gif"/>
    
    {* OpenID part *}
    {if $openId && $openId.enabled}
    	<link rel="openid.server" href="{$openId.server}" />
  		<link rel="openid.delegate" href="{$openId.identity}" />
  		<meta http-equiv="X-XRDS-Location" content="{$openId.identity}/xrds" />
    {/if}
    
</head>

  <body id="html-body">

	<div id="container-wrap">
		<div id="container">
		  	<div id="header">
		  		<h1><a href="/"><span>{$site->getName()|escape}</span></a></h1>
		  		{if $site->getSubtitle()}
		  			<h2><span>{$site->getSubtitle()|escape}</span></h2>
		  		{/if}
		  		
		  		<div id="search-top-box">
		  			<form id="search-top-box-form" action="dummy">
			  			<input id="search-top-box-input" class="text empty" type="text" size="15" name="query" value="{t}search this wiki{/t}" onfocus="{literal}if(YAHOO.util.Dom.hasClass(this, 'empty')){YAHOO.util.Dom.removeClass(this,'empty'); this.value='';}{/literal}"/><input class="button" type="submit" name="search" value="{t}search{/t}"/>
				 	</form>
	  			</div>
		  		
		  		{if $topBarContent}
			  		<div id="top-bar">
			  			{$topBarContent|regex_replace:"/>\s+</s":"><"}
			  		</div>
		  		{/if}
		  		<div id="login-status">{$module->render("LoginStatusModule")}</div>
		  		<div id="header-extra-div-1"><span></span></div><div id="header-extra-div-2"><span></span></div><div id="header-extra-div-3"><span></span></div>
		  	</div>
		  	
			<div id="content-wrap">
				{if $sideBar1Content}
					<div id="side-bar">
						{$sideBar1Content|regex_replace:"/>\s+</s":"><"}
					</div>
				{/if}
				
				<div id="main-content">
					<div id="action-area-top"></div>
					
					{if $wikiPage == null || $wikiPage->getTitle() != ''}
					<div id="page-title">
					{if $wikiPage}{$wikiPage->getTitle()|escape}{else}{t}The page does not (yet) exist.{/t}{/if}
					</div>
					{/if}
					{if $breadcrumbs}
						<div id="breadcrumbs">
							{foreach from=$breadcrumbs item=breadcrumb}
								<a href="/{$breadcrumb->getUnixName()}">{$breadcrumb->getTitle()|escape}</a> &raquo;
							{/foreach}
							{$wikiPage->getTitleOrUnixName()|escape}
						</div>
					{/if}
					
					
					<div id="page-content">
						{if $pageNotExists}
							{$macros->load("PageNotExistsMacro")}
							{macro name="pageNotExistsMacro"  wikiPage=$wikiPageName}
						{/if}
						{$screen_placeholder}
					</div>
					{if $tags}
						<div class="page-tags">
							<span>
								{t}page tags{/t}:
								{foreach from=$tags item=tag}
									<a href="/system:page-tags/tag/{$tag|escape:'url'}#pages">{$tag|escape}</a>
								{/foreach}
							</span>
						</div>
					{/if}
					
					<div style="clear:both; height:1px; font-size:1px;"></div>
					{if !$pageNotExists}
						{module name="PageOptionsBottomModule" showDiscuss=$category->getShowDiscuss() threadId=$wikiPage->getThreadId() pageUnixName=$wikiPage->getUnixName()}			
					{/if}
					
					<div id="action-area" style="display: none"></div>
				</div>
			</div>
			
			
			{* you can customize the footer and add/remove any links you want
				- it will affect all the hosted wikis *}
	 		<div id="footer">
	 			<div class="options">
		 			<a href="{$URL_DOCS}" id="wikidot-help-button">
			 			{t}help{/t}
			 		</a>
		 			{*|
			 		<a href="http://www.wikidot.com/legal:terms-of-service"   id="wikidot-tos-button">
			 			{t}terms of service{/t}
			 		</a>
		 			|
			 		<a href="http://www.wikidot.com/legal:privacy-policy"   id="wikidot-privacy-button">
			 			{t}privacy{/t}
			 		</a>*}
		 			|
			 		<a href="javascript:;" id="bug-report-button" 
			 			onclick="WIKIDOT.page.listeners.pageBugReport(event)">
			 			{t}report a bug{/t}
			 		</a>
		 			|
			 		<a href="javascript:;" id="abuse-report-button" 
			 			onclick="WIKIDOT.page.listeners.flagPageObjectionable(event)">
			 			{t}flag as objectionable{/t}
			 		</a>
			 		
	 			</div>
	 			Part of <a href="http://{$URL_HOST}">{$SERVICE_NAME|escape}</a>
	 			&#8212; 
 				Powered by <a href="http://www.wikidot.org/">Wikidot</a>
	 		</div>
	 		{if $licenseText!=""}
		 		<div id="license-area" class="license-area">
		 			{$licenseText|replace:'%%UNLESS%%':'Unless stated otherwise Content of this page is licensed under'}
				</div>
			{/if}
			
			<div id="extrac-div-1"><span></span></div><div id="extrac-div-2"><span></span></div><div id="extrac-div-3"><span></span></div>
			
	 	</div>
	 </div>
 	
 	<!-- These extra divs/spans may be used as catch-alls to add extra imagery. -->
	<div id="extra-div-1"><span></span></div><div id="extra-div-2"><span></span></div><div id="extra-div-3"><span></span></div>
	<div id="extra-div-4"><span></span></div><div id="extra-div-5"><span></span></div><div id="extra-div-6"><span></span></div>
 	
 	 	
 	<div id="page-options-bottom-tips" style="display: none">
 		<div id="edit-button-hovertip">
 			{t}Click here to edit contents of this page.{/t}
 		</div>
 	</div>
 	<div id="page-options-bottom-2-tips"  style="display: none">
 		<div id="edit-sections-button-hovertip">
	 		{t}Click here to toggle editing of individual sections of the page (if possible).
	 		Watch headings for an "edit" link when available.{/t}
 		</div>
 		<div id="edit-append-button-hovertip">
 			{t}Append content without editing the whole page source.{/t}
 		</div>
 		<div id="history-button-hovertip">
 			{t}Check out how this page has evolved in the past.{/t}
 		</div>
 		<div id="discuss-button-hovertip">
 			{t}If you want to discuss contents of this page - this is the easiest way to do it.{/t}
 		</div>
 		<div id="files-button-hovertip">
 			{t}View and manage file attachments for this page.{/t}
 		</div>
 		<div id="site-tools-button-hovertip">
 			{t}A few useful tools to manage this Site.{/t}
 		</div>
 		<div id="backlinks-button-hovertip">
 			{t}	See pages that link to and include this page.{/t}
 		</div>
 		<div id="rename-move-button-hovertip">
 			{t}Change the name (also URL address, possibly the category) of the page.{/t}
 		</div>
 		<div id="view-source-button-hovertip">
 			{t}View wiki source for this page without editing.{/t}
 		</div>
 		<div id="parent-page-button-hovertip">	
 			{t}View/set parent page (used for creating breadcrumbs and structured layout).{/t}
 		</div>
 		
 		<div id="abuse-report-button-hovertip">
 			{t}	Notify administrators if there is objectionable content in this page.{/t}
 		</div>
 		<div id="bug-report-button-hovertip">
			{t}Something does not work as expected? Find out what you can do.{/t}
 		</div>
 		
 	</div>
 	
 	<div id="account-notifications-dummy" style="display:none"></div>
 	
 	<div style="display:none" id="dummy-ondomready-block"></div>
  </body>

</html>