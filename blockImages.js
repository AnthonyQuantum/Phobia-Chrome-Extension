//document.getElementsByTagName('html')[0].style.visibility = 'hidden';
const allText = document.all[0].innerText; //tolowercase

var isOK;
if(true) //allText.indexOf("spider") > -1
    isOK = false;
else
    isOK = true;

const images = document.getElementsByTagName("img");
for (let image of images)
    {
        if (!isOK)
        {
            image.removeAttribute('src');
            image.style.maxHeight = '512px';
            image.style.maxWidth = '512px';
            image.style.background = '#000'
            image.src = 'https://image.ibb.co/mOVzuH/warning.png';
        }
        image.style.visibility = 'visible';
    }