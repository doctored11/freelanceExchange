
import {
    createCards,
    renderPeopleCard,
    renderTaskCard
} from './domBuider.js'

import {
    getBasketLocalStorage,
    setBasketLocalStorage,
    checkingRelevanceValueBasket,
    removeFromBasket

} from './utils.js'

import {
    getServices

} from './requests.js'
let productsData = [];
let usersData = [];

const container = document.querySelector('.card__container')

getServices('../data/base.json', usersData)
    .then(updatedUsersData => {
        usersData = updatedUsersData;
        return getServices('../data/products.json');
    })
    .then(updatedProductsData => {
        productsData = updatedProductsData;
        console.log(productsData);
        console.log(usersData);
        cartRender(container);
    });

let cart = getBasketLocalStorage();



function cartRender(container) {
    console.log('cartRender')
    container.innerHTML = ' '
    console.log(cart);
    const selectPositions = productsData.filter(item => cart.includes(item.id));

    selectPositions.forEach(pos => { createCartCards(container, pos) });

}

export function createCartCards(container, data) {

    console.log(data.id)
    const { id, img, title, price, descr, timing, owner } = data;

    const cardItem =
        `
                <div class="card cart-card" data-product-id="${id}">
                    <div class="card__top cart-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image cart-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label cart-card__label">-${timing}</div>
                    </div>
                    <div class="card__bottom cart-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading cart-card__heading">${title}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__title cart-card__title">${title}</a>
                        <button class="card__add" data-id="${id}">удалить</button>
                    </div>
                </div>
            `


    container.insertAdjacentHTML('beforeend', cardItem);

    const btn = container.querySelector(`[data-id="${id}"]`);
    btn.addEventListener('click', () => deleteFromCart(id));

}
function deleteFromCart(id) {

    cart = getBasketLocalStorage();
    console.log(cart)
    console.log(id)

    if (cart.includes(id)) {
        removeFromBasket(id);

    };

    cart = getBasketLocalStorage();
    cartRender(container);

}