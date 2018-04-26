  const filters = document.getElementById('filters');
  function constructFilters() {
      let checked = false;
      for (let phobia of config.phobias) {
        chrome.storage.sync.get(phobia.title, function(data) {
            if (data[phobia.title])
                checked = true;
            else
                checked = false;
            console.log("data");
            console.log(checked);
        });

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
            input.setAttribute('checked', true);
          input.classList.add('filter');
          input.id = phobia.title;

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

    for (let phobia of config.phobias)
    {
        const inputFilter = document.getElementById(phobia.title);
        inputFilter.addEventListener('click', function() {
            let obj = {};
            obj[phobia.title] =  !(inputFilter.getAttribute('checked') == 'true');
            inputFilter.setAttribute('checked', !(inputFilter.getAttribute('checked') == 'true'));
            console.log(obj);
            chrome.storage.sync.set(obj, function() { });

            chrome.storage.sync.get(phobia.title, function(data) {
                console.log(data[phobia.title]);
            });
        });   
    }
    