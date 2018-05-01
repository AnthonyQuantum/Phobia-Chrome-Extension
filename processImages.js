async function processImages()
{
    // Make all HTML visible
    const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';

    // Get all text and images from the current page
    const allText = document.all[0].innerText.toLowerCase();
    const images = document.getElementsByTagName("img");

    // Set initial values
    let filterOn = false;
    let shouldBlock = false;

    // Perform the analysis for each phobia in the list
    for (let phobia of config.phobias)
    {
        // Checks whether filter is ON
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                filterOn = data[phobia.title];
                resolve();
            });
        });

        // Wait for promise to complete
        let result = await promise;
        console.log("Filter is " + filterOn);

        // If filter is ON, check whether page contains any of the keywords
        if (filterOn)
        {
            let numb = 0;
            for (let keyword of phobia.keywords)
            {
                while(allText.indexOf(keyword) != -1)
                {
                    console.log("Found keyword: " + keyword);
                    numb++;
                    allText[allText.indexOf(keyword)] = "1";
                    if (numb > 5) break;
                }
            }
            if (numb > 5) shouldBlock = true;
            
            console.log("Found " + numb + " items"); 
            console.log("Should block: " + shouldBlock);  
        }

        // Block all images if needed
        for (let image of images)
        {
            if (shouldBlock)
            {
                image.removeAttribute('src');
                image.style.maxHeight = '512px';
                image.style.maxWidth = '512px';
                image.style.background = '#000'
                image.src = 'https://image.ibb.co/mOVzuH/warning.png';
            }
            image.style.visibility = 'visible';
        }

        // If images were blocked, stop the loop
        if (shouldBlock) break;
    }
    console.log("Blocking completed!-------------------------------------------------");
}

function processImage(image)
{
    // Save start time
    var a = performance.now();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Got response:");
            console.log(this.responseText);

            // Save finish time
            var b = performance.now();

            // Calculate working time
            console.log('Working time: ' + (b-a) + ' ms.');
            
            return this.responseText;
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
    console.log("Request sent");
}

function testServer() {

    const images = document.getElementsByTagName("img");
    const oneImage = images[5];
    processImage(oneImage);
}
testServer();

//blockImages();