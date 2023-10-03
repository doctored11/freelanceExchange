
import {
    createCards,
    renderPeopleCard,
    renderTaskCard,
    createCartCards
} from './domBuider.js'

import {
    getBasketLocalStorage,
    setBasketLocalStorage,
    checkingRelevanceValueBasket,
    removeFromBasket,
    setLsbyKey,
    getLsbyKey,
    removeFromLs

} from './utils.js'

import {
    getServices

} from './requests.js'
import { DataManager } from './DataManager.js';
let productsData = [];
let usersData = [];

const container = document.querySelector('.card__container')

//пока без бд
// usersData = getLsbyKey("users")
// productsData = getLsbyKey("services")

let cart = getBasketLocalStorage();
// getServices('../data/base.json', usersData)
//     .then(updatedUsersData => {
//         if (usersData.length < 1)
//             usersData = updatedUsersData;
//         return getServices('../data/products.json');
//     })
//     .then(updatedProductsData => {
//         if (productsData.length < 1)
//             productsData = updatedProductsData;
//         console.log(productsData);
//         console.log(usersData);
//         cart = getBasketLocalStorage();
//         if (container)
//             cardRender(container, cart);
//     });

cardRender(container, cart);



async function cardRender(container, data) {
    console.log('cardRender')
    container.innerHTML = ' '
    console.log(data);
    if(data.length<1) return
    // const selectPositions = productsData.filter(item => data.includes(item.id));
    const selectPositions = await DataManager.getListOfServicesByids(data)
    

    selectPositions.forEach(pos => { createCartCards(container, pos) });

}

export function deleteFromCart(id) {

    cart = getBasketLocalStorage();
    console.log(cart)
    console.log(id)

    if (cart.includes(id)) {
        removeFromBasket(id);

    };

    cart = getBasketLocalStorage();
    cardRender(container, cart);

}
export function deleteCard(id, key, container, modifier = "") {

    let list = getLsbyKey(key)
    console.log(list[modifier])

    try {
        if (list.includes(id)) {
            console.log(id, key)
            removeFromLs(id, key)

            list = getLsbyKey(key)
        };
    } catch { }
    try {
        if (typeof (list[modifier])) {

            deleteNestedList(id, key, modifier, list[modifier])
            list = getLsbyKey(key)
            list = list[modifier]

        }
    } catch { }

    
    
    cardRender(container, list);

}
function deleteNestedList(id, key, mod, data) {

    if (data.includes(id)) {

        const list = getLsbyKey(key)
        const index = list[mod].indexOf(id);


        if (index !== -1) {
            list[mod].splice(index, 1);

            setLsbyKey(key, list)
        }
    };
}

