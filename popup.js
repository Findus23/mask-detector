chrome.tabs.query({active: true}, function (tabs) {
    var url = new URL(tabs[0].url);
    var key = url.protocol + "//" + url.host;
    chrome.storage.local.get(key, function (result) {
        var text;
        if (result[key]) {
            if (result[key].mask.modified) {
                text = result[key].mask.modified;
            } else if (result[key].tv.modified) {
                text = result[key].tv.modified
            }
        }
        if (text) {
            document.getElementById("lastModified").innerText = text;
        }
        if (result[key].t3version) {
            document.getElementById("typo3Version").innerText = result[key].t3version;
        }
    });
});

