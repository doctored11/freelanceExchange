//---scroller-----
let frameImg = document.querySelector('.hero__scroll');
// let imagesList = ['./files/logo.png', './files/office.jpeg']
let changeTime = 20000;
setTimeout(() => {
    frameImg.style.opacity = 0;
}, changeTime * (3 / 4))
setInterval(() => {
    frameImg.style.opacity = 1
    setTimeout(() => {
        frameImg.style.opacity = 0;
    }, changeTime * (3 / 4))
    frameImg.style.filter = `invert(${Math.random() * 100}%),brightness(${Math.random()}),contrast(${Math.random() * 100}%),grayscale(${Math.random() * 100}%),saturate(${Math.random() * 100}%),sepia(${Math.random() * 100}%)`
    console.log('change')
}, changeTime)
//----------------


