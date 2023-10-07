
import {
  setLsbyKey,
  getLsbyKey

} from './utils.js'

import { DataManager } from './DataManager.js';

import { User } from './User.js';

export class Balance {
  #activeBalance = 0;
  #frozenBalance = 0;

  constructor(initialActiveBalance = 0, initialfrozen = 0) {
    this.#activeBalance = initialActiveBalance;
    this.#frozenBalance = initialfrozen;
  }


  async freeze(amountToFreeze, userId) {
    console.log("---");
    console.log(amountToFreeze);
    console.log(this.#activeBalance);
    amountToFreeze = parseFloat(amountToFreeze)
    if (amountToFreeze > this.#activeBalance) {
      console.error('Недостаточно средств на активном балансе.');
      return false;
    }

    this.#activeBalance = parseFloat(this.#activeBalance) - amountToFreeze;
    this.#frozenBalance = parseFloat(this.#frozenBalance) + amountToFreeze;
    console.log(`Заморожено ${amountToFreeze} на балансе.`);

    console.log(`акстивныйбаланс = ${this.#activeBalance} `);

    const balanceStep = {
      data: new Date() + " ",
      count: amountToFreeze,
      type: 'freeze'
    }

    // const history = await Balance.addHistory(balanceStep, userId);



    // let us = await DataManager.getUserById(userId);
    // us.balanceHistory = history;
    // console.log(us);
    // console.log(history)
    // us = User.createUserFromObject(us);
    // DataManager.updateUserById(userId, us)
    // console.log(us)





    return true;
  }

  async unfreeze(amountToUnfreeze, userId) {
    if (amountToUnfreeze > this.#frozenBalance) {
      console.error('Недостаточно замороженных средств.');
      return false;
    }

    this.#activeBalance = parseFloat(this.#activeBalance) + parseFloat(amountToUnfreeze);
    this.#frozenBalance = parseFloat(this.#frozenBalance) - parseFloat(amountToUnfreeze);
    console.log(`Разморожено ${amountToUnfreeze} на балансе.`);

    // const balanceStep = {
    //   data: new Date(),
    //   count: amountToUnfreeze,
    //   type: 'unFreeze'
    // }


    // const history = await Balance.addHistory(balanceStep, userId);

    // let us = await DataManager.getUserById(userId);
    // us.balanceHistory = history;
    // console.log(us);
    // console.log(history)
    // us = User.createUserFromObject(us);
    // DataManager.updateUserById(userId, us)
    // console.log(us)

    return true;
  }

  //расход с активного баланс
  spend(amountToSpend, userId) {
    if (amountToSpend > this.#activeBalance) {
      console.error('Недостаточно средств на активном балансе.');
      return false;
    }

    this.#activeBalance -= amountToSpend;
    console.log(`Списано ${amountToSpend} с активного баланса.`);

    // const balanceStep = {
    //   data: new Date(),
    //   count: amountToSpend,
    //   type: 'spend'
    // }
    //await  Balance.addHistory(balanceStep);

    return true;
  }

  //  проведение транзакции (расход с заморожного баланса)
  spendFrozen(amountToSpendFrozen, userId) {
    if (amountToSpendFrozen > this.#frozenBalance) {
      console.error('Недостаточно замороженных средств.');
      return false;
    }

    this.#frozenBalance -= amountToSpendFrozen;
    console.log(`Списано ${amountToSpendFrozen} с замороженного баланса.`);
    const balanceStep = {
      data: new Date(),
      count: amountToSpendFrozen,
      type: 'expense'
    }
    //await  Balance.addHistory(balanceStep);
    return true;
  }


  getBalanceInfo() {

    return (`Активный баланс: ${this.#activeBalance} \n Замороженный баланс: ${this.#frozenBalance}`);

  }
  getActiveBalance() {
    return this.#activeBalance;
  }


  getFrozenBalance() {
    return this.#frozenBalance;
  }

  // Setter для активного баланса
  set activeBalance(value) {


    if (value >= 0) {
      this.#activeBalance = value;


    } else {
      console.error('bal >-1');
    }
  }

  // Getter для активного балансаaddHistor
  get activeBalance() {
    return this.#activeBalance;
  }
  async save(userId, prevBalanceData) {

    console.log(!prevBalanceData)
    if (!prevBalanceData)
      prevBalanceData = getLsbyKey("balance") || { activeBalance: 0, frozenBalance: 0 };


    let balanceStep = {}
    let history = []


    if (parseInt(this.#frozenBalance) < parseInt(prevBalanceData.frozenBalance) && (parseInt(this.#activeBalance) == parseInt(prevBalanceData.activeBalance))) {
      balanceStep = {
        data: new Date(),
        count: parseInt(prevBalanceData.frozenBalance) - parseInt(this.#frozenBalance),
        type: 'freezeSpend'
      };
      history = await Balance.addHistory(balanceStep, userId);
    } else
      if (parseInt(this.#activeBalance) + parseInt(this.#frozenBalance) != parseInt(prevBalanceData.activeBalance) + parseInt(prevBalanceData.frozenBalance)
      ) {
        balanceStep = {
          data: new Date(),
          count: this.#activeBalance,
          type: 'update'
        };
        history = await Balance.addHistory(balanceStep, userId);
      }
      else if (parseInt(this.#activeBalance) > parseInt(prevBalanceData.activeBalance)) {
        balanceStep = {
          data: new Date(),
          count: parseInt(this.#activeBalance) - parseInt(prevBalanceData.activeBalance),
          type: 'unfreeze'
        };
        history = await Balance.addHistory(balanceStep, userId);
      }
      else if (parseInt(this.#frozenBalance) > parseInt(prevBalanceData.frozenBalance)) {
        balanceStep = {
          data: new Date(),
          count: parseInt(this.#frozenBalance) - parseInt(prevBalanceData.frozenBalance),
          type: 'freeze'
        };
        history = await Balance.addHistory(balanceStep, userId);
      }

    let user = User.load();
    console.log(user.id, userId)

    if (user.id == userId) {
      localStorage.setItem('balance', JSON.stringify({
        activeBalance: this.#activeBalance,
        frozenBalance: this.#frozenBalance,
      }));

    }

    return history
    //

  }


  static load() {
    const balanceData = localStorage.getItem(`balance`);

    if (balanceData) {
      const { activeBalance, frozenBalance } = JSON.parse(balanceData);

      const balance = new Balance();
      balance.#activeBalance = activeBalance;
      balance.#frozenBalance = frozenBalance;

      return balance;
    }
    return null;
  }

  static async addHistory(operation, userId) {


    let user = await DataManager.getUserById(userId);

    // user = User.createUserFromObject(user);




    let history = user.balanceHistory ? [...user.balanceHistory] : [];
    console.log(history)

    history = [...history, operation];


    setLsbyKey('balanceHistory', history);

    return history
  }


}

// Пример использования класса


