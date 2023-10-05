
import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'
import { updateMoneyNowText } from './balanceChecker.js'
import {
    createCards,
    renderPeopleCard,
    renderTaskCard,
    renderPrivateComment, renderGlobalComment,
    createAcceptRejectButtons
} from './domBuider.js'

import {
    getServices

} from './requests.js'

import { User } from './User.js';
import { DataManager } from './DataManager.js'

let user = User.load();
const profileContainer = document.querySelector('.profile-container');
const caseContainer = document.querySelector('.case-container');
const commentContainer = document.querySelector('.text-container');

// let usersData = [];
// let productsData = [];
const url = new URL(window.location.href);
const idParameter = url.searchParams.get("id");




const parts = idParameter.split("serviceCase");
const normalId = parts[1];

user = User.load();
if (!user) {
    window.location.href = '../registration.html';

}

const task = await DataManager.getServiceById(normalId)
console.log(task)
renderTaskCard(task, caseContainer);

await renderPrivateComment(commentContainer, normalId).then(
    renderGlobalComment(commentContainer, normalId)
)

updateMoneyNowText()

if (user.client && task.status && task.status == "inСonfirm")
    createAcceptRejectButtons(caseContainer, normalId) //из логики что клиент всегда имеет последнее слово 


let owner = await DataManager.getUserById(task.ownerId)
try { renderPeopleCard(owner, profileContainer) } catch { console.error('пока без человека') }





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

