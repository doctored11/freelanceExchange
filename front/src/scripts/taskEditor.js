
import {
    createCards,
    renderPeopleCard,
    renderTaskCard
} from './domBuider.js'

import { User } from './User.js';



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
taskForm.classList.add("none")


//пока без бд
usersData = getLsbyKey("users")
productsData = getLsbyKey("services")

getServices('../data/base.json', usersData)
    .then(updatedUsersData => {
        if (usersData.length < 1)
            usersData = updatedUsersData;
        setLsbyKey('users', productsData)
        return getServices('../data/products.json');
    })
    .then(updatedProductsData => {
        if (productsData.length < 1)
            productsData = updatedProductsData;
        console.log(productsData);
        console.log(usersData);
        setLsbyKey('services', productsData)
        taskForm.classList.remove("none")

    });

let cart = getBasketLocalStorage();



taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    user = User.load();

    const formData = new FormData(taskForm);
    const taskData = {};

    formData.forEach((value, key) => {
        taskData[key] = value;
    });

    const allTasks = getLsbyKey('services');
    taskData.id = allTasks.length + 1;
    taskData.owner = user.bio;
    taskData.ownerId = user.id;
    taskData.img = null;
    // пока так
    taskData.type = user.client ? 'order' : 'service';

   
    console.log("надо думать как это отправить");

   
    allTasks.unshift(taskData);

    const updatedTasksObj = allTasks
    setLsbyKey('services', updatedTasksObj);


    

    if (user.client) {
       user.listOfOrders.push(taskData.id)

    } else {
        user.listOfServices(taskData.id)
    }
    user.save();
    console.log(updatedTasksObj);
});

