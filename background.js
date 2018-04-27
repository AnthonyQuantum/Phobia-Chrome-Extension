// Settting default values on extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enabled: true}, function() {});
  chrome.storage.sync.set({strictEnabled: false}, function() {});
  for (let item of config.phobias)
  {
    let obj = {};
    obj[item.title] = true;
    chrome.storage.sync.set(obj, function() {});
  }
});

// If extension is enabled, run blockImages.js content script
chrome.webNavigation.onBeforeNavigate.addListener(function() {
  chrome.storage.sync.get('enabled', function(data) {
    if (data.enabled)
    {
      // Load data from config.js
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'config.js'});
      });
      // Execute script for analyzing images and then blocking if needed
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'blockImages.js'});
      });
    }
    else
    {
      // Execute script for just showing images
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'showImages.js'});
      });
    }
});

// DEV for "strict" mode
/*chrome.storage.sync.get('strictEnabled', function(data) {
  if (data.strictEnabled)
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'let html = document.getElementsByTagName("html")[0];\
                    console.log("OK");\
                    let warn = document.createElement("div");\
                    warn.innerHTML = "<br><h2>Phobia</h2><br><h2>Warning! This content might be unpleasant for you.</h2>";\
                    html.appendChild(warn);\
                    document.getElementsByTagName("body")[0].style.display = "none";'});
      });
    }
});*/

});