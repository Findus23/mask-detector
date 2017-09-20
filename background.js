function handleMessage(request, sender, sendResponse) {
    var tabId = sender.tab.id;
    if (request.typo3) {
        chrome.storage.local.get(request.url, function (result) {
            var data = result[request.url];
            if (!data || Date.now() - data.updated > 1000 * 60) {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    var found;
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        found = true;
                        chrome.browserAction.enable(tabId);
                    } else {
                        found = false;
                        chrome.browserAction.disable(tabId);
                    }
                    var data = {};
                    data[request.url] = {found: found, modified: false, updated: Date.now()};
                    chrome.storage.local.set(data);
                };
                xmlHttp.open("GET", request.url + "/typo3conf/ext/mask/ext_icon.gif", true);
                xmlHttp.send();
            } else {
                if (data.found) {
                    chrome.browserAction.enable(tabId);
                    console.info("found");
                } else {
                    chrome.browserAction.disable(tabId);
                }
            }
        });
    }
    else {
        chrome.browserAction.disable(tabId);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
