{loadmacro set="PM"}

{if $newerMessage != null|| $olderMessage!= null}
	<div style="text-align: right" id="inbox-message-nav">
		{if $newerMessage}<a href="javascript:;" onclick="WIKIDOT.modules.AccountMessagesModule.listeners.viewSentMessage({$newerMessage->getMessageId()})">{t}newer{/t}</a> {/if}
		{if $newerMessage != null && $olderMessage!= null}|{/if}
		{if $olderMessage}<a href="javascript:;" onclick="WIKIDOT.modules.AccountMessagesModule.listeners.viewSentMessage({$olderMessage->getMessageId()})">{t}older{/t}</a>{/if} {t}message (by date){/t}
	</div>
{/if}

{macro name="pm" message=$message to=true}

<div id="inbox-message-options">
	<a href="javascript:;" onclick="WIKIDOT.modules.PMSentModule.listeners.removeSentMessage(event, {$message->getMessageId()})">{t}delete message{/t}</a>
</div>
