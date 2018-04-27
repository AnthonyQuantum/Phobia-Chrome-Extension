async function blockImages()
{
    const allText = document.all[0].innerText.toLowerCase();
    const images = document.getElementsByTagName("img");
    let filterOn = false;
    let shouldBlock = false;
    for (let phobia of config.phobias)
    {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get(phobia.title, function(data) {
                filterOn = data[phobia.title];
                resolve();
            });
        });

        let result = await promise;
        console.log("Filter is " + filterOn);

        if (filterOn)
        {
            for (let keyword of phobia.keywords)
            {
                if (allText.indexOf(keyword) > -1)
                {
                    shouldBlock = true;
                    break;
                }
            
            }
            console.log("Should block: " + shouldBlock);   
        }

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

        shouldBlock = false;
    }
    console.log("Blocking completed!-------------------------------------------------");
}
blockImages();