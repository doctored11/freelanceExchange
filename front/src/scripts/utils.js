"use strict"
//==========================================

import{goDeleteTask} from './domBuider.js'


// Получение id из LS
export function getBasketLocalStorage() {
    const cartDataJSON = localStorage.getItem('basket');
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}


export function setBasketLocalStorage(basket) {

    localStorage.setItem('basket', JSON.stringify(basket));
    console.log(basket.length)
}
// 
export function getLsbyKey(key) {
    const cartDataJSON = localStorage.getItem(key);
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}


export function setLsbyKey(key, data) {

    localStorage.setItem(key, JSON.stringify(data));
    console.log(data.length)
}






// 
// 
// 

// Проверка, существует ли товар указанный в LS 
//пока non use
export function checkingRelevanceValueBasket(productsData) {
    const basket = getBasketLocalStorage();

    basket.forEach((basketId, index) => {
        const existsInProducts = productsData.some(item => item.id === Number(basketId));
        if (!existsInProducts) {
            basket.splice(index, 1);
        }
    });

    setBasketLocalStorage(basket);
}

export function removeFromBasket(id) {
    const basket = getBasketLocalStorage();
    const index = basket.indexOf(id);

    if (index !== -1) {
        basket.splice(index, 1);
        setBasketLocalStorage(basket);
    }
}
export function removeFromLs(id, key) {
  
    const list = getLsbyKey(key)
    const index = list.indexOf(id);
    console.log(id)
    console.log(list)
    console.log(index)
   
    if (index !== -1) {
        list.splice(index, 1);
        
        setLsbyKey(key, list)
    }
}