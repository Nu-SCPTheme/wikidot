<h1>{t}Diff changes{/t}</h1>
<p>
	<a href="javascript:;" class="button" onclick="WIKIDOT.modules.PageEditModule.listeners.closeDiffView(event)">{t}close diff view{/t}</a>
</p>
<div class="inline-diff page-source">
	{if $diff}{$diff|semipre}{else}{t}The documents are identical - no changes.{/t}{/if}
</div>
