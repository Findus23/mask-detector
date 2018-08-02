function displayData(data, tabId, typo3) {
    console.table(data);
    var icon;
    if (typo3) {
        chrome.pageAction.show(tabId);
        if (data.mask.found) {
            icon = "icon";
        } else if (data.tv.found) {
            icon = "icon-tv";
        } else if (typo3) {
            icon = "icon-typo3";
        } else {
            icon = "icon-disabled";
        }
    } else {
        chrome.pageAction.hide(tabId);
        icon = "icon-disabled";
    }
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "128": "img/" + icon + ".128.png"
        }
    });
}

function handleMessage(request, sender) {
    console.log("recieved message");
    var tabId = sender.tab.id;
    if (request.typo3) {
        chrome.storage.local.get(request.url, function (result) {
            var data = result[request.url];
            if (!data || Date.now() - data.updated > 1000 * 60 * 60 * 24) {
                data = {};
                var xmlHttp = new XMLHttpRequest();
                data.mask = {};
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4) {
                        data.mask.found = xmlHttp.status === 200;
                        data.mask.type = "new";
                        data.mask.modified = xmlHttp.getResponseHeader('Last-Modified');
                        var xml2Http = new XMLHttpRequest();
                        xml2Http.onreadystatechange = function () {
                            if (xml2Http.readyState === 4) {
                                if (xml2Http.status === 200) {
                                    data.mask.found = true;
                                    data.mask.type = "old";
                                    data.mask.modified = xml2Http.getResponseHeader('Last-Modified');
                                }
                                var tvHttp = new XMLHttpRequest();
                                data.tv = {};
                                tvHttp.onreadystatechange = function () {
                                    if (tvHttp.readyState === 4) {
                                        data.tv.found = tvHttp.status === 200;
                                        data.tv.modified = tvHttp.getResponseHeader('Last-Modified');

                                        var cl = new XMLHttpRequest();
                                        cl.onreadystatechange = function () {
                                            if (cl.readyState === 4) {
                                                if (cl.status === 200) {
                                                    var changelog = cl.responseText.split('\n', 1)[0];
                                                    var regex = /(\d\.)+(\d+)/;
                                                    var match = regex.exec(changelog);
                                                    data.t3version = match[0];
                                                }
                                                console.log("saving data");
                                                data.updated = Date.now();

                                                displayData(data, tabId, true);

                                                var storage = {};
                                                storage[request.url] = data;
                                                chrome.storage.local.set(storage);
                                            }
                                        };

                                        cl.open("GET", request.url + "/typo3_src/ChangeLog", true);
                                        console.info("request changelog");
                                        cl.send();
                                    }
                                };
                                tvHttp.open("GET", request.url + "/typo3conf/ext/templavoila/ext_icon.gif", true);
                                console.info("request tv icon");
                                tvHttp.send();
                            }
                        };
                        xml2Http.open("GET", request.url + "/typo3conf/ext/mask/ext_icon.gif", true);
                        console.info("request old mask icon");
                        xml2Http.send();
                    }
                };
                xmlHttp.open("GET", request.url + "/typo3conf/ext/mask/Resources/Public/Icons/Extension.svg", true);
                console.info("request new mask icon");
                xmlHttp.send();
            }
            else {
                displayData(data, tabId, true);
            }
        });
    }
    else {
        displayData(false, tabId, false);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
