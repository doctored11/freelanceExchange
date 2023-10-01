import { User } from './User.js';
import {
    createCards,
    renderTaskCard,
    createCartCards,
    createPersonalProfileCard
} from './domBuider.js'
import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'
import {
    getServices

} from './requests.js'

let user = User.load();

const userContainer = document.querySelector('.container--person');
const tasksContainer = document.querySelector('.container--tasks');
const historyBalanceContainer = document.querySelector('.container--balanceHistory')
const historyTasksContainer = document.querySelector('.container--tasksHistory')

const personImg = document.querySelector('.person-img')



let productsData = [];
let usersData = [];
//пока без бд
usersData = getLsbyKey("users")
productsData = getLsbyKey("services")

getServices('../data/base.json', usersData)
    .then(updatedUsersData => {
        if (usersData.length < 1)
            usersData = updatedUsersData;
        return getServices('../data/products.json');
    })
    .then(updatedProductsData => {
        if (productsData.length < 1)
            productsData = updatedProductsData;
        tasksListRender(tasksContainer) //нужен список активных тасков
        renderBalanceHistory(historyBalanceContainer)


    });


personImg.src = user.img;
createPersonalProfileCard(user, userContainer)


function tasksListRender(container) {

    let list;
    user = User.load();
    let mod;

    if (user.client) {
        list = user.listOfOrders
        mod = "listOfOrders"

    } else {
        list = user.listOfServices
        mod = "listOfServices"
    }

    container.innerHTML = ' '
    const selectPositions = productsData.filter(item => list.includes(item.id));
    selectPositions.forEach(pos => { createCartCards(container, pos, "user", mod) });
}

function renderBalanceHistory(container) {
    user = User.load();
    let list = getLsbyKey('balanceHistory')

    list.forEach(el => {
        const domEl = `
        <div class = "history-block history-block--balance">
        <p class='history-el txt history-el--balance ${el.type} ' > ${el.count}</p>
        <p class='history-date txt history-date--balance ${el.type} ' > ${el.data}</p>
        </div>
        `
        container.innerHTML += domEl;
    })
    console.log(list)


}