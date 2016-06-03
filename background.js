(function() {

    function checkAndHandleState() {
        chrome.storage.sync.get("enabled", function (obj) {
	    if (obj.enabled) {
                chrome.browserAction.setIcon({path:"img/logo.png"});
            } else {
                chrome.browserAction.setIcon({path:"img/logo-light.png"});
            } 
	
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            //chrome.tabs.query({}, function(tabs){
                for (var i = 0, len = tabs.length; i < len; i++) {
                    chrome.tabs.sendMessage(tabs[i].id, { action: obj.enabled ? "start" : "stop"}, function(response) {});  
    	        }
            });
	});
    }

    chrome.browserAction.onClicked.addListener(function() {
        chrome.storage.sync.get("enabled", function (obj) {
            obj.enabled = !obj.enabled;
            chrome.storage.sync.set(obj);
	    checkAndHandleState();
        });
    });
    
    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.storage.sync.get("enabled", function (obj) {
            if (obj.enabled) {
                chrome.tabs.sendMessage(activeInfo.tabId, { action: "start" }, function(response) {});
    	    } else {
		// in case it was on, we moved tab away, it was disabled, and we came back (todo: should somehow clean up when disabled though)
                chrome.tabs.sendMessage(activeInfo.tabId, { action: "stop" }, function(response) {});
            }
        });	
    });

    // initial condition
    checkAndHandleState();

})();
