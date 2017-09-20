chrome.tabs.query({active: true}, function (tabs) {
    var url = new URL(tabs[0].url);
    var key = url.protocol + "//" + url.host;
    chrome.storage.local.get(key, function (result) {
        document.getElementById("lastModified").innerText = result[key].modified;
    });
});

