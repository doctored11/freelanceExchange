
import { DataManager } from './DataManager.js';
import { User } from './User.js';
import {
    setLsbyKey,
    getLsbyKey
} from './utils.js';


export async function updateMoneyNowText() {
    if (!moneyNowElement) return

    let user = User.load();

    user = await DataManager.getUserById(user.id);
    user = User.createUserFromObject(user)

    const moneyValue = user.balance.getActiveBalance();

    moneyNowElement.innerText = `${moneyValue} Р`;
    console.log(moneyNowElement)
}


document.addEventListener('DOMContentLoaded', function () {
    updateMoneyNowText();
});

const moneyNowElement = document.querySelector('.moneyNow');
console.log(moneyNowElement)
if (moneyNowElement != null) {
    moneyNowElement.removeAttribute('href');
}
