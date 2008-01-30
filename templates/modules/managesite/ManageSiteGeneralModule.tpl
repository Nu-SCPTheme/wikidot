<h1>{t}General settings{/t}</h1>

<p>
	{t}Here are some general settings for your Site.{/t}
</p>

<div class="error-block" id="sm-general-errorblock" style="display: none"></div>
<form id="sm-general-form">
	<table class="form">
		<tr>
			<td>
				{t}Site name{/t}:
			</td>
			<td>
				<input class="text" type="text" name="name" size="40" value="{$site->getName()|escape}"/>
			</td>
		</tr>
		<tr>
			<td>
				{t}Tagline{/t}:
			</td>
			<td>
				<input class="text" type="text" name="subtitle" size="40" value="{$site->getSubtitle()|escape}"/>
			</td>
		</tr>
		<tr>
			<td>
				{t}Description{/t}:
			</td>
			<td>
				<textarea name="description" id="site-description-field" cols="40" rows="3">{$site->getDescription()|escape}</textarea>
				<div class="sub">
					{t}Please keep it short.{/t} <span id="site-description-field-left"></span> {t}characters left{/t}.
				</div>
			</td>
		</tr>
		<tr>
			<td>
				{t}Site tags{/t}:
			</td>
			<td>
				<input  class="text" type="text" name="tags" size="40" value="{$tags}" maxlength="70"/>
				<div class="sub">
					{t}Simply the (one-word) tags that describe this site.{/t}<br/>
					{t}Separate by space.{/t}
				</div>
			</td>
		</tr>
		<tr>
			<td>
				{t}Default start page{/t}:
			</td>
			<td>
				<div class="autocomplete-container" style="width: 20em">
					<input type="text" id="sm-general-start" class="autocomplete-input text" name="default_page" size="35" value="{$site->getDefaultPage()|escape}"/>
					<div id="sm-general-start-list" class="autocomplete-list"></div>
				</div>
				<div class="sub">
					{t 1=$site->getDomain()}Which page will be displayed when people just type http://%1?{/t}
				</div>
			</td>
		</tr>
		
	</table>
	<div class="buttons">
		<input type="button" value="{t}cancel{/t}" id="sm-general-cancel"/>
		<input type="button" value="{t}save changes{/t}" id="sm-general-save"/>
	</div>
</form>

<h2>{t}Note{/t}!</h2>
<p>
	{t escape=no}Please do not input any <strong>site tags</strong> if your Site has been just created
	and does not have any original content yet.
	There is nothing worse than a horde of content-hungry people facing a generic template... ;-){/t}
</p>