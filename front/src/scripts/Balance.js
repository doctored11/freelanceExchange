
// пока не смотрите особо - заготовка
export class Balance {
  #activeBalance = 0;
  #frozenBalance = 0;

  constructor(initialActiveBalance = 0, initialfrozen = 0) {
    this.#activeBalance = initialActiveBalance;
    this.#frozenBalance = initialfrozen;
  }

  // заморозка части баланса
  freeze(amountToFreeze) {
    amountToFreeze = parseFloat(amountToFreeze)
    if (amountToFreeze > this.#activeBalance) {
      console.error('Недостаточно средств на активном балансе.');
      return false;
    }

    this.#activeBalance = parseFloat(this.#activeBalance) - amountToFreeze;
    this.#frozenBalance = parseFloat(this.#frozenBalance)+ amountToFreeze;
    console.log(`Заморожено ${amountToFreeze} на балансе.`);

    console.log(`акстивныйбаланс = ${ this.#activeBalance} `);

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
      console.error('Значение активного баланса должно быть неотрицательным.');
    }
  }

  // Getter для активного баланса
  get activeBalance() {
    return this.#activeBalance;
  }
  save(userId) {
    localStorage.setItem(`balance_${userId}`, JSON.stringify({
      activeBalance: this.#activeBalance,
      frozenBalance: this.#frozenBalance,
    }));
    
  }
  

  static load(userId) {
    const balanceData = localStorage.getItem(`balance_${userId}`);
    
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


}

// Пример использования класса
const userBalance = new Balance(1000);
userBalance.activeBalance = 1500
userBalance.getBalanceInfo();

