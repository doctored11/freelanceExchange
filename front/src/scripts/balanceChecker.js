
import {
    setLsbyKey,
    getLsbyKey

} from './utils.js'

export function updateMoneyNowText() {
    console.log("деньги")
    const moneyNowElement = document.querySelector('.moneyNow');
    const moneyValue = getLsbyKey('balance');
    if (!moneyValue.activeBalance) return
    moneyNowElement.textContent = `Текущий баланс: ${moneyValue.activeBalance}`;
}


updateMoneyNowText();


// window.addEventListener('storage', () => {
//     // console.log(even)
//     updateMoneyNowText();
//     // if (event.key == 'balance') {
//     //     updateMoneyNowText();
//     // }
// });