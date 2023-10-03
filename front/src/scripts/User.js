import { Balance } from './Balance.js';
import { DataManager } from './DataManager.js';
export class User {
    constructor(id, bio, date, balance = 0, frozen = 0, img = null, descr = "Стандартный чебурек", client = true, implementer = false, listOfOrders, listOfServices, pendingTasks, activeTasks,finishtasks) {
        this.id = id;
        this.bio = bio;
        this.date = date;
        this.img = img;
        this.descr = descr;
        this.client = client;
        this.implementer = implementer;
        this.listOfOrders = listOfOrders || [];
        this.listOfServices = listOfServices || [];
        this.pendingTasks = pendingTasks || [];
        this.activeTasks = activeTasks || [];
        this.finishtasks = finishtasks || [];

        this.balance = new Balance(balance, frozen)
    }

    save() {
        console.log('баланс сохранен')

        localStorage.setItem(`user`, JSON.stringify(this));
        // Сохраняем баланс пользователя
        this.balance.save(this.id);
        DataManager.updateUserById(this.id, this);
    }

    // Статический метод для загрузки пользователя из localStorage по ID
    static load() {
        const userData = localStorage.getItem(`user`);
        if (userData) {
            const user = JSON.parse(userData);

            const money = Balance.load();

            user.balance = money;


            // console.log(user)
            const { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks } = user;
            return new User(id, bio, date, balance.activeBalance, balance.frozenBalance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks); 
        }
        return null;
    }
    static createUserFromObject(userData) {
        //с эьтим аккуратно
        if (typeof (userData) != "object") return userData

        let active, frozen = 0
        let { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks } = userData;
        if (balance) {
            active = balance.activeBalance
            frozen = balance.frozenBalance
        }
        return new User(id, bio, date, active, frozen, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks);
    }


    //non use пока - но думал что  надо)
    update(updateData) {
        if (!updateData || typeof updateData !== 'object') {
            console.error('неверные данные');
            return null;
        }

        if (updateData.hasOwnProperty('id')) {
            delete updateData.id;
        }

        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                this[key] = updateData[key];
            }
        }
        this.save();
        DataManager.updateUserById(this.id, this);
        return this;
    }

}

