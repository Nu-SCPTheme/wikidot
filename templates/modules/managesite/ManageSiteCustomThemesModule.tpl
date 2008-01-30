<h1>Custom themes</h1>

<p>
	Using custom themes you can easily convert your site into a brand new quality. 
	The idea is simple - you can create your own CSS rules. <br/>
	<!-- TODO: De-Wikidot.com-ize - change -->
	Look at the <a href="http://www.wikidot.com/doc:layout-reference" target="_blank">CSS layout reference too</a> and
	<!-- TODO: De-Wikidot.com-ize - change -->
	<a href="http://community.wikidot.com/howto:design-your-own-css-theme"  target="_blank">Design 
	your own CSS theme</a> howto.
</p>

{if $themes}
	<ul>
		{foreach from=$themes item=theme}
			<li>
				{$theme->getName()|escape}
				(<a href="javascript:;" onclick="WIKIDOT.modules.ManageSiteCustomThemesModule.listeners.editTheme(event, {$theme->getThemeId()})">edit</a>
				| <a href="javascript:;" onclick="WIKIDOT.modules.ManageSiteCustomThemesModule.listeners.deleteTheme(event, {$theme->getThemeId()})">delete</a>)
			</li>
		{/foreach}
	</ul>
{else}
	<p>
		There are no custom themes for this site.
	</p>
{/if}

<p>
	<a class="button" href="javascript:;" onclick="WIKIDOT.modules.ManageSiteCustomThemesModule.listeners.editTheme(event)">create a new theme</a>
</p>

<div id="edit-theme-box"></div>

