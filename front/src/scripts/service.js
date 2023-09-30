
import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

import {
    createCards
} from './domBuider.js'

import {
    getServices

} from './requests.js'

const profileContainer = document.querySelector('.profile-container');
const caseContainer = document.querySelector('.case-container');

let usersData = [];
let productsData = [];
const url = new URL(window.location.href);
const idParameter = url.searchParams.get("id");

getServices('../data/products.json', productsData)
    .then(updatedProductsData => {
        productsData = updatedProductsData;
        const parts = idParameter.split("serviceCase");
        const normalId = parts[1];
        const task = productsData.find(task => task.id == normalId);
        renderTaskCard(task, caseContainer)
        const ownerId = task.owner

        return Promise.all([getServices('../data/base.json'), ownerId]);
    })
    .then(([updatedUsersData, ownerId]) => {
        console.log(ownerId)

        usersData = updatedUsersData;
        const owner = usersData.find(user => user.id == ownerId);
        renderPeopleCard(owner, profileContainer)
    })
    .then(() => {
        console.log(usersData);
    });



function renderPeopleCard(data, container) {
    const { id, img, date, bio, descr, listOfServices } = data;
    const cardItem =
        `
                <div class="card profile-card" data-product-id="${id}">
                    <div class="card__top profile-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image profile-card__image ">
                            <img class=" img card__img --test-get-img"
                                src="${img}"
                                alt="${bio}"
                            />
                        </a>
                        <div class="card__label profile-card__label">-${date}%</div>
                    </div>
                    <div class="card__bottom profile-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading profile-card__heading">${bio}</div>
                            <div class="card__descr ">${descr}</div>
                        </div>
                        
                       
                    </div>
                </div>
            `
    container.insertAdjacentHTML('beforeend', cardItem);

}

function renderTaskCard(data, container) {

    const { id, img, title, price, descr, timing, owner } = data;
    const cardItem =
        `
                <div class="card task-card" data-product-id="${id}">
                    <div class="card__top task-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image task-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label task-card__label">-${timing}%</div>
                    </div>
                    <div class="card__bottom task-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading task-card__heading">${title}</div>
                            <div class="card__descr ">${descr}</div>
                        </div>
                        <div class="card__price ">
                            <p class="card__price txt task-card__txt">${price}</p>
                           
                        </div>
                        
                        <button class="card__add">В корзину</button>
                    </div>
                </div>
            `
    container.insertAdjacentHTML('beforeend', cardItem);

}