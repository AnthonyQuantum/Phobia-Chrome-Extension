async function constructFilters() {
    // Get filters div element
    const filters = document.getElementById('filters');

    let checked = false;
    for (let phobia of CONFIG.PHOBIAS) {

        // Checks whether filter is ON
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                checked = data[phobia.title];
                resolve();
            });
        });

        // Wait for promise to complete
        let result = await promise;

        // Generate the options popup
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
    if (data['enabled']) document.getElementById('mode-switcher').setAttribute('checked', '');
});
chrome.storage.sync.get('extensionWorking', function(data) {
    if (data['extensionWorking']) document.getElementById('toggle-switcher').setAttribute('checked', '');
});

// Save value of the checkbox (slider)
const sliderElement1 = document.getElementById('mode-switcher');
sliderElement1.addEventListener('click', function() {
    let obj = {};
    obj['enabled'] = !sliderElement1.hasAttribute('checked');
    chrome.storage.sync.set(obj, function() { });
});
const sliderElement2 = document.getElementById('toggle-switcher');
sliderElement2.addEventListener('click', function() {
    let obj = {};
    obj['extensionWorking'] = !sliderElement2.hasAttribute('checked');
    chrome.storage.sync.set(obj, function() { });
});
