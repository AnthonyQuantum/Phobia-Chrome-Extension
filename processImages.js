var SERVER_URL = CONFIG.AWS_URL;
var BLOCKED_IMAGE_URL = SERVER_URL + 'warning.png';
var LOGO_IMAGE_URL = SERVER_URL + 'logo.png';

// Disable console logging if needed
if (!CONFIG.CONSOLE_LOGGING) console.log = function() {};

// Declare variables
var requestStartTime, requestEndTime, pageProcessingTime;
var allText, filtersStatus, images;

// Reload page (and extension) after every YouTube navigation event
const body = document.getElementsByTagName('body')[0];
body.addEventListener("yt-navigate-finish", function(event) {
    location.reload();
});

processPage(); // main function

function processPage() {
    chrome.storage.sync.get('enabled', function(_a) {
        chrome.storage.sync.get('extensionWorking', function(_b) {
            showHTML();
            if (_b.extensionWorking) {
                if (!_a.enabled) { // Strict mode
                    getFilters(processImages); // Get filter statuses and then process images
                }
                else { // Fast mode
                    showImages();
                    getFilters(processWords); // Get filter statuses and then process words
                }
            }
            else { // extension is OFF
                showImages();
            }
        });
    });
}

async function processWords(filters)
{
    filtersStatus = filters;
    allText = getAllText();

    // Save start time
    var a = performance.now();

    // Start image processing if needed
    if (hasKeywords(filtersStatus, allText.split(' '), CONFIG.SENSITIVITY_FOR_TEXT)) {
        hideImages();
        processImages(filtersStatus);
    } else {
        // Save finish time
        var b = performance.now();
        console.log("One page processed (Processing time: " + (b-a).toFixed(1) + "ms");
        console.log("Processing completed!-----------------------------------------------------------------------------------");
    }
}

async function processImages(filters)
{
    filtersStatus = filters;
    images = getAllImages();

    // Process each image on the page
    for (let image of images)
    {
        // Save start time
        var a = performance.now();

        // Process one image and get its keywords
        var imageKeywords = await processImage(image);

        // Block image if needed
        if (hasKeywords(filtersStatus, imageKeywords.split(' '), CONFIG.SENSITIVITY_FOR_IMAGE))
        {
            // Add "blocked by Phobia" cover
            image.setAttribute('oldSrc', image.getAttribute('src'));
            image.removeAttribute('src');
            image.style.maxHeight = '512px';
            image.style.maxWidth = '512px';
            image.style.background = '#000'
            image.src = BLOCKED_IMAGE_URL;
            image.addEventListener('click', function() {
                image.src = image.getAttribute('oldSrc');
                image.removeAttribute('oldSrc');
            });
        }
        image.style.visibility = 'visible';

        // Save finish time
        var b = performance.now();
        
        // Calculate working time
        console.log("One image processed %c(Processing time: " + (b-a).toFixed(1) + "ms [" + (requestEndTime-requestStartTime).toFixed(1) +"ms for request])", "color: #0000ff");
        console.log("\n");
    }
    console.log("Processing completed!-----------------------------------------------------------------------------------");
}

function processImage(image)
{
    let promise = new Promise((resolve, reject) => {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var responseKeywords = this.responseText.replace(/,/g, '').toLowerCase().replace(/ *\[[^\]]*\] */g, "").replace(/\n/g, " ");
                
                //console.log("%c" + responseKeywords, "color: #0000ff");
                requestEndTime = performance.now();
                resolve(responseKeywords);
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

    return promise;
}

function showHTML() {
    document.getElementsByTagName('html')[0].style.visibility = 'visible';
}

function showImages()
{
    // Make all images visible
    const images = document.getElementsByTagName("img");
    for (let image of images)
    {
        image.style.visibility = 'visible';
    }
}

function hideImages()
{
    // Make all images hidden
    const images = document.getElementsByTagName("img");
    for (let image of images)
    {
        image.style.visibility = 'hidden';
    }
}

// true/false --> ON/OFF
function getStatus(status) {
    if (status)
        return "ON";
    else
        return "OFF";
}

// true/false --> YES/NO
function getDecision(decision) {
    if (decision)
        return "YES";
    else
        return "NO";
}

function getAllText() {
    // Get all text from the page
    var _text = document.body.textContent;

    // Remove special characters and unwanted words
    _text = _text.replace(/ *\{[^}]*\} */g, "").replace(/ *\[[^\]]*\] */g, "").replace(/\.[a-zA-Z]/g, "").replace(/\,[a-zA-Z]/g, "").replace(/[^a-zA-Z ]/g, ' ').replace(/\b[a-zA-Z]{1,2}\b/g, '');
    var unwantedWords = ['function', 'null', 'return', 'prototype', 'void', 'return', 'var', 'not', 'try', 'catch', 'this', 'else', 'new'];
    var regex;
    for (let word of unwantedWords) {
        regex = new RegExp('\\b' + word + '\\b', 'g');
        _text = _text.replace(regex, "");
    }
    _text = _text.replace(/\s\s+/g, ' ').toLowerCase();

    return _text;
}

function getAllImages() {
    return document.getElementsByTagName("img");
}

async function getFilters(callback) {
    var _filters = {};

    // Get filter statuses
    console.log("Filters:--------------------------------");
    for (let phobia of CONFIG.PHOBIAS)
    {
        let filterOn = false;
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                filterOn = data[phobia.title];
                resolve();
            });
        });
        let result = await promise;

        _filters[phobia.title] = filterOn;
        let textColor = filterOn ? "#00ff00" : "#ff0000";
        console.log(phobia.title + " filter | " + "%c" + getStatus(filterOn), "color: " + textColor);
    }
    console.log("----------------------------------------");
    console.log("\n");

    callback(_filters);
}

function hasKeywords(filters, text, sensitivity) {
    var _shouldBlock;

    outer: for (let phobia of CONFIG.PHOBIAS) {
        _shouldBlock = false;

        // If filter is ON, check if page contains any of the keywords
        if (filters[phobia.title]) {
            let keywordsCount = 0;
            let totalKeywordsCount = 0;

            for (let keyword of phobia.keywords) {
                for (let i = 0; i < text.length; ++i) {
                    if (text[i] == keyword) {
                        keywordsCount++;
                        console.log("Found keyword: " + keyword);
                        text[i] = "***"; // Just mock symbol
                        if (keywordsCount >= sensitivity) {
                            totalKeywordsCount += keywordsCount;
                            keywordsCount = 0;
                            break;
                        } 
                    }
                }
                if (totalKeywordsCount >= sensitivity) {
                    _shouldBlock = true;
                    break;
                }
            }
            console.log("Should block: " + getDecision(_shouldBlock)); 
            
            if (_shouldBlock) break outer;
        }
    }

    return _shouldBlock;
}
