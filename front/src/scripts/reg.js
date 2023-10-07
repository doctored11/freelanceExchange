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
    phone = inputPhone.value;
    const client = flagClient;
    const implementer = !flagClient;

    // 
    // const id = usersData.length + 1; // когда будет Бд



    //логика входа
    //в разработке

    const currentURL = window.location.href;


    const lastIndex = currentURL.lastIndexOf("/");


    const resultString = currentURL.substring(0, lastIndex);


    //todo
    // -----!Пока для входа нужно просто ввести id в строку email
    if (flagLog) {
        localStorage.clear();

        let user = await DataManager.getUserById(email)

        user = User.createUserFromObject(user)
        user.save();
        setTimeout(() => { window.location.href = `${resultString}/userPage.html?id=0`; }, 1000);




    } else {

        //логика регистрации
        const id = await DataManager.getMaxUserId() + 1;
        console.log(id)
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;


        const { smiley, color } = getRandomSmileyAndColor();


        const user = new User(id, personName, formattedDate, 0, 0, null, '🤡', client, implementer, [], [], [], [], [], [], 0, phone, email, smiley, color)

        localStorage.clear();

        //сохранение
        DataManager.addUser(user);

        user.save();
        setTimeout(() => { window.location.href = `${resultString}/userPage.html?id=0`; }, 1000);

        user = User.load();







    }






    setLsbyKey('balanceHistory', []);
    setLsbyKey('basket', []);




}

function getRandomSmiley() {
    const smileyArray = ['🤟', '🤑', '🤠', '👽', '👾', '😂', '😜', '😊', '👻', '😎'];
    const randomSmiley = smileyArray[Math.floor(Math.random() * smileyArray.length)];
    return randomSmiley;
}

function getRandomPastelColor() {
    const pastelColors = ['#FFC3A0', '#FF677D', '#d2d04b', '#a6e55e', '#FFD3E0', '#D9DDDC', '#D3CCE3', '#7FABD3', '#FFE0E0', '#F0C6D2'];
    const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    return randomColor;
}

function getRandomSmileyAndColor() {
    const randomSmiley = getRandomSmiley();
    const randomColor = getRandomPastelColor();
    return { smiley: randomSmiley, color: randomColor };
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
    checkBtn();
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
    checkBtn();
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