import {
    getServices

} from './requests.js'
import { User } from './User.js';

import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'

import { DataManager } from './DataManager.js'


let productsData = [];
let usersData = [];


// getServices('../data/base.json', usersData)
//     .then(updatedUsersData => {
//         usersData = updatedUsersData;
//         return getServices('../data/products.json');
//     })
//     .then(updatedProductsData => {
//         productsData = updatedProductsData;
//         console.log(productsData);
//         console.log(usersData);

//     });



// желательно кнопку блокировать пока usersData не получен todo
let email;
async function handleFormSubmit(event) {
    if (sendBtn.disabled) {
        document.querySelector('#registration-form__error').value = 'fatal error'
        // document.querySelector('#registration-form__error').classList.add('registration-form__error'); //Текст об ошибке
        return false //Если кнопка выключена(не введены все данные), то выходим из события
    }
    event.preventDefault();




    personName = inputName.value;
    lastName = inputLastName.value;
    pass = inputPass.value;
    email = inputEmail.value;
    const client = flagClient;
    const implementer = !flagClient;

    // 
    // const id = usersData.length + 1; // когда будет Бд



    //логика входа
    //в разработке


    //todo
    // -----!Пока для входа нужно просто ввести id в строку имени
    if (flagLog) {

        let user = await DataManager.getUserById(personName)

        user = User.createUserFromObject(user)
        user.save();

    } else {

        //логика регистрации
        const id = await DataManager.getMaxUserId() + 1;
        console.log(id)
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;


        const user = new User(id, personName, formattedDate, 0, 0, null, '🤡', client, implementer, [], [])

        //сохранение
        DataManager.addUser(user);
        user.save();
        user = User.load();

    }






    setLsbyKey('balanceHistory', []);
    setLsbyKey('basket', []);




}




//todo 
//Визуал⬇ ? если возможно в отдельный скрипт


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
const inputPass = document.querySelector('#password');
const sendBtn = document.querySelector('.registration-form__submit-button');
let pass = '';
let personName = '';
let lastName = '';

//кнопка что ты регистрируешься
signUnBtn.addEventListener("click", f => {
    if (flagLog) {
        signUnBtn.classList.add('active');
        signInBtn.classList.remove('active');
        flagLog = false;
    }
})
//кнопка что ты входишь в систему
signInBtn.addEventListener("click", f => {
    if (!flagLog) {
        signUnBtn.classList.remove('active');
        signInBtn.classList.add('active');
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
    if (pass.length > 0 && lastName.length > 0 && personName.length > 0 && email.length > 0) {
        sendBtn.disabled = false;
        sendBtn.classList.add('active');
        // Находим кнопку и назначаем обработчик события на отправку формы
        document.querySelector('.registration-form__submit-button').addEventListener('click', handleFormSubmit);
    }
    else {
        sendBtn.disabled = true;
        sendBtn.classList.remove('active')
        // Находим кнопку и назначаем обработчик события на отправку формы
        document.querySelector('.registration-form__submit-button').removeEventListener('click');
    }
}
document.querySelector('#registration-form__error').innerText = 'fatal error'; //Текст об ошибке
inputName.addEventListener('input', checkBtn);
inputLastName.addEventListener('input', checkBtn);
inputPass.addEventListener('input', checkBtn);



