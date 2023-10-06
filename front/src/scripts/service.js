
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
renderFormToRateClient(normalId, commentContainer)

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


async function renderFormToRateClient(normalId, container) {
    console.log("Rate_1")
    let user = User.load();
    user = await DataManager.getUserById(user.id);


    if (!user.implementer) return
    console.log("Rate_2")
    user = User.createUserFromObject(user);
    const task = await DataManager.getServiceById(normalId);
    if (task.status != "ready") return
    if (!user.activeTasks) return
    console.log("Rate_3")


    // 

    const normalIdInt = parseInt(normalId, 10);

    if (isNaN(normalIdInt)) {
        console.error('normalId не целое');
    } else {

        const activeTasksInt = user.activeTasks.map(task => parseInt(task, 10));
        console.log(activeTasksInt)
        console.log(normalIdInt)


        if (activeTasksInt.includes(normalIdInt)) {


            let autors = await DataManager.getUsersWithActiveTaskIds(task.id);
            console.log(autors)
            autors = autors.filter((autor) => {
                return autor != user.id;
            });
            let autorId = autors[0];




            createRatingForm(container, autorId);




            console.log(user.activeTasks)
            user.activeTasks = user.activeTasks.filter(task => task != normalId);


            console.log(user.activeTasks)
            console.log(normalId)
            user.saveToServer()

            console.log("Rate_4")
        }
        console.log("Rate_5")
    }

}

function createRatingForm(container, targetId) {
    console.log("Rate_FormCreate")

    const heading = document.createElement('h2');
    heading.textContent = 'Оцените клиента';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '5';

    const button = document.createElement('button');
    button.textContent = 'Отправить';


    button.addEventListener('click', async function () {
        // 



        const inputValue = input.value;
        console.log('Оценка клиента: ' + inputValue);
        addRateToClient(targetId, inputValue).then(button.remove(), input.remove(), heading.remove())
    });


    container.appendChild(heading);
    container.appendChild(input);
    container.appendChild(button);
}

async function addRateToClient(targetId, rate) {
    console.log("_AddRateTarget")

    let user = await DataManager.getUserById(targetId);
    user = User.createUserFromObject(user);

    if (rate) {
        if (user.rate && parseFloat(user.rate) > 0) {
            console.log(user.rate)
            user.rate = (parseFloat(user.rate) + parseFloat(rate)) / 2
            console.log(user.rate)
        } else {
            console.log(user.rate)
            user.rate = rate;
            console.log(user.rate)
        }
    }
    console.log(`💥 клиенту ${user.id} присвоен рейтинг: `, user.rate);
    await user.saveToServer();
    message.textContent = 'Спасибо, оценка будет учтена';
}


