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
let email_var = 'go';

//кнопка что ты регистрируешься
signUnBtn.addEventListener("click", f => {
    if (flagLog) {
        signUnBtn.classList.add('active');
        signInBtn.classList.remove('active');
        let regLabels = document.querySelectorAll('.reg-group')
        regLabels.forEach((element) => element.style.display = 'block');
        flagLog = false;
    }
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
    if ((flagLog && pass.length > 0 && email.length > 0) || (!flagLog && pass.length > 0 && lastName.length > 0 && personName.length > 0 && email.length > 0)) {
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
