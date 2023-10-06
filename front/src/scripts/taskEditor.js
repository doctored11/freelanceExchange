
import {
    createCards,
    renderPeopleCard,
    renderTaskCard
} from './domBuider.js'

import { User } from './User.js';
import { DataManager } from './DataManager.js'


let user = User.load();
import {
    getBasketLocalStorage,
    setLsbyKey,
    getLsbyKey

} from './utils.js'

import {
    getServices

} from './requests.js'
let productsData = [];
let usersData = [];

const container = document.querySelector('.card__container')
const taskForm = document.getElementById("task-form");
// taskForm.classList.add("none")
console.log(taskForm)


//пока без бд
// usersData = getLsbyKey("users")
// productsData = getLsbyKey("services")
const userCount = DataManager.getUsersCount();

// getServices('../data/base.json', usersData)
//     .then(updatedUsersData => {
//         if (usersData.length < 1)
//             usersData = updatedUsersData;
//         setLsbyKey('users', productsData)
//         return getServices('../data/products.json');
//     })
//     .then(updatedProductsData => {
//         if (productsData.length < 1)
//             productsData = updatedProductsData;
//         console.log(productsData);
//         console.log(usersData);
//         setLsbyKey('services', productsData)
//         taskForm.classList.remove("none")

//     });

//--bd
taskForm.classList.remove("none")
//

let cart = getBasketLocalStorage();

const submitButton = document.querySelector('.btn--submit');

console.log("-_-")
console.log(submitButton)
submitButton.addEventListener('click', function (event) {

    console.log('Клик по кнопке btn--submit');
});


taskForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Пошел")

    user = User.load();
    console.log(user)
    user = await DataManager.getUserById(user.id);
    console.log(user)
    user = User.createUserFromObject(user);
    console.log(user)

    const formData = new FormData(taskForm);
    const taskData = {};
    taskData.pendingUsersId = [];

    formData.forEach((value, key) => {
        taskData[key] = value;
    });

    // const allTasks = getLsbyKey('services');
    const tasksCount = await DataManager.getMaxServiceId() + 1;

    taskData.id = tasksCount;
    taskData.owner = user.bio;
    taskData.ownerId = user.id;
    taskData.img = null;
    // пока так
    taskData.type = user.client ? 'order' : 'service';


    console.log("надо думать как это отправить");


    // allTasks.unshift(taskData);



    // const updatedTasksObj = allTasks
    // setLsbyKey('services', updatedTasksObj);



    console.log(user)

    if (user.client) {

        const isFreeze = await user.balance.freeze(taskData.price, user.id);
        user.balanceHistory = isFreeze
        console.log(user)

        if (!isFreeze) {
            console.log('клиент не может создать заказ без активного баланса');
            alert('Недостаточно средств');

            return
        }

        user.listOfOrders.push(taskData.id)

    } else {
        user.listOfServices.push(taskData.id)
    }
    console.log(user)
    user.save();
    user = User.load();
    console.log(user)
    DataManager.updateUserById(user.id, user);
    DataManager.addService(taskData);

});

