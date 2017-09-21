function enabled(tabId) {
    chrome.pageAction.show(tabId);
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "128": "logo.128.png"
        }
    })
}

function disabled(tabId) {
    chrome.pageAction.hide(tabId);
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "128": "logo-disabled.128.png"
        }
    })
}
function typo3(tabId) {
    chrome.pageAction.show(tabId);
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "128": "logo-typo3.128.png"
        }
    })
}

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
                            enabled(tabId);
                        } else {
                            found = false;
                            typo3(tabId);
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
                    enabled(tabId);
                } else {
                    typo3(tabId);
                }
            }
        });
    }
    else {
        disabled(tabId);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
