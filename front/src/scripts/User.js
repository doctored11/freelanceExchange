import { Balance } from './Balance.js';
export class User {
    constructor(id, bio, date, balance, frozen, img, descr, client, implementer, listOfOrders, listOfServices) {
        this.id = id;
        this.bio = bio;
        this.date = date;
        this.img = img;
        this.descr = descr;
        this.client = client;
        this.implementer = implementer;
        this.listOfOrders = listOfOrders;
        this.listOfServices = listOfServices;

        this.balance = new Balance(balance,frozen)
    }

    save() {
        console.log('баланс сохранен')
      
        localStorage.setItem(`user_${this.id}`, JSON.stringify(this));
        // Сохраняем баланс пользователя
        this.balance.save(this.id);
    }

    // Статический метод для загрузки пользователя из localStorage по ID
    static load(userId) {
        const userData = localStorage.getItem(`user_${userId}`);
        if (userData) {
            const user = JSON.parse(userData);
            // Загружаем баланс пользователя
            const money = Balance.load(userId);
            
            user.balance = money;

            
            // console.log(user)
            const { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices } = user;
            return new User(id, bio, date, balance.activeBalance,balance.frozenBalance, img, descr, client, implementer, listOfOrders, listOfServices); // Создаем и возвращаем экземпляр User
        }
        return null;
    }

}

