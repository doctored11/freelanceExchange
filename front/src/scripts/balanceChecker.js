
import { DataManager } from './DataManager.js';
import { User } from './User.js';
import {
    setLsbyKey,
    getLsbyKey
} from './utils.js';


export async function updateMoneyNowText() {
    console.log("деньги")
    const moneyNowElement = document.querySelector('.moneyNow');
    if (!moneyNowElement) return

    let user = User.load();

    user = await DataManager.getUserById(user.id);
    user = User.createUserFromObject(user)
    console.log(user)

    const moneyValue = user.balance.getActiveBalance();

    if (!moneyValue) return
    moneyNowElement.textContent = `Текущий баланс: ${moneyValue}`;
}


document.addEventListener('DOMContentLoaded', function () {

    updateMoneyNowText();
});


// window.addEventListener('storage', () => {
//     // console.log(even)
//     updateMoneyNowText();
//     // if (event.key == 'balance') {
//     //     updateMoneyNowText();
//     // }
// });