"use strict"
//==========================================



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