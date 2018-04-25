chrome.webNavigation.onDOMContentLoaded.addListener(function() {
  chrome.storage.sync.get('enabled', function(data) {
    if (data.enabled)
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'const images = document.getElementsByTagName("img"); for (let image of images) { image.src = "http://www.htmlcsscolor.com/preview/16x16/CDCDCD.png"; }'});
      });
    }
})
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({enabled: true}, function() {});
    chrome.storage.sync.set({strictEnabled: false}, function() {});
    chrome.storage.sync.set({Arachnophobia: true}, function() {});
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {schemes: ['https', 'http']},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  })