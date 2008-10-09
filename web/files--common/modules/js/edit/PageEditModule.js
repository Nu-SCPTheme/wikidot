/*
 * Wikidot - free wiki collaboration software
 * Copyright (c) 2008, Wikidot Inc.
 * 
 * Code licensed under the GNU Affero General Public 
 * License version 3 or later.
 *
 * For more information about licensing visit:
 * http://www.wikidot.org/license
 */

WIKIDOT.modules.PageEditModule = {};

WIKIDOT.modules.PageEditModule.vars = {
	editMode: 'page', // the default mode
	stopCounterFlag: false,
	inputFlag: false, // changed to true by any input
	lastInput: (new Date()).getTime(), // last input.
	savedSource: '' // source saved on server
};

WIKIDOT.modules.PageEditModule.listeners = {
	cancel: function(e){

		var r = YAHOO.util.Event.removeListener(window, "beforeunload", WIKIDOT.modules.PageEditModule.listeners.leaveConfirm);
		YAHOO.util.Event.removeListener(window, "unload", WIKIDOT.modules.PageEditModule.listeners.leavePage);
		
		if(WIKIREQUEST.info.requestPageName.match(/^([a-z0-9]+:)?autoincrementpage$/)){
			window.location.href='/'+WIKIREQUEST.info.requestPageName;
			return;
		}
		var parms = new Object();
		parms['lock_id'] = WIKIDOT.page.vars.editlock.id;
		parms['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		parms['action']="WikiPageAction";
		parms['event']="removePageEditLock";
		OZONE.ajax.requestModule("Empty",parms, WIKIDOT.modules.PageEditModule.callbacks.cancel);
		
	},	
	
	preview: function(e){
		var params = OZONE.utils.formToArray("edit-page-form");
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		params['page_unix_name'] = WIKIREQUEST.info.requestPageName;
		if(WIKIREQUEST.info.pageId){
			params['pageId'] = WIKIREQUEST.info.pageId;
		}
		
		OZONE.ajax.requestModule("edit/PagePreviewModule",params,WIKIDOT.modules.PageEditModule.callbacks.preview);
	},
	
	save: function(e){
		var t2 = new OZONE.dialogs.WaitBox(); //global??? pheeee...
		t2.content="Saving page..."	;
		t2.show();
	
		var params = OZONE.utils.formToArray("edit-page-form");
		params['action'] = 'WikiPageAction';
		params['event'] = 'savePage';
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['wiki_page'] = WIKIREQUEST.info.requestPageName;
		params['lock_id'] = WIKIDOT.page.vars.editlock.id;
		if( WIKIREQUEST.info.pageId) {params['page_id'] = WIKIREQUEST.info.pageId;}
		params['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}

		OZONE.ajax.requestModule("Empty",params,WIKIDOT.modules.PageEditModule.callbacks.save);
	
	},
	saveAndContinue: function(e){
		var t2 = new OZONE.dialogs.WaitBox(); //global??? pheeee...
		t2.content="Saving page..."	;
		t2.show();
	
		var params = OZONE.utils.formToArray("edit-page-form");
		params['action'] = 'WikiPageAction';
		params['event'] = 'savePage';
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['wiki_page'] = WIKIREQUEST.info.requestPageName;
		params['lock_id'] = WIKIDOT.page.vars.editlock.id;
		if( WIKIREQUEST.info.pageId) {params['page_id'] = WIKIREQUEST.info.pageId;}
		params['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		params['and_continue'] = "yes";
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}
	
		OZONE.ajax.requestModule("Empty",params,WIKIDOT.modules.PageEditModule.callbacks.saveAndContinue);
	
	},
	
	changeInput: function(e){
		WIKIDOT.modules.PageEditModule.vars.inputFlag = true;
		
		WIKIDOT.modules.PageEditModule.vars.lastInput = (new Date()).getTime();
		WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft(15*60);
	},
	
	leaveConfirm: function(e){
		if(WIKIDOT.modules.PageEditModule.utils.sourceChanged()){
			e.returnValue='If you leave this page, all the unsaved changes will be lost.';
		}
	},
	
	/**
	 * When a page is left we realy _should_ release the lock.
	 */
	leavePage: function(e){
		// release lock
		var parms = new Object();
		parms['action']="WikiPageAction";
		parms['event']="removePageEditLock";
		parms['lock_id'] = WIKIDOT.page.vars.editlock.id;
		parms['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		OZONE.ajax.requestModule("Empty",parms, WIKIDOT.modules.PageEditModule.callbacks.forcePageEditLockRemove);

		/* DO WE NEED THIS INFO????
		if(WIKIDOT.modules.PageEditModule.utils.sourceChanged()){
			alert("You have closed or left the window while editing a page.\n" +
				"If you have made any changes without saving them they are lost now.\n" +
				"The page edit lock has been removed.");
		}*/
		
	},
	
	leavePageRemoveLock: function(e){
		alert("deprectated!!!");	
		
	},
	
	forcePageEditLockRemove: function(e){
		WIKIDOT.page.vars.forceLockFlag = true;
		OZONE.dialog.cleanAll();
		WIKIDOT.page.listeners.editClick(null);
	},
	
	forceLockIntercept: function(e){
		var params = new Object();
		params['action'] = 'WikiPageAction';
		params['event'] = 'forceLockIntercept';
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['wiki_page'] = WIKIREQUEST.info.requestPageName;
		if(WIKIREQUEST.info.pageId) {params['page_id'] = WIKIREQUEST.info.pageId;}
		params['lock_id'] = WIKIDOT.page.vars.editlock.id;
		params['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}

		OZONE.ajax.requestModule("Empty",params,WIKIDOT.modules.PageEditModule.callbacks.forceLockIntercept);
	},
	recreateExpiredLock: function(e){
		var params = new Object();
		params['action'] = 'WikiPageAction';
		params['event'] = 'recreateExpiredLock';
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['wiki_page'] = WIKIREQUEST.info.requestPageName;
		params['lock_id'] = WIKIDOT.page.vars.editlock.id;
		if(WIKIREQUEST.info.pageId) {params['page_id'] = WIKIREQUEST.info.pageId;}
		params['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		params['since_last_input'] = 0; // seconds since last input
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}

		OZONE.ajax.requestModule("Empty",params,WIKIDOT.modules.PageEditModule.callbacks.recreateExpiredLock);
	},
	
	templateChange: function(e){
		if(! $("page-templates")){ return;}
		var templateId = $("page-templates").value;
		var change = true;
		if(WIKIDOT.modules.PageEditModule.utils.sourceChanged()){
			change = confirm("It seems you have already changed the page.\n" +
					"Changing the initial template now will reset the edited page.\n" +
					"Do you want to change the initial content?");
		}
		if(change){
			WIKIDOT.modules.PageEditModule.vars.templateId = templateId;
			if(templateId == null || templateId == ""){
				$("edit-page-textarea").value = '';
			} else {
				var p = new Object();
				p['page_id'] = templateId;
				OZONE.ajax.requestModule("edit/TemplateSourceModule", p,WIKIDOT.modules.PageEditModule.callbacks.templateChange );
			}
			
		}else{
			$("page-templates").value = WIKIDOT.modules.PageEditModule.vars.templateId;
		}
	},
	viewDiff: function(e){
		var params = OZONE.utils.formToArray("edit-page-form");
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}
		OZONE.ajax.requestModule("edit/PageEditDiffModule",params,WIKIDOT.modules.PageEditModule.callbacks.viewDiff);
		
	},
	confirmExpiration: function(e){
		WIKIDOT.modules.PageEditModule.utils.deactivateAll();
		OZONE.dialog.cleanAll();
	},
	
	closeDiffView: function(e){
		OZONE.visuals.scrollTo('action-area');
		setTimeout('$("view-diff-div").innerHTML=""', 250);
	}
}

WIKIDOT.modules.PageEditModule.callbacks = {
	preview: function(response){
		if(!WIKIDOT.utils.handleError(response)) {return;}
		
		var message = document.getElementById("preview-message").innerHTML;
		OZONE.utils.setInnerHTMLContent("action-area-top", message);
		
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			OZONE.utils.setInnerHTMLContent("edit-section-content", response.body.replace(/id="/g, 'id="prev06-'));
			YAHOO.util.Dom.setY("action-area-top", YAHOO.util.Dom.getY("edit-section-content"));
			OZONE.visuals.scrollTo("edit-section-content");
		}
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'page'){
			var title = response.title;
			OZONE.utils.setInnerHTMLContent("page-title", title);
			OZONE.visuals.scrollTo("container");
			$("page-content").innerHTML = response.body;
			WIKIDOT.page.fixers.fixEmails($("page-content"));
			
		}
		// put some notice that this is a preview only!

		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'append'){
			
			var aDiv = $("append-preview-div");
			if(!aDiv){
				aDiv = document.createElement('div');
				aDiv.id="append-preview-div";
				$("page-content").appendChild(aDiv);
			}
			
			aDiv.innerHTML = response.body.replace(/id="/g, 'id="prev06-');
			
			WIKIDOT.page.fixers.fixEmails($("append-preview-div"));
			OZONE.visuals.scrollTo("append-preview-div");
			// move the message box
			YAHOO.util.Dom.setY("action-area-top", YAHOO.util.Dom.getY("append-preview-div"));
		}

		WIKIDOT.modules.PageEditModule.utils.stripAnchors("page-content", "action-area");
	},
	
	viewDiff: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		$("view-diff-div").innerHTML = r.body;
		OZONE.visuals.scrollTo("view-diff-div");	
	},
	
	save: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		// check for errors?
		if(r.noLockError){
			// non recoverable. not saved.
			WIKIDOT.modules.PageEditModule.utils.timerStop();
			
			var w = new OZONE.dialogs.ErrorDialog();
			w.content = r.body;
			w.show();
			
			if(r.nonrecoverable == true){
				WIKIDOT.modules.PageEditModule.utils.deactivateAll();
			}
			
			return;
		}
		WIKIDOT.modules.PageEditModule.utils.timerStop();
		
		setTimeout('OZONE.dialog.factory.boxcontainer().hide({smooth: true})',400);
		setTimeout('var t2 = new OZONE.dialogs.SuccessBox(); t2.timeout=10000; t2.content="Page saved!";t2.show()', 600);
		var newUnixName = WIKIREQUEST.info.requestPageName;
		if(r.pageUnixName){
			newUnixName = r.pageUnixName;
		}
		setTimeout('window.location.href="/'+newUnixName+'"',1500);
		
		YAHOO.util.Event.removeListener(window, "beforeunload", WIKIDOT.modules.PageEditModule.listeners.leaveConfirm);
		YAHOO.util.Event.removeListener(window, "unload", WIKIDOT.modules.PageEditModule.listeners.leavePage);
	},
	saveAndContinue: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		if(r.noLockError){
			WIKIDOT.modules.PageEditModule.utils.timerStop();
			var cont = OZONE.dialog.factory.boxcontainer();
			cont.setContent(r.body);
			cont.showContent();		
			if(r.nonrecoverable == true){
				WIKIDOT.modules.PageEditModule.utils.deactivateAll();
			}
			return;
		}
		setTimeout('OZONE.dialog.factory.boxcontainer().hide({smooth: true})',400);
		setTimeout('var t2 = new OZONE.dialogs.SuccessBox(); t2.content="Page saved!";t2.show()', 600);
		setTimeout('OZONE.dialog.cleanAll()',2000);
		WIKIDOT.modules.PageEditModule.utils.updateSavedSource();
		WIKIDOT.page.vars.editlock.revisionId = r.revisionId;
		WIKIDOT.modules.PageEditModule.utils.updateActiveButtons();
	},
	
	cancel: function(response){
		if(!WIKIDOT.utils.handleError(response)) {return;}
		window.location.href='/'+WIKIREQUEST.info.requestPageName;
	},
	
	forcePageEditLockRemove: function(response){
		if(!WIKIDOT.utils.handleError(response)) {return;}
		WIKIDOT.page.listeners.editClick(null);
	},
	
	forceLockIntercept: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		if(r.error){
			alert('Unexpected error');
			return;
		}
		if(r.nonrecoverable == true){
			var cont = OZONE.dialog.factory.boxcontainer();
			cont.setContent(r.body);
			cont.showContent();
		}
		WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft(r.timeLeft);
		WIKIDOT.modules.PageEditModule.utils.timerStart();
		WIKIDOT.page.vars.editlock.id = r['lock_id'];
		WIKIDOT.page.vars.editlock.secret = r['lock_secret'];
		var t2 = new OZONE.dialogs.SuccessBox(); //global??? pheeee...
		t2.content="Lock successfully aquired";
		t2.show();
	},
	
	updateLock: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
	
		// check for errors?
		
		if(r.noLockError){
			OZONE.dialog.factory.shader().show();
			var cont = OZONE.dialog.factory.boxcontainer();
			cont.setContent(r.body);
			cont.showContent();
			
			if(r.nonrecoverable == true){
				WIKIDOT.modules.PageEditModule.utils.deactivateAll();
			}
			WIKIDOT.modules.PageEditModule.utils.timerStop();
			YAHOO.util.Event.removeListener(window, "beforeunload", WIKIDOT.modules.PageEditModule.listeners.leaveConfirm);
			YAHOO.util.Event.removeListener(window, "unload", WIKIDOT.modules.PageEditModule.listeners.leavePage);
			return;
		}
		
		if(r.lockRecreated){
			WIKIDOT.page.vars.editlock.id = r.lockId;
			WIKIDOT.page.vars.editlock.secret = r.lockSecret;
			
		}
		WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft(r.timeLeft);
	
	},
	
	lockExpired: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		OZONE.dialog.factory.shader().show();
		var cont = OZONE.dialog.factory.boxcontainer();
		cont.setContent(r.body);
		cont.showContent();
	},
	recreateExpiredLock: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		if(!r.lockRecreated){
			OZONE.dialog.factory.shader().show();
			var cont = OZONE.dialog.factory.boxcontainer();
			cont.setContent(r.body);
			cont.showContent();
		} else {
			WIKIDOT.page.vars.editlock.id = r.lockId;
			WIKIDOT.page.vars.editlock.secret = r.lockSecret;
			WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft(r.timeLeft);
			WIKIDOT.modules.PageEditModule.utils.timerStart();
			WIKIDOT.modules.PageEditModule.vars.lastInput = (new Date()).getTime();
			var t2 = new OZONE.dialogs.SuccessBox(); //global??? pheeee...
			t2.content="Lock succesfully aquired.";
			t2.show();
		}
	},
	templateChange: function(r){
		if(!WIKIDOT.utils.handleError(r)) {return;}
		
		if(r.body!=null && r.body != ""){
			$("edit-page-textarea").value = r.body;
		}
		
	}

}

WIKIDOT.modules.PageEditModule.utils = {

	sourceChanged: function() {
		var a = OZONE.utils.formToArray("edit-page-form");
		return (WIKIDOT.modules.PageEditModule.vars.savedSource == a["source"]); 
	},
	
	updateSavedSource: function() {
		var a = OZONE.utils.formToArray("edit-page-form");
		var WIKIDOT.modules.PageEditModule.vars.savedSource = a["source"]; 
	},
	
	stripAnchors: function(elementId, excludeElement){
		var el =  $(elementId);
		if(excludeElement){
			excludeElement = $(excludeElement);
		}
		if(el){	
			var anchors = el.getElementsByTagName("a");
		
			for(i=0; i<anchors.length; i++){
				if(excludeElement == null || !YAHOO.util.Dom.isAncestor(excludeElement, anchors[i])){
					var href = anchors[i].href;
					anchors[i].href = "javascript:;";
					anchors[i].onclick = null;
					anchors[i].target="_self";
					YAHOO.util.Event.purgeElement(anchors[i]);
					YAHOO.util.Event.addListener(anchors[i], "click", WIKIDOT.modules.PageEditModule.utils.leavePageWarning);
				}
			}
		}
	
	},
	/**
	 * Replaces anchors with dumb anchors in edit mode
	 */
	stripAnchorsAll: function(){
		WIKIDOT.modules.PageEditModule.utils.stripAnchors("html-body", "action-area");
	
	},
	
	leavePageWarning: function(){
		alert("Oooops... You should not leave the page while editing it.\nTo abort editing please use the \"cancel\" button below the edit area.");
	},
	
	updateActiveButtons: function(){
		el = $("edit-save-continue-button");
		if(el) {
			el.disabled  = false;
			YAHOO.util.Dom.removeClass(el, "disabled");
		}
		$("edit-save-button").disabled = false;
		YAHOO.util.Dom.removeClass($("edit-save-button"), "disabled");
	},
	
	deactivateAll: function(){
		// deactivates all the buttons, e.g. when lock is intercepted
		var el;
		el = $("edit-save-continue-button")
		if(el) el.disabled = true;
		$("edit-save-button").disabled = true;
		$("lock-info").style.display = "none";
		YAHOO.util.Event.removeListener("edit-page-form", "keypress", WIKIDOT.modules.PageEditModule.listeners.changeInput);
		YAHOO.util.Event.removeListener("edit-page-textarea", "change",WIKIDOT.modules.PageEditModule.listeners.changeInput);
		YAHOO.util.Event.removeListener(window, "beforeunload", WIKIDOT.modules.PageEditModule.listeners.leaveConfirm);
		YAHOO.util.Event.removeListener(window, "unload", WIKIDOT.modules.PageEditModule.listeners.leavePage);
		WIKIDOT.modules.PageEditModule.vars.stopCounterFlag = true;	
	},
	
	startLockCounter: function(){
		WIKIDOT.modules.PageEditModule.vars.counterStart = (new Date()).getTime();
		WIKIDOT.modules.PageEditModule.vars.lockLastUpdated = (new Date()).getTime();
		WIKIDOT.modules.PageEditModule.utils.updateLockCounter();
		WIKIDOT.modules.PageEditModule.vars.counterEmergency = false;
		
	},
	updateLockCounter: function(){
		var sec =  (new Date()).getTime() - WIKIDOT.modules.PageEditModule.vars.counterStart;
		sec = Math.round(15*60 - sec*0.001);
		OZONE.utils.setInnerHTMLContent("lock-timer", sec);
		if(sec < 120 && WIKIDOT.modules.PageEditModule.vars.counterEmergency == false){
			$("lock-timer").style.color="red";
			$("lock-timer").style.textDecoration = "blink";
			WIKIDOT.modules.PageEditModule.vars.counterEmergency = true;
		}
		setTimeout("WIKIDOT.modules.PageEditModule.utils.updateLockCounter()", 1000);
	},
	
	timerSetTimeLeft: function(timeLeft){
		WIKIDOT.modules.PageEditModule.vars.lockExpire = (new Date()).getTime() + timeLeft*1000; // in miliseconds.
	},
	
	timerTick: function(){
		var secLeft = WIKIDOT.modules.PageEditModule.vars.lockExpire - (new Date()).getTime();
		secLeft = Math.round(secLeft*0.001);
		$("lock-timer").innerHTML = secLeft;
		
		if(secLeft <=0 ){
			WIKIDOT.modules.PageEditModule.utils.lockExpired();
			return;
		}
		
		var sinceLastUpdate = (new Date()).getTime() - WIKIDOT.modules.PageEditModule.vars.lockLastUpdated;
		if(sinceLastUpdate*0.001 >= 60 || (secLeft<60 && WIKIDOT.modules.PageEditModule.vars.inputFlag)){
			WIKIDOT.modules.PageEditModule.vars.inputFlag = false;
			WIKIDOT.modules.PageEditModule.vars.lockLastUpdated = (new Date()).getTime();
			WIKIDOT.modules.PageEditModule.utils.updateLock();
			
		}
		
		// do some action if conditions....
		
	},
	
	timerStart: function(){
		if(WIKIREQUEST.info.requestPageName.match(/^([a-z0-9]+:)?autoincrementpage$/)){return;}
		WIKIDOT.modules.PageEditModule.vars.timerId = setInterval('WIKIDOT.modules.PageEditModule.utils.timerTick()', 1000);
	},
	timerStop: function(){
		if(WIKIREQUEST.info.requestPageName.match(/^([a-z0-9]+:)?autoincrementpage$/)){return;}
		clearInterval(WIKIDOT.modules.PageEditModule.vars.timerId);
	},
	/**
	 * Send a request to a server to update lock.
	 */
	updateLock: function(){
		if(WIKIREQUEST.info.requestPageName.match(/^([a-z0-9]+:)?autoincrementpage$/)){return;}
		var secSinceLastInput = Math.round(((new Date()).getTime() - WIKIDOT.modules.PageEditModule.vars.lastInput)*0.001);
		var params = new Object();
		params['action'] = 'WikiPageAction';
		params['event'] = 'updateLock';
		params['mode']=WIKIDOT.modules.PageEditModule.vars.editMode;
		params['wiki_page'] = WIKIREQUEST.info.requestPageName;
		params['lock_id'] = WIKIDOT.page.vars.editlock.id;
		if(WIKIREQUEST.info.pageId){	params['page_id'] = WIKIREQUEST.info.pageId;}
		params['lock_secret'] = WIKIDOT.page.vars.editlock.secret;
		params['revision_id'] = WIKIDOT.page.vars.editlock.revisionId;
		params['since_last_input'] = secSinceLastInput; //0; // seconds since last input
		if(WIKIDOT.modules.PageEditModule.vars.editMode == 'section'){
			params['range_start'] = WIKIDOT.page.vars.editlock.rangeStart;
			params['range_end'] = WIKIDOT.page.vars.editlock.rangeEnd;
		}

		OZONE.ajax.requestModule("Empty",params,WIKIDOT.modules.PageEditModule.callbacks.updateLock);
	},
	
	lockExpired: function(){
		WIKIDOT.modules.PageEditModule.utils.timerStop();
		
		OZONE.ajax.requestModule("edit/LockExpiredWinModule", null, WIKIDOT.modules.PageEditModule.callbacks.lockExpired);
	}
}

WIKIDOT.modules.PageEditModule.init = function(){
	if(WIKIDOT.page.vars.locked == true){
		WIKIDOT.utils.formatDates();

	} else {
		
		WIKIDOT.modules.PageEditModule.vars.editMode = editMode;
		
		/* attach listeners */
		
		YAHOO.util.Event.addListener("update-lock", "click", WIKIDOT.modules.PageEditModule.utils.updateLock);
		
		YAHOO.util.Event.addListener("edit-page-form", "keypress", WIKIDOT.modules.PageEditModule.listeners.changeInput);
		YAHOO.util.Event.addListener("edit-page-textarea", "keydown", WIKIDOT.modules.PageEditModule.listeners.changeInput);
//	
		
		YAHOO.util.Event.addListener(window, "beforeunload", WIKIDOT.modules.PageEditModule.listeners.leaveConfirm);
		YAHOO.util.Event.addListener(window, "unload", WIKIDOT.modules.PageEditModule.listeners.leavePage);
		
		WIKIDOT.modules.PageEditModule.utils.stripAnchorsAll();
		WIKIDOT.modules.PageEditModule.utils.updateSavedSource();
		WIKIDOT.modules.PageEditModule.utils.updateActiveButtons();
		var path = window.location.pathname;
		var zz;
		if(zz = path.match(/^\/[a-z0-9\-:]+\/edit\/true\/t\/([0-9]+)/)){
			// force use the template
			
			var templateId = zz[1]	;
			$("page-templates").value = templateId;
		}
		
		try{
			if(zz = path.match(/\/title\/([^\/]+)/)){
				// set the title
				$("edit-page-title").value = decodeURIComponent(zz[1]);
			}
		}catch(e){}
		
		if( !WIKIREQUEST.info.pageId){
			// new page - init templates!
			WIKIDOT.modules.PageEditModule.listeners.templateChange(null);
		}
		
		WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft(60*15);
		 WIKIDOT.modules.PageEditModule.vars.lockLastUpdated = (new Date().getTime());
		WIKIDOT.modules.PageEditModule.utils.timerStart();

		WIKIDOT.Editor.init("edit-page-textarea", "wd-editor-toolbar-panel");
		
		var limiter = new OZONE.forms.lengthLimiter("edit-page-comments", "comments-charleft", 200);
		OZONE.dialog.cleanAll();
	
		// clear all visible hovers
		OZONE.dialog.hovertip.hideAll();
		
		// prevent backspace from going back
		YAHOO.util.Event.addListener(window, 'keypress', function(e){
			var kc = YAHOO.util.Event.getCharCode(e);
			if(kc == 8){
				var t = YAHOO.util.Event.getTarget(e, true);
				if(t.tagName.toLowerCase() != 'input' && t.tagName.toLowerCase() != 'textarea'){
					YAHOO.util.Event.stopEvent(e);
				}
			}

		});
		
		// handle ctrl+s
		var ctrls = new YAHOO.util.KeyListener(document, {keys:83, ctrl:true}, function(type,e){
				e = e[1];
				WIKIDOT.modules.PageEditModule.listeners.save(e);
				YAHOO.util.Event.stopEvent(e);
			}
		);
		ctrls.enable();
		$("edit-page-textarea").focus();
			
	}
}

// WHY??? ;-)
setTimeout("WIKIDOT.modules.PageEditModule.init()", 10);
