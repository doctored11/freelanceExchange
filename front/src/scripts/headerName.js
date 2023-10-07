import { User } from './User.js'
let user = User.load()
if (document.querySelector('#nav__name') != null) {


    if (user != null) {
        console.log('authorized')
        document.querySelector('#nav__name').innerText = user.bio;
        console.log(user.id, user.bio)

    }
    else {
        document.querySelector('#nav__name').setAttribute("href", "./registration.html")
    }
}
else {
    console.log('noNameInput')
}