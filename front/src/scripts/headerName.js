import { User } from './User.js'
let user = User.load()
if (user != null) {
    document.querySelector('#nav__name').innerText = user.bio;
    console.log(user.id, user.bio)

}
else {
    document.querySelector('#nav__name').setAttribute("href", "./registration.html")
}