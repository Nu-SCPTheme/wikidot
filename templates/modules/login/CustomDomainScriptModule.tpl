{if $useCustomDomainScript}
	<script type="text/javascript" src="http{if $useCustomDomainScriptSecure}s{/if}://{$URL_HOST}/default--flow/login__CustomDomainScript?site_id={$site->getSiteId()}"></script>
{/if}