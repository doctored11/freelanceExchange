import { Balance } from './Balance.js';
import { DataManager } from './DataManager.js';
export class User {
    constructor(id, bio, date, balance = 0, frozen = 0, img = null, descr = "Стандартный чебурек", client = true, implementer = false, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks, balanceHistory, rate = 0) {
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
        this.balanceHistory = balanceHistory || [];

        this.rate = rate


        this.balance = new Balance(balance, frozen)
    }

    async save() {
        console.log('баланс сохранен')

        localStorage.setItem(`user`, JSON.stringify(this));
        // Сохраняем баланс пользователя
        // const history = await this.balance.save(this.id);
        // 
        // const history = await this.balance.save(this.id);
        // console.log(history)
        // const us = await DataManager.getUserById(this.id);
        // us.balanceHistory = history;
        // this.balanceHistory = history
        this.saveToServer()
        // DataManager.updateUserById(this.id, this);



        // DataManager.updateUserById(this.id, this);
    }
    async saveToServer() {
        const history = await this.balance.save(this.id)
        this.balanceHistory = history
        DataManager.updateUserById(this.id, this);
    }

    // Статический метод для загрузки пользователя из localStorage по ID
    static load() {
        const userData = localStorage.getItem(`user`);
        if (userData) {
            const user = JSON.parse(userData);

            const money = Balance.load() || {};

            user.balance = money;


            console.log(user)
            const { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks } = user;
            return new User(id, bio, date, balance.activeBalance, balance.frozenBalance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks);
        }
        return null;
    }
    static createUserFromObject(userData) {
        //с эьтим аккуратно
        if (typeof (userData) != "object") return userData

        console.log(userData)

        let active, frozen = 0
        let { id, bio, date, balance, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks, balanceHistory, rate } = userData;
        if (balance) {
            active = balance.activeBalance
            frozen = balance.frozenBalance
        }
        console.log(balanceHistory)
        if (balanceHistory && Array.isArray(balanceHistory)) {

            balanceHistory = balanceHistory.map(historyItem => {
                console.log(historyItem)
                return {
                    count: historyItem.count,
                    data: historyItem.data,
                    type: historyItem.type
                };
            });
        }


        return new User(id, bio, date, active, frozen, img, descr, client, implementer, listOfOrders, listOfServices, pendingTasks, activeTasks, finishtasks, balanceHistory, rate);
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

