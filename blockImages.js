const allText = document.all[0].innerText; //tolowercase
if(true) //allText.indexOf("spider") > -1
{
    console.log("Blocked!");
    const images = document.getElementsByTagName("img");
    for (let image of images)
        {
            image.src = "http://www.htmlcsscolor.com/preview/16x16/CDCDCD.png";
        }
}