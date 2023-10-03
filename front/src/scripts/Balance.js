
import {
  setLsbyKey,
  getLsbyKey

} from './utils.js'

import { DataManager } from './DataManager.js';

export class Balance {
  #activeBalance = 0;
  #frozenBalance = 0;

  constructor(initialActiveBalance = 0, initialfrozen = 0) {
    this.#activeBalance = initialActiveBalance;
    this.#frozenBalance = initialfrozen;
  }

  // заморозка части баланса
  freeze(amountToFreeze) {
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
      data: new Date(),
      count: amountToFreeze,
      type: 'freeze'
    }
    Balance.addHistory(balanceStep);
   

    return true;
  }

  unfreeze(amountToUnfreeze) {
    if (amountToUnfreeze > this.#frozenBalance) {
      console.error('Недостаточно замороженных средств.');
      return false;
    }

    this.#activeBalance += amountToUnfreeze;
    this.#frozenBalance -= amountToUnfreeze;
    console.log(`Разморожено ${amountToUnfreeze} на балансе.`);

    const balanceStep = {
      data: new Date(),
      count: amountToUnfreeze,
      type: 'unFreeze'
    }
    Balance.addHistory(balanceStep);

    return true;
  }

  //расход с активного баланс
  spend(amountToSpend) {
    if (amountToSpend > this.#activeBalance) {
      console.error('Недостаточно средств на активном балансе.');
      return false;
    }

    this.#activeBalance -= amountToSpend;
    console.log(`Списано ${amountToSpend} с активного баланса.`);

    const balanceStep = {
      data: new Date(),
      count: amountToSpend,
      type: 'spend'
    }
    Balance.addHistory(balanceStep);
  
    return true;
  }

  //  проведение транзакции (расход с заморожного баланса)
  spendFrozen(amountToSpendFrozen) {
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
    Balance.addHistory(balanceStep);
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
      const balanceStep = {
        data: new Date(),
        count: value,
        type: 'update'
      }
      Balance.addHistory(balanceStep);
    } else {
      console.error('bal >-1');
    }
  }

  // Getter для активного баланса
  get activeBalance() {
    return this.#activeBalance;
  }
  save() {
    localStorage.setItem(`balance`, JSON.stringify({
      activeBalance: this.#activeBalance,
      frozenBalance: this.#frozenBalance,
    }));
   

  }


  static load() {
    const balanceData = localStorage.getItem(`balance`);

    if (balanceData) {
      const { activeBalance, frozenBalance } = JSON.parse(balanceData);

      const balance = new Balance();
      balance.#activeBalance = activeBalance;
      balance.#frozenBalance = frozenBalance;
      console.log(balance)
      return balance;
    }
    return null;
  }

  static addHistory(operation) {
    const history = getLsbyKey('balanceHistory') || {};
    history.push(operation);
    setLsbyKey('balanceHistory', history)
   
  }


}

// Пример использования класса


