(function() {

    var observer;
    var timer;

    function transformEntireDom() {
        var elements = document.getElementsByTagName('*');
        
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            transformNodes(element.childNodes);
        }
    }

    function macToOuiStart() {
        if ('MutationObserver' in window) {
            if (typeof observer === 'undefined') {
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            transformNodes(mutation.addedNodes);
                        }
                    });
                });
        }
            observer.observe(document.body, { /* attributes: true, */ childList: true, characterData: true, subtree: true });
            transformEntireDom();
        } else {
            timer = setInterval(transformEntireDom, 200);
        }
    }
    
    function macToOuiStop() {
        if ('MutationObserver' in window) {
            if (observer) {
                observer.disconnect();
            }
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if ('stop' === request.action) {
            macToOuiStop();
        } else if ('start' === request.action) {
            macToOuiStart();
        }
    });

    function transformNodes(nodes) {
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];

            if (node.nodeType === 3) { // text
                var text = node.nodeValue;
                var replacedText = macWithManu(text);

                if (replacedText !== text) {
                    if (node.parentElement) { 
                        node.parentElement.replaceChild(document.createTextNode(replacedText), node);
                    } else {
                        // console.log("no parentElement");
                    }
                }
            } else if (node.nodeType === 1) {
                // important: without this the initial load isn't translated, and neither appear do additions
                transformNodes(node.childNodes);
            }
        }
    }

    chrome.storage.sync.get("enabled", function (obj) {
        console.log("content, storage = " + obj);
        if (obj.enabled) {
            macToOuiStart();
        }
    });

})();
