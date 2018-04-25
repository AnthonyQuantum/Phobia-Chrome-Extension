chrome.webNavigation.onDOMContentLoaded.addListener(function() {
  chrome.storage.sync.get('enabled', function(data) {
    if (data.enabled && !data.strictEnabled)
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'const allText = document.all[0].innerText;\
                    if(allText.indexOf("spider") > -1) {\
                      console.log("Blocked!");\
                      const images = document.getElementsByTagName("img");\
                      for (let image of images)\
                      {\
                        image.src = "http://www.htmlcsscolor.com/preview/16x16/CDCDCD.png"\
                      }\
                    }'});
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