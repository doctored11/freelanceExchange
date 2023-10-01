import {
    getServices

} from './requests.js'
import { User } from './User.js';

import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'


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

    });



// желательно кнопку блокировать пока usersData не получен todo
function handleFormSubmit(event) {
    event.preventDefault();


    const form = document.getElementById('registration-form');

    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const roles = Array.from(form.querySelectorAll('.registration-form__role-checkbox'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Ваши данные теперь доступны в переменных name, email и roles




    // const id = usersData.length + 1; // когда будет Бд

    const id = usersData.length +  Math.floor(Math.random() * 100); //пока так, т.к не добавляю пока в бд пользователя
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    // 

    let client, implementer = false;
    if (roles.includes("client")) {
        client = true;
    }

    if (roles.includes("implementer")) {
        implementer = true;
    }
    const user = new User(id, name, formattedDate, 0, 0, null, '🤡', client, implementer, [], [])
    user.save();
    setLsbyKey('balanceHistory', []);
    setLsbyKey('basket', []);
    //    отдавать на сервер пользователя



}

// Находим кнопку и назначаем обработчик события на отправку формы
const submitButton = document.querySelector('.registration-form__submit-button');
submitButton.addEventListener('click', handleFormSubmit);

