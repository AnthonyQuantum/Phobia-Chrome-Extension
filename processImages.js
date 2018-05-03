async function processImages() //https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif
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
    for (let phobia of config.phobias)
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

        for (let phobia of config.phobias)
        {
            // If filter is ON, check whether page contains any of the keywords
            if (filtersStatus[phobia.title])
            {
                let numb = 0;
                for (let keyword of phobia.keywords)
                {
                    while(imageKeywords.indexOf(keyword) != -1)
                    {
                        console.log("Found keyword: " + keyword);
                        numb++;
                        imageKeywords[imageKeywords.indexOf(keyword)] = "1";
                        if (numb > 2) break;
                    }
                }
                if (numb > 2) shouldBlock = true;
            
                console.log("Found " + numb + " items"); 
                console.log("Should block: " + shouldBlock);
                console.log("\n");  
            }
            
            // Block image if needed
            if (shouldBlock)
            {
                oneImage.removeAttribute('src');
                oneImage.style.maxHeight = '512px';
                oneImage.style.maxWidth = '512px';
                oneImage.style.background = '#000'
                oneImage.src = 'https://image.ibb.co/mOVzuH/warning.png';
            }
            oneImage.style.visibility = 'visible';
            
            // If image was blocked, stop the loop
            if (shouldBlock) break;
        }

        // Save finish time
        var b = performance.now();
        
        // Calculate working time
        console.log("One image processed (Processing time: " + (b-a) + "ms)");
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

                console.log(words);

                imageText =  this.responseText;
                resolve();
            }
        };

        const prefix = image.src.slice(0,4);

        if (prefix == "http") // Absolute adress
        {
            xhttp.open("GET", "http://localhost:5000/?q=" + image.src + "&t=absolute", true);
            xhttp.send();
        }
        else if (prefix == "data") // Base64 encoded
        {
            var path = "http://localhost:5000/?t=base64";
            var data = JSON.stringify({image: image.src});
            xhttp.open("POST", path, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(data);
        }
        else // Relative adress and other types
        {
            xhttp.open("GET", "http://localhost:5000/?q=" + window.location.href + "/" + image.src + "&t=relative", true);
            xhttp.send();
        }
        console.log("Request sent --->");
    });
    
    let processImageResult = await imagePromise;
    return imageText;
}

function showImages()
{
    // Make all images visible
    console.log("Phobia is disabled");
    const images = document.getElementsByTagName("img");
    for (let image of images)
    {
        image.style.visibility = 'visible';
    }
    const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';
}

chrome.storage.sync.get('enabled', function(data) {
    if (data.enabled)
    {
        processImages();
    }
    else
    {
        showImages();
    }
});