//---scroller-----
let frameImg = document.querySelector('.hero__scroll');
let imagesList = ['./files/logo.png', './files/office.jpeg']
let changeTime = 20000;
setTimeout(() => {
    frameImg.style.opacity = 0;
}, changeTime * (3 / 4))
setInterval(() => {
    frameImg.style.opacity = 1
    setTimeout(() => {
        frameImg.style.opacity = 0;
    }, changeTime * (3 / 4))
    let random = Math.floor(Math.random() * imagesList.length)
    frameImg.src = imagesList[random]
    console.log('change')
}, changeTime)
//----------------
import { User } from './User.js'
let user = User.load()
if (user != null) {
    const id = user.id//надо имя
    document.querySelector('#name').innerText = id;
}
else {
    document.querySelector('#name').setAttribute("href", "./registration.html")
}


