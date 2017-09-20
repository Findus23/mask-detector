function handleMessage(request, sender, sendResponse) {
    var tabId = sender.tab.id;
    if (request.typo3) {
        chrome.storage.local.get(request.url, function (result) {
            var data = result[request.url];
            if (!data || Date.now() - data.updated > 1000 * 60 * 60 * 24) {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    var found;
                    if (xmlHttp.readyState === 4) {
                        if (xmlHttp.status === 200) {
                            found = true;
                            chrome.browserAction.enable(tabId);
                        } else {
                            found = false;
                            chrome.browserAction.disable(tabId);
                            chrome.browserAction.setBadgeText({text: "t3", tabId: tabId});
                            chrome.browserAction.setBadgeBackgroundColor({color: "#FF8700", tabId: tabId});
                        }
                    }
                    var data = {};
                    data[request.url] = {
                        found: found,
                        modified: xmlHttp.getResponseHeader('Last-Modified'),
                        updated: Date.now()
                    };
                    chrome.storage.local.set(data);
                };
                xmlHttp.open("GET", request.url + "/typo3conf/ext/mask/ext_icon.gif", true);
                xmlHttp.send();
            } else {
                if (data.found) {
                    chrome.browserAction.enable(tabId);
                } else {
                    chrome.browserAction.disable(tabId);
                    chrome.browserAction.setBadgeText({text: "t3", tabId: tabId});
                    chrome.browserAction.setBadgeBackgroundColor({color: "#FF8700", tabId: tabId});
                }
            }
        });
    }
    else {
        chrome.browserAction.disable(tabId);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
