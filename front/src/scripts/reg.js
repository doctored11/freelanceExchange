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
let email;
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
    personName = inputName.value;
    lastName = inputLastName.value;
    pass = inputPass.value;
    email = inputEmail.value;
    const client = flagClient;
    const implementer = !flagClient;

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
//Полетели обрабатывать

const signInBtn = document.querySelector('.signin-btn');
const signUnBtn = document.querySelector('.signup-btn');
const sellerBtn = document.querySelector('.seller-btn');
const coderBtn = document.querySelector('.coder-btn');
let flagLog = true;
let flagClient = true;

const inputName = document.querySelector('#name');
const inputLastName = document.querySelector('#lastname');
const inputEmail = document.querySelector('#email');
const inputPhone = document.querySelector('#phone');
const inputPass = document.querySelector('#password');
const sendBtn = document.querySelector('.registration-form__submit-button');
let pass = '';
let personName = '';
let lastName = '';
let phone = '';

//кнопка что ты регистрируешься
signUnBtn.addEventListener("click", f => {
    if (flagLog) {
        signUnBtn.classList.add('active');
        signInBtn.classList.remove('active');
        let regLabels = document.querySelectorAll('.reg-group')
        regLabels.forEach((element) => element.style.display = 'block');
        flagLog = false;
    }
    checkBtn()
})
//кнопка что ты входишь в систему
signInBtn.addEventListener("click", f => {
    if (!flagLog) {
        signUnBtn.classList.remove('active');
        signInBtn.classList.add('active');
        let regLabels = document.querySelectorAll('.reg-group')
        regLabels.forEach((element) => element.style.display = 'none');
        flagLog = true;
    }
})
//кнопка что ты разработчик
coderBtn.addEventListener("click", f => {
    if (flagClient) {
        sellerBtn.classList.remove('active');
        coderBtn.classList.add('active');
        flagClient = false;
    }
})
//кнопка что ты покупатель
sellerBtn.addEventListener("click", f => {
    if (!flagClient) {
        sellerBtn.classList.add('active');
        coderBtn.classList.remove('active');
        flagClient = true;
    }
})
function checkBtn() {
    personName = inputName.value;
    lastName = inputLastName.value;
    pass = inputPass.value;
    email = inputEmail.value;
    phone = inputPhone.value;
    if ((flagLog && pass.length > 0 && email.length > 0) || (!flagLog && pass.length > 0 && lastName.length > 0 && personName.length > 0 && email.length > 0 && phone.length > 0)) {
        sendBtn.disabled = false;
        sendBtn.classList.add('active');
        // Находим кнопку и назначаем обработчик события на отправку формы
        document.querySelector('.registration-form__submit-button').addEventListener('click', handleFormSubmit);
    }
    else {
        sendBtn.disabled = true;
        sendBtn.classList.remove('active')
        // Находим кнопку и назначаем обработчик события на отправку формы
    }
}
document.querySelector('#registration-form__error').innerText = 'fatal error'; //Текст об ошибке
inputName.addEventListener('input', checkBtn);
inputLastName.addEventListener('input', checkBtn);
inputPass.addEventListener('input', checkBtn);
inputPhone.addEventListener('input', checkBtn);
inputEmail.addEventListener('input', checkBtn);
