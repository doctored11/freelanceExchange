
import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'
import { updateMoneyNowText } from './balanceChecker.js'
import {
    createCards,
    renderPeopleCard,
    renderTaskCard
} from './domBuider.js'

import {
    getServices

} from './requests.js'

import { User } from './User.js';
import { DataManager } from './DataManager.js'

let user = User.load();
const profileContainer = document.querySelector('.profile-container');
const caseContainer = document.querySelector('.case-container');

// let usersData = [];
// let productsData = [];
const url = new URL(window.location.href);
const idParameter = url.searchParams.get("id");

//пока без бд
// usersData = getLsbyKey("users")
// productsData = getLsbyKey("services")

// getServices('../data/products.json', productsData)
//     .then(updatedProductsData => {
//         console.log(productsData);

//         console.log(productsData, updatedProductsData)
//         if (productsData.length < 1)
//             productsData = updatedProductsData;
//         const parts = idParameter.split("serviceCase");
//         const normalId = parts[1];

//         setLsbyKey('services', productsData)

//         const task = productsData.find(task => task.id == normalId);
//         renderTaskCard(task, caseContainer)
//         const ownerId = task.ownerId

//         return Promise.all([getServices('../data/base.json'), ownerId]);
//     })
//     .then(([updatedUsersData, ownerId]) => {

//         if (usersData.length < 1)
//             usersData = updatedUsersData;
//         setLsbyKey('users', usersData)
//         console.log(ownerId)
//         const owner = usersData.find(user => user.id == ownerId);
//         try { renderPeopleCard(owner, profileContainer) } catch { console.error('пока без человека') }
//     })
//     .then(() => {
//         user = User.load();

//         const elements = document.querySelectorAll('.--for-client-only');
//         const isClient = user.client;
//         console.log(isClient)
//         if (!isClient) {
//             elements.forEach(element => {
//                 element.classList.add('none');
//             });
//         }

//         const implementerElements = document.querySelectorAll('.--for-implementer-only');
//         const isImplementer = user.implementer;
//         console.log(isImplementer)
//         if (!isImplementer) {
//             implementerElements.forEach(element => {
//                 element.classList.add('none');
//             });
//         }

//     });



const parts = idParameter.split("serviceCase");
const normalId = parts[1];

const task = await DataManager.getServiceById(normalId)
console.log(task)
renderTaskCard(task, caseContainer)
let owner = await DataManager.getUserById(task.ownerId)
try { renderPeopleCard(owner, profileContainer) } catch { console.error('пока без человека') }


user = User.load();
if (!user) {
    window.location.href = '../registration.html';

}


const elements = document.querySelectorAll('.--for-client-only');
const isClient = user.client;
console.log(isClient)
if (!isClient) {
    elements.forEach(element => {
        element.classList.add('none');
    });
}

const implementerElements = document.querySelectorAll('.--for-implementer-only');
const isImplementer = user.implementer;
console.log(isImplementer)
if (!isImplementer) {
    implementerElements.forEach(element => {
        element.classList.add('none');
    });
}