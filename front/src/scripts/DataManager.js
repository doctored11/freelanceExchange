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
        const newId = task.id ==null || TrackEvent.id<0 ?Date.now():task.id ;
      

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
                console.log( data);
                return data;
            })
            .catch(error => {
                console.error('ошибка получения');
                throw error;
            });
    }
    static getServicesInRange(min, max) {
        return fetch(`${src}services.json`)
            .then(response => response.json())
            .then(data => {
              
                const servicesArray = Array.isArray(data) ? data : Object.values(data);
    
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
    static async updateUserById(id, user) {
        const userData = {
            ...user,
            balance: {
                activeBalance: user.balance.activeBalance,
                frozenBalance: user.balance.frozenBalance
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
    

}
