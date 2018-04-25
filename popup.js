  const N = 3;
  const titles = ['Arachnophobia', 'Insectophobia', 'Emetophobia'];
  const descriptions = ['Spiders', 'Insects', 'Vomit'];
  const filters = document.getElementById('filters');
  function constructFilters(titles, descriptions) {
      for (let i = 0; i < N; ++i) {
          let filter = document.createElement('div');
          let br = document.createElement('br');
          let title = document.createElement('span');
          title.innerText = titles[i];
          title.classList.add('label');
          title.setAttribute('title', descriptions[i]);

          let label = document.createElement('label');
          label.classList.add('switch');

          let input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
          input.classList.add('filter');

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
  constructFilters(titles, descriptions);

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
    