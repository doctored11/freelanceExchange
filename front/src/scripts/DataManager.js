import {
    getBasketLocalStorage,
    setBasketLocalStorage,
    checkingRelevanceValueBasket,
    removeFromBasket, setLsbyKey,
    getLsbyKey, removeFromLs,
    forcePushToField, forceRemoveFromField

} from './utils.js'

const src = 'https://freelanceexchangetest-default-rtdb.firebaseio.com/'

export class DataManager {

    static async addUser(user) {
        console.log(user)
        try {
            // Получаем текущий список пользователей (если он существует)
            const response = await fetch(`${src}users.json`);
            let usersData = await response.json();

            if (!usersData) {
                usersData = {}; // Если список пользователей не существует, создаем пустой объект
            }


            const newId = user.id || Date.now();


            usersData[newId] = user;


            await fetch(`${src}users.json`, {
                method: 'PUT',
                body: JSON.stringify(usersData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('пользователь добавлен');
            return newId; // Возвращаем ID нового пользователя
        } catch (error) {
            console.error('ошибка при добавлении', error);
            return null;
        }
    }

    static async addService(task) {

        const response = await fetch(`${src}services.json`);
        let servData = await response.json();

        if (!servData) {
            servData = {};
        }
        console.log(task.id)
        const newId = task.id == null || TrackEvent.id < 0 ? Date.now() : task.id;


        servData[newId] = task;
        return fetch(`${src}services.json`, {
            method: 'PUT',
            body: JSON.stringify(servData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('добавлен на сервер', data);
                return data;
            })
            .catch(error => {
                console.error('ошибка добавления карточки н сервер');
                throw error;
            });
    }

    static getUserById(id) {
        return fetch(`${src}users/${id}.json`)
            .then(response => response.json())
            .then(data => {
                console.log('пользователь', data);
                return data;
            })
            .catch(error => {
                console.error('пользователь не найден (id)');
                throw error;
            });
    };

    static getListOfUsersById(arrOfIds) {
        const promises = arrOfIds.map(id =>
            fetch(`${src}users/${id}.json`)
                .then(response => response.json())
        );

        return Promise.all(promises)
            .then(data => {
                console.log('все по списку:', data);
                return data;
            })
            .catch(error => {
                console.error('ошибка получения списка пользователей по id');
                throw error;
            });
    };



    static getServiceById(id) {
        return fetch(`${src}services/${id}.json`)
            .then(response => response.json())
            .then(data => {
                console.log('карточка получена', data);
                return data;
            })
            .catch(error => {
                console.error('ошибка получения по ID:');
                throw error;
            });
    }

    static getListOfServicesByids(arrOfIds) {
        const promises = arrOfIds.map(id =>
            fetch(`${src}services/${id}.json`)
                .then(response => response.json())
        );

        return Promise.all(promises)
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('ошибка получения');
                throw error;
            });
    }
    static getServicesInRange(min, max, isDone = false) {
        return fetch(`${src}services.json`)
            .then(response => response.json())
            .then(data => {

                let servicesArray = Array.isArray(data) ? data : Object.values(data);
                servicesArray = servicesArray.filter(service => service !== null);

                if (!isDone)
                    servicesArray = servicesArray.filter(service => service.status != "inWork");


                if (min < 0) min = 0;
                if (max >= servicesArray.length) max = servicesArray.length - 1;

                const servicesInRange = servicesArray.slice(min, max + 1);

                console.log(servicesInRange);
                return servicesInRange;
            })
            .catch(error => {
                console.error('ошибка при получении карточек у');
                throw error;
            });
    }

    static async getUsersCount() {
        try {
            const response = await fetch(`${src}users.json`);
            const usersData = await response.json();

            if (usersData) {
                const count = Object.keys(usersData).length;
                return count;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Ошибка при получении числа пользователей', error);
            return 0;
        }
    }
    static async getMaxUserId() {
        try {
            const response = await fetch(`${src}users.json`);
            const usersData = await response.json();

            if (usersData) {
                const userIds = Object.keys(usersData).map(id => parseInt(id, 10));
                const maxId = Math.max(...userIds);
                return maxId;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('ошибка максUser');
            return 0;
        }
    }

    static async getTasksCount() {
        try {
            const response = await fetch(`${src}services.json`);
            const servicesData = await response.json();

            if (servicesData) {
                const count = Object.keys(servicesData).length;
                return count;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('оибка при получении числа задач', error);
            return 0;
        }
    }
    static async getMaxServiceId() {
        try {
            const response = await fetch(`${src}services.json`);
            const servicesData = await response.json();

            if (servicesData) {
                const serviceIds = Object.keys(servicesData).map(id => parseInt(id, 10));
                const maxId = Math.max(...serviceIds);
                return maxId;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Ошибка при получении максимального ID задачи (услуги)', error);
            return 0;
        }
    }

    static async updateUserById(id, user) {
        console.log(user)

        const active = user.balance.getActiveBalance() || user.balance.activeBalance || 0;
        const frozen = user.balance.getFrozenBalance() || user.balance.frozen || 0;
        const userData = {
            ...user,
            balance: {
                activeBalance: active,
                frozenBalance: frozen
            }
        }
        try {
            const response = await fetch(`${src}users/${id}.json`, {
                method: 'PUT',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`пльзователь ${id} обновлен`);
                return true;
            } else {
                console.error(`Ошибка  обновления пользователя   ${id}`);
                return false;
            }
        } catch (error) {
            console.error('ошибка при отправке запроса (обновление)');
            return false;
        }
    }


    static async deleteService(serviceId) {
        try {
            const response = await fetch(`${src}services/${serviceId}.json`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`карточка ${serviceId}  удалена`);
                return true;
            } else {
                console.error(`ошибка при удалении  ${serviceId}`);
                return false;
            }
        } catch (error) {
            console.error('ошибка запроса');
            return false;
        }
    }
    static async updateServiceById(serviceId, service) {
        try {
            const response = await fetch(`${src}services/${serviceId}.json`, {
                method: 'PUT',
                body: JSON.stringify(service),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Услуга ID ${serviceId} обновлена`);
                return true;
            } else {
                console.error(`ошибка  ID ${serviceId}`);
                return false;
            }
        } catch (error) {
            console.error('ошибка  запроса (обновление услуг) ');
            return false;
        }
    }
    static async getUsersWithPendingTaskIds(taskId) {
        const usersWithPendingTasks = [];

        try {
            // Получите список всех пользователей
            const response = await fetch(`${src}users.json`);
            const allUsers = await response.json();


            console.log(allUsers)
            if (allUsers) {
                // Переберите всех пользователей
                Object.keys(allUsers).forEach((userId) => {

                    const user = allUsers[userId];
                    if (user == null) return
                    console.log(user)
                    if (user.pendingTasks && user.pendingTasks.includes(taskId)) {

                        usersWithPendingTasks.push(userId);
                    }
                });
            }

            return usersWithPendingTasks;
        } catch (error) {
            console.error('ошибка при получении пользователей ');
            return [];
        }
    }

    static async getUsersWithActiveTaskIds(taskId) {
        //вот что делает спешка
        const usersWithActiveTasks = [];

        try {

            const response = await fetch(`${src}users.json`);
            const allUsers = await response.json();
            console.log(allUsers)

            console.log(allUsers)
            if (allUsers) {

                Object.keys(allUsers).forEach((userId) => {
                    const user = allUsers[userId];
                    if (user == null) return;
                    console.log(user)
                    if (user.activeTasks && user.activeTasks.includes(parseInt(taskId))) {
                        usersWithActiveTasks.push(userId);
                    }
                });
            }
            console.log(usersWithActiveTasks)

            return usersWithActiveTasks;
        } catch (error) {
            console.error('ошибка при получении пользователей ');
            return [];
        }
    }









}
