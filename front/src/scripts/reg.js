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
    if (sendBtn.disabled) {
        document.querySelector('#registration-form__error').value = 'fatal error'
        // document.querySelector('#registration-form__error').classList.add('registration-form__error'); //Текст об ошибке
        return false //Если кнопка выключена(не введены все данные), то выходим из события
    }
    event.preventDefault();

    if (flagLog) { //если логинимся то то
        //email + pass
    }
    else {// если регистрируемся то то
        //все поля
    }
    // personName = inputName.value;
    // lastName = inputLastName.value;
    // pass = inputPass.value;
    // email = inputEmail.value;
    // const client = flagClient;
    // const implementer = !flagClient;

    // Ваши данные теперь доступны в переменных name, email и roles
    // const id = usersData.length + 1; // когда будет Бд

    const id = usersData.length + Math.floor(Math.random() * 100); //пока так, т.к не добавляю пока в бд пользователя
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;


    const user = new User(id, personName, formattedDate, 0, 0, null, '🤡', client, implementer, [], [])
    user.save();
    setLsbyKey('balanceHistory', []);
    setLsbyKey('basket', []);
    //    отдавать на сервер пользователя



}
