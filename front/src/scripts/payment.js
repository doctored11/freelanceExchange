
import { User } from './User.js';
import { updateMoneyNowText } from './balanceChecker.js'
import { DataManager } from './DataManager.js'

let user = User.load();
user = await DataManager.getUserById(user.id)  //тут надо максимально актуальную инфу
user = User.createUserFromObject(user);
user.save()
console.log(user.balance.getBalanceInfo());
document.getElementById('myForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  user = User.load();
  user = await DataManager.getUserById(user.id)
  user = User.createUserFromObject(user);
  user.save()

  const numberValue = document.getElementById('numberInput').value;
  const nowBalance = user.balance.getActiveBalance()

  user.balance.activeBalance = nowBalance + parseInt(numberValue)
  console.log(user.balance.getBalanceInfo());

  user.save();
  console.log(user)
  DataManager.updateUserById(user.id, user);

  const loadedUser = User.load();
  updateMoneyNowText()
  console.log(loadedUser)
});



const withdrawalForm = document.getElementById('withdrawalForm');


withdrawalForm.addEventListener('submit', async function (event) {

  event.preventDefault();

  const numberInput = withdrawalForm.querySelector('#numberInput');
  const number = parseFloat(numberInput.value);
  if (number <= 0) return

  user = User.load();
  user = await DataManager.getUserById(user.id)
  user = User.createUserFromObject(user);
  user.save()

  const nowBalance = user.balance.getActiveBalance()
  if (nowBalance < number) return;

  user.balance.activeBalance = nowBalance - parseInt(number)

  user.save();
  console.log(user)
  DataManager.updateUserById(user.id, user);
  const loadedUser = User.load();

  updateMoneyNowText()
  console.log(loadedUser)

});
