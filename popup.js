  const titles = ['Arachnophobia', 'Insectophobia', 'Emetophobia'];
  const filters = document.getElementById('filters');
  function constructFilters(titles) {
      for (let item of titles) {
          let filter = document.createElement('div');
          let br = document.createElement('br');
          let title = document.createElement('span');
          title.innerText = item;
          title.classList.add('label');

          let label = document.createElement('label');
          label.classList.add('switch');

          let input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
          let span = document.createElement('span');
          span.classList.add('slider');
          span.classList.add('round');

          label.appendChild(input);
          label.appendChild(span);

          filter.appendChild(title);
          filter.appendChild(label);
          filter.appendChild(br);

          filters.appendChild(filter);
      }
  }
  constructFilters(titles);

    /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'const images = document.getElementsByTagName("img"); for (let image of images) { image.src = "http://www.solidbackgrounds.com/images/2560x1440/2560x1440-gray-solid-color-background.jpg"; }'});
    });*/

    chrome.storage.sync.get('enabled', function(data) {
        if (data.enabled)
            document.getElementById('enabled-slider').setAttribute('checked', true);
    });
    chrome.storage.sync.get('strictEnabled', function(data) {
        if (data.strictEnabled)
            document.getElementById('strict-slider').setAttribute('checked', true);
    });

    const enabledSlider = document.getElementById('enabled-slider');
    enabledSlider.addEventListener('click', function() {
        chrome.storage.sync.set({enabled: !enabledSlider.getAttribute('checked')}, 
        function() { });
    });
    const strictSlider = document.getElementById('strict-slider');
    strictSlider.addEventListener('click', function() {
        chrome.storage.sync.set({strictEnabled: !strictSlider.getAttribute('checked')}, 
        function() { });
    });