
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
const taskForm = document.getElementById("task-form");
taskForm.classList.add("none")

getServices('../data/base.json', usersData)
    .then(updatedUsersData => {
        usersData = updatedUsersData;
        return getServices('../data/products.json');
    })
    .then(updatedProductsData => {
        productsData = updatedProductsData;
        console.log(productsData);
        console.log(usersData);
        taskForm.classList.remove("none")

    });

    let cart = getBasketLocalStorage();


  
    taskForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(taskForm);
      const taskData = {};
  
      formData.forEach((value, key) => {
        taskData[key] = value;
      });
  
      
      taskData.id = productsData.length; 
      taskData.owner = null; 
      taskData.img = null; 
      taskData.descr = ""; 
  
      // Теперь объект taskData содержит данные из формы в нужном формате
      console.log("надо думать как это отправить");
      console.log(JSON.stringify(taskData, null, 2));
    });

  