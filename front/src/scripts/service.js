
import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

import {
    createCards,
    renderPeopleCard,
    renderTaskCard
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


