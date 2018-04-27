// Make all images visible
const images = document.getElementsByTagName("img");
for (let image of images)
{
    image.style.visibility = 'visible';
}
const html = document.getElementsByTagName('html')[0].style.visibility = 'visible';