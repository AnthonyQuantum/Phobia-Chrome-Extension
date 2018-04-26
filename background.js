chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enabled: true}, function() {});
  chrome.storage.sync.set({strictEnabled: false}, function() {});
  for (let item of config.phobias)
  {
    let obj = {};
    obj[item.title] = false;
    chrome.storage.sync.set(obj, function() {});
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function() {
  chrome.storage.sync.get('enabled', function(data) {
    if (data.enabled && !data.strictEnabled)
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'blockImages.js'});
      });
    }
    else
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'showImages.js'});
      });
    }
});

chrome.storage.sync.get('strictEnabled', function(data) {
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
});

});