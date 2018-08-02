document.getElementById("clearCache").addEventListener("click", function () {
    chrome.storage.local.clear(function () {
        document.getElementById("success").style.display = "block";
    });
});

document.getElementById("close").addEventListener("click", function () {
    window.close();
});
