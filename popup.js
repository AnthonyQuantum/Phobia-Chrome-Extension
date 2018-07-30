// Builds all filter sliders
async function constructFilters() {
    // Gets target div element
    const filters = document.getElementById('filters');

    let checked = false;
    for (let phobia of CONFIG.PHOBIAS) {
        // Checks whether filter is ON or OFF
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                checked = data[phobia.title];
                resolve();
            });
        });
        let result = await promise;

        // Generates filter sliders HTML
        let filter = document.createElement('tr');
        let firstColumn = document.createElement('td');
        let secondColumn = document.createElement('td');
        let br = document.createElement('br');
        let title = document.createElement('span');
        title.innerText = phobia.title + " (" + phobia.description + ")";
        title.classList.add('label');
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

// Activates main toggle sliders
let sliders = ['enabled', 'extensionWorking'];
for (let slider of sliders) {
    chrome.storage.sync.get(slider, function(data) {
        if (data[slider]) document.getElementById(slider + '-switcher').setAttribute('checked', '');
    });
    let sliderElement = document.getElementById(slider + '-switcher');
    sliderElement.addEventListener('click', function() {
        let obj = {};
        obj[slider] = !sliderElement.hasAttribute('checked');
        chrome.storage.sync.set(obj, function() { });
    });
}
