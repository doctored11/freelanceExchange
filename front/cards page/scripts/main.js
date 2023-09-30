
import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

import{
    createCards
} from './domBuider.js'

import{
    getServices

} from './requests.js'

const container = document.querySelector('.services__list');
const btnShowCards = document.querySelector('.show-cards');
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];
let usersData = [];



getServices('../data/base.json', usersData)
    .then(updatedUsersData => {
        usersData = updatedUsersData;
        return getServices('../data/products.json');
    })
    .then(updatedProductsData => {
        productsData = updatedProductsData;
        console.log(productsData);
        console.log(usersData);
        renderStartPage(productsData, usersData);
    });


btnShowCards.addEventListener('click', sliceArrCards);





function renderStartPage(data) {
    if (!data || !data.length) {
        console.log('пусто ')
        return
    };

    const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
    createCards(container,arrCards,usersData);

    // checkingRelevanceValueBasket(data);

    // const basket = getBasketLocalStorage();
    // checkingActiveButtons(basket);
}

function sliceArrCards() {
    if(shownCards >= productsData.length) return;

    countClickBtnShowCards++;
    const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;

    const arrCards = productsData.slice(shownCards, countShowCards);
    createCards(container,arrCards,usersData);
    shownCards = container.children.length;
    console.log(productsData.length)
    if(countShowCards >= productsData.length) {
        btnShowCards.classList.add('none');
    }
}

