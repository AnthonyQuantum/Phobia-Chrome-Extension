// Settting default values on extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enabled: true}, function() {});
  chrome.storage.sync.set({warningEnabled: false}, function() {});
  for (let item of config.phobias)
  {
    let obj = {};
    obj[item.title] = true;
    chrome.storage.sync.set(obj, function() {});
  }
});