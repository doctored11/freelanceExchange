
import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

import { DataManager } from './DataManager.js';
import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'

import {
    createCards
} from './domBuider.js'
import{updateMoneyNowText} from './balanceChecker.js'
import {
    getServices

} from './requests.js'


const container = document.querySelector('.services__list');
const btnShowCards = document.querySelector('.show-cards');
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];
let usersData = [];


//получаем времеенно ид json фалйа
// getServices('../data/base.json', usersData)
//     .then(updatedUsersData => {
//         usersData = updatedUsersData;
//         setLsbyKey('users', usersData)
//         return getServices('../data/products.json');
//     })
//     .then(updatedProductsData => {
//         productsData = updatedProductsData;
//         console.log(productsData);
//         console.log(usersData);

//         // Временно пока нет данных ( отрисовка из LS) !!!
//         let buffer = getLsbyKey('services');
//         console.log(buffer)
//         if (productsData.length > buffer.length) { setLsbyKey('services', productsData) } else {
//             productsData = buffer;
//         }
//         // -------------
//         renderStartPage(productsData, usersData);
//     });
productsData= await DataManager.getServicesInRange(0,2); //подумать тут)
console.log(productsData)
renderStartPage( productsData);
updateMoneyNowText()

btnShowCards.addEventListener('click', sliceArrCards);





function renderStartPage( serviceData) {
    if (!serviceData || !serviceData.length) {
        console.log('пусто ')
        return
    };

   
   
    createCards(container, serviceData);

}

function sliceArrCards() {
    if (shownCards >= productsData.length) return;

    countClickBtnShowCards++;
    const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;

    const arrCards = productsData.slice(shownCards, countShowCards);
    createCards(container, arrCards, usersData);
    shownCards = container.children.length;
    console.log(productsData.length)
    if (countShowCards >= productsData.length) {
        btnShowCards.classList.add('none');
    }
}

