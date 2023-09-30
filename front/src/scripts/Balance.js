
// пока не смотрите особо - заготовка
export class Balance {
    #activeBalance = 0;
    #frozenBalance = 0;
  
    constructor(initialActiveBalance = 0) {
      this.#activeBalance = initialActiveBalance;
    }
  
    // заморозка части баланса
    freeze(amountToFreeze) {
      if (amountToFreeze > this.#activeBalance) {
        console.error('Недостаточно средств на активном балансе.');
        return false;
      }
  
      this.#activeBalance -= amountToFreeze;
      this.#frozenBalance += amountToFreeze;
      console.log(`Заморожено ${amountToFreeze} на балансе.`);
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
      console.log(`Активный баланс: ${this.#activeBalance}`);
      console.log(`Замороженный баланс: ${this.#frozenBalance}`);
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
  }
  
  // Пример использования класса
  const userBalance = new Balance(1000);
  userBalance.activeBalance = 1500
  userBalance.getBalanceInfo(); 
  
  