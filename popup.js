  const filters = document.getElementById('filters');
 async function constructFilters() {
      let checked = false;
      for (let phobia of config.phobias) {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                checked = data[phobia.title];
                resolve();
            });
          });

          let result = await promise;

          let filter = document.createElement('tr');
          let firstColumn = document.createElement('td');
          let secondColumn = document.createElement('td');

          let br = document.createElement('br');
          let title = document.createElement('span');
          title.innerText = phobia.title;
          title.classList.add('label');
          title.setAttribute('title', phobia.description);

          let label = document.createElement('label');
          label.classList.add('switch');

          let input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
            if (checked) input.setAttribute('checked', '');
          input.classList.add('filter');
          input.id = phobia.title;
        input.addEventListener('click', function() {
            let obj = {};
            obj[phobia.title] = input.checked;
            chrome.storage.sync.set(obj, function() { });
        });  

          let span = document.createElement('span');
          span.classList.add('slider');
          span.classList.add('round');

          label.appendChild(input);
          label.appendChild(span);

        firstColumn.appendChild(title);
        secondColumn.appendChild(label);

          filter.appendChild(firstColumn);
          filter.appendChild(secondColumn);


          filters.appendChild(filter);
      }
  }
  constructFilters();

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
    