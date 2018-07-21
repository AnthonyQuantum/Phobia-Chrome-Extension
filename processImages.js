var SERVER_URL = CONFIG.LOCAL_URL;
var BLOCKED_IMAGE_URL = SERVER_URL + 'warning.png';
var LOGO_IMAGE_URL = SERVER_URL + 'logo.png';

if (!CONFIG.CONSOLE_LOGGING) console.log = function() {};

var requestStartTime, requestEndTime;

async function processImages()
{
    // Make all HTML visible
    const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';

    // Get all images from the current page
    const images = document.getElementsByTagName("img");

    // Set initial values
    let filterOn = false;
    let shouldBlock = false;

    // Checks which filters are ON
    let filtersStatus = {};
    console.log("Filters:--------------------------------");
    for (let phobia of CONFIG.PHOBIAS)
    {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                filterOn = data[phobia.title];
                resolve();
            });
        });

        // Wait for promise to complete
        let result = await promise;
        filtersStatus[phobia.title] = filterOn;
        let textColor = filterOn ? "#00ff00" : "#ff0000";
        console.log(phobia.title + " filter | " + "%c" + getStatus(filterOn), "color: " + textColor);
    }
    console.log("----------------------------------------");
    console.log("\n");

    // Process each image on the page
    for (let oneImage of images)
    {
        // Save start time
        var a = performance.now();

        shouldBlock = false;
        let imageKeywords;

        let processPromise = new Promise(async function func(resolve, reject)  {
            imageKeywords = await processImage(oneImage);
            resolve();
        });

        let processResult = await processPromise;

        outer: for (let phobia of CONFIG.PHOBIAS)
        {
            // If filter is ON, check whether page contains any of the keywords
            if (filtersStatus[phobia.title])
            {
                let numb = 0;
                for (let keyword of phobia.keywords)
                {
                    var regex = new RegExp('\\b' + keyword + '\\b');
                    while(imageKeywords.search(regex) != -1)
                    {
                        //console.log("Found keyword: " + keyword);
                        numb++;
                        imageKeywords[imageKeywords.search(regex)] = "1";
                        if (numb > CONFIG.SENSITIVITY_FOR_IMAGE) break;
                    }
                }
                if (numb > CONFIG.SENSITIVITY_FOR_IMAGE) shouldBlock = true;
            
                //console.log("Found " + numb + " items");
                let blockDecision = shouldBlock ? "YES" : "NO";
                console.log("Should block: " + blockDecision);  
            }
            
            // Block image if needed
            if (shouldBlock)
            {
                oneImage.setAttribute('oldSrc', oneImage.getAttribute('src'));
                oneImage.removeAttribute('src');
                oneImage.style.maxHeight = '512px';
                oneImage.style.maxWidth = '512px';
                oneImage.style.background = '#000'
                oneImage.src = BLOCKED_IMAGE_URL;
                oneImage.addEventListener('click', function() {
                    oneImage.src = oneImage.getAttribute('oldSrc');
                    oneImage.removeAttribute('oldSrc');
                });
            }
            oneImage.style.visibility = 'visible';
            
            // If image was blocked, stop the loop
            if (shouldBlock) break outer;
        }

        // Save finish time
        var b = performance.now();
        
        // Calculate working time
        console.log("One image processed %c(Processing time: " + (b-a).toFixed(1) + "ms [" + (requestEndTime-requestStartTime).toFixed(1) +"ms for request])", "color: #0000ff");
        console.log("\n");
    }
    console.log("Processing completed!-----------------------------------------------------------------------------------");
}

async function processImage(image)
{
    let imageText;

    let imagePromise = new Promise((resolve, reject) => {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let words = this.responseText.replace(/,/g, '').toLowerCase();

                requestEndTime = performance.now();
                let telemetryStartIndex = words.indexOf("[");
                console.log("%c" + words.substring(telemetryStartIndex), "color: #0000ff");
                words = words.split(0, telemetryStartIndex);

                imageText =  this.responseText;
                resolve();
            }
        };

        const prefix = image.src.slice(0,4);

        if (prefix == "http") // Absolute adress
        {
            xhttp.open("GET", SERVER_URL + "?q=" + image.src + "&t=absolute", true);
            xhttp.send();
        }
        else if (prefix == "data") // Base64 encoded
        {
            var path = SERVER_URL + "?t=base64";
            var data = JSON.stringify({image: image.src});
            xhttp.open("POST", path, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(data);
        }
        else // Relative adress and other types
        {
            xhttp.open("GET", SERVER_URL + "?q=" + window.location.href + "/" + image.src + "&t=relative", true);
            xhttp.send();
        }
        console.log("Sent request to the server --->");

        requestStartTime = performance.now();
    });
    
    let processImageResult = await imagePromise;
    return imageText;
}

function showImages()
{
    // Make all images visible
    const images = document.getElementsByTagName("img");
    for (let image of images)
    {
        image.style.visibility = 'visible';
    }
    //const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';
}

async function processWords()
{
    // Get all text from the page
    var allText = document.body.textContent;
    // Replace all special characters with space
    allText = allText.replace(/[^a-zA-Z ]/g, ' ');

    // Set initial values
    let filterOn = false;
    let shouldBlock = false;

    // Checks which filters are ON
    let filtersStatus = {};
    console.log("Filters:--------------------------------");
    for (let phobia of CONFIG.PHOBIAS)
    {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                filterOn = data[phobia.title];
                resolve();
            });
        });
    
        // Wait for promise to complete
        let result = await promise;
        filtersStatus[phobia.title] = filterOn;
        console.log(phobia.title + " filter is " + filterOn);
    }
    console.log("----------------------------------------");
    console.log("\n");

    // Save start time
    var a = performance.now();

    outer: for (let phobia of CONFIG.PHOBIAS)
    {
        shouldBlock = false;

        // If filter is ON, check whether page contains any of the keywords
        if (filtersStatus[phobia.title])
        {
            let numb = 0;
            for (let keyword of phobia.keywords)
            {
                var regex = new RegExp('\\b' + keyword + '\\b');
                while(allText.search(regex) != -1)
                {
                    //console.log("Found keyword: " + keyword);
                    numb++;
                    allText[allText.search(regex)] = "1";
                    if (numb > CONFIG.SENSITIVITY_FOR_TEXT) break;
                }
            }
            if (numb > CONFIG.SENSITIVITY_FOR_IMAGE) shouldBlock = true;
        
            //console.log("Found " + numb + " items"); 
            let blockDecision = shouldBlock ? "YES" : "NO";
            console.log("Should block: " + blockDecision); 
            
            if (shouldBlock) break outer;
        }

    }

    // Show warning if needed
    if (shouldBlock)
    {
        var html = document.getElementsByTagName('html')[0];
        html.style.background = '#01796f';

        var title = document.createElement('p');
        title.innerText = 'Blocked by Phobia';
        title.style.top = '0px';

        var logo = document.createElement('img');
        logo.src = LOGO_IMAGE_URL;
        logo.style.top = '100px';

        var description = document.createElement('p');
        description.innerText = 'This page may contain something nasty';
        description.style.top = '200px';

        var showButton = document.createElement('button');
        showButton.innerText = 'I understand, show anyway';
        showButton.style.background = 'white';
        showButton.style.border = '0';
        showButton.style.padding = '10px';
        showButton.style.top = '300px';

        var elements = [title, logo, description, showButton];

        showButton.addEventListener('click', function() {
            // Make all HTML visible
            html.style.visibility = 'visible';
            html.style.removeProperty('background', '#01796f');
            showImages();

            for (let item of elements) item.style.visibility = 'hidden';
        });

        var textElements = [title, description];
        for (let item of textElements)
        {
            item.style.color = 'white';
            item.style.fontSize = '3em';
        }

        for (let item of elements)
        {
            item.style.position = 'absolute';
            item.style.visibility = 'visible';
            item.style.left = '50%';
            item.style.transform = 'translate(-50%, 0)';
            html.appendChild(item);
        }

    }
    else
    {
        // Make all HTML visible
        document.getElementsByTagName('html')[0].style.visibility = 'visible';
        showImages();
    }
    
    // Save finish time
    var b = performance.now();
    // Calculate working time
    console.log("One page processed (Processing time: " + (b-a).toFixed(1) + "ms");
    console.log("Processing completed!-----------------------------------------------------------------------------------");
}

chrome.storage.sync.get('enabled', function(dataEnabled) {
    chrome.storage.sync.get('warningEnabled', function(dataWarningEnabled) {
        if (dataWarningEnabled.warningEnabled)
        {
            processWords();
        }
        else
        {
            if (dataEnabled.enabled)
                processImages();
            else
            {
                showImages();
                const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';
            }
        }
    });
});

function getStatus(status) {
    if (status)
        return "ON";
    else
        return "OFF";
}
