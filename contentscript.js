chrome.runtime.sendMessage({
    typo3: document.head.innerHTML.indexOf("This website is powered by TYPO3") !== -1,
    url: window.location.protocol + "//" + window.location.host
});
