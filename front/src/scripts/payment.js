
import { User } from './User.js';
import { updateMoneyNowText } from './balanceChecker.js'



let user = User.load();
console.log(user.balance.getBalanceInfo());
document.getElementById('myForm').addEventListener('submit', function (e) {
  e.preventDefault();

  user = User.load();
  const numberValue = document.getElementById('numberInput').value;
  const nowBalance = user.balance.getActiveBalance()
  user.balance.activeBalance = nowBalance + parseInt(numberValue)
  console.log(user.balance.getBalanceInfo());
  user.save();
  const loadedUser = User.load();
  updateMoneyNowText()
  console.log(loadedUser)
});