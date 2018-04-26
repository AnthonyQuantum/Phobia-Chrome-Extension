  const filters = document.getElementById('filters');
  function constructFilters() {
      let checked = false;
      for (let i = 0; i < config.N; ++i) {
        chrome.storage.sync.get(config.phobias[i].title, function(data) {
            if (data[config.phobias[i].title])
                checked = true;
            else
                checked = false;
        });

          let filter = document.createElement('tr');
          let firstColumn = document.createElement('td');
          let secondColumn = document.createElement('td');

          let br = document.createElement('br');
          let title = document.createElement('span');
          title.innerText = config.phobias[i].title;
          title.classList.add('label');
          title.setAttribute('title', config.phobias[i].description);

          let label = document.createElement('label');
          label.classList.add('switch');

          let input = document.createElement('input');
          input.setAttribute('type', 'checkbox');
          input.setAttribute('checked', checked);
          input.classList.add('filter');

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

    const inputs = document.getElementsByClassName('filter');
    let filterInputs = [];
    for (let item of inputs)
    {
        if (item.id != 'enabled-slider' && item.id != 'strict-slider')
        {
            filterInputs.push(item);
        }
    }
    for (var i = 0; i < config.N; i++)
    {
        filterInputs[i].addEventListener('click', function() {
            let obj = {};
            console.log("read " + i);
            obj[config.phobias[i].description] = !filterInputs[i].getAttribute('checked');
            chrome.storage.sync.set(obj, function() { });
        });            
    }
    