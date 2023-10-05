import { Balance } from './Balance.js';
export class User {
    constructor(id, bio, date, balance, frozen, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks) {
        this.id = id;
        this.bio = bio;
        this.date = date;
        this.img = img;
        this.descr = descr;
        this.client = client;
        this.implementer = implementer;
        this.listOfOrders = listOfOrders;
        this.listOfServices = listOfServices;
        this.pendingTasks = pendingTasks || [];
        this.activeTasks = activeTasks || [];

        this.balance = new Balance(balance, frozen)
    }

    save() {
        console.log('баланс сохранен')

        localStorage.setItem(`user`, JSON.stringify(this));
        // Сохраняем баланс пользователя
        this.balance.save(this.id);
    }

    // Статический метод для загрузки пользователя из localStorage по ID
    static load() {
        const userData = localStorage.getItem(`user`);
        if (userData) {
            const user = JSON.parse(userData);

            const money = Balance.load();

            user.balance = money;


            // console.log(user)
            const { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks } = user;
            return new User(id, bio, date, balance.activeBalance, balance.frozenBalance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks); // Создаем и возвращаем экземпляр User
        }
        return null;
    }

}

