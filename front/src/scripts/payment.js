
import { User } from './User.js';


const user  = new User(999,'Ваня Иванов',"12.12.12",500,1,null,"мое описание", true, false,[],[]);
console.log( user.balance.getBalanceInfo());


document.getElementById('myForm').addEventListener('submit', function (e) {
  e.preventDefault(); 

  
  const numberValue = document.getElementById('numberInput').value;
  const nowBalance =   user.balance.getActiveBalance()
  user.balance.activeBalance = nowBalance + parseInt(numberValue)
  console.log( user.balance.getBalanceInfo());
  user.save();
  const loadedUser = User.load(999);
  console.log(loadedUser)
});