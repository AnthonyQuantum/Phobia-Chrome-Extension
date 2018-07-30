// Settting default values on extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enabled: true}, function() {}); // Fast mode enabled by default
  chrome.storage.sync.set({extensionWorking: true}, function() {}); // Extension is active by default
  for (let item of CONFIG.PHOBIAS)
  {
    let obj = {};
    obj[item.title] = true;
    chrome.storage.sync.set(obj, function() {});
  }
});