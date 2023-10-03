import {
    getBasketLocalStorage,
    setBasketLocalStorage,
    checkingRelevanceValueBasket,
    removeFromBasket, setLsbyKey,
    getLsbyKey, removeFromLs,
    forcePushToField, forceRemoveFromField

} from './utils.js'
import { DataManager } from './DataManager.js';
import { updateMoneyNowText } from './balanceChecker.js'
import { User } from './User.js';
import { deleteFromCart, deleteCard, } from './cart.js'
// карточки для секции всех тасков
export function createCards(container, serviceData) {

    serviceData.forEach(async (card) => {

        const { id, img, title, price, descr, timing, owner, ownerId, type } = card;
        let userName
        let user = await DataManager.getUserById(ownerId);
        console.log(ownerId, user)
        console.log(card)
        if (user) {
            userName = user.bio;

        } else if (card.owner) {
            userName = card.owner;
        } else {
            userName = "Отличный мужчина"
        }

        const cardItem =
            `
                <div class="card service-card ${type}" data-product-id="${id}">
                    <div class="card__top service-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image service-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label service-card__label">-${timing}</div>
                    </div>
                    <div class="card__bottom service-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading service-card__heading">${userName}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__title service-card__title">${title}</a>
                        <button class="card__add" data-id="${id}">В корзину</button>
                    </div>
                </div>
            `


        container.insertAdjacentHTML('beforeend', cardItem);

        const btn = container.querySelector(`[data-id="${id}"]`);


        btn.addEventListener('click', () => clickToCart(id));
    });
}

function clickToCart(id) {

    const basket = getBasketLocalStorage();

    if (basket.includes(id)) {
        removeFromBasket(id);
        return
    };

    basket.push(id);
    setBasketLocalStorage(basket);

}
//todo пернести из dombuild
async function goBuy(container, price, id) {
    console.log("buy")
    let user = User.load();
    user = await DataManager.getUserById(user.id)
    user = User.createUserFromObject(user);
    user.save()

    user.pendingTasks.push(id)
    user.balance.freeze(price);

    user.save();
    updateMoneyNowText();



    // forcePushToField("user", "pendingTasks", [id], true);
    //forcePushToField("users", "pendingTasks", [id], true, user.id); //вместо это отдавать эту информацию серверу. 
    //todo
    //отправить запрос на сервер о том что откликнулся на заказ, 
    //  и отправить другой стороне что с его карточкй происходит действие




    const cardItem =
        `
    <div>
        <p> Заказано</p>
        <p> Ожидаем подтверждения исполнителя </p>
        <p> замороженно ${price}</p>
    </div>
    `
    container.insertAdjacentHTML('beforeend', cardItem);

}
function goDoing(container, id) {
    const user = User.load();
    console.log("do")
    const cardItem =
        `
    <div>
        <p> Вы откликнулись</p>
        <p> Ожидаем подтверждения заказчика</p>
        
    </div>
    `
    container.insertAdjacentHTML('beforeend', cardItem);
    forcePushToField("user", "pendingTasks", [id], true);
    forcePushToField("users", "pendingTasks", [id], true, user.id);//вместо это отдавать эту информацию серверу. 
}
export async function goDeleteTask(container, id) {
    let user = User.load();
    user = await DataManager.getUserById(user.id)
    user = User.createUserFromObject(user);
    user.save()

    container.innerHTML = " ";
    // const tasksArray = getLsbyKey("services");
    console.log("del")

    // const indexToRemove = tasksArray.findIndex(item => item.id == id);
    const task = await DataManager.getServiceById(id);
    const indexToRemove = task.id;

    console.log(id)


    DataManager.deleteService(indexToRemove);

    console.log(indexToRemove);

    const field = user.client ? "listOfOrders" : "listOfServices";
    forceRemoveFromField("user", field, [id]);
    user = User.load();
    user.save();


}
//
export function createProfileCard(profileData, container) {

    const { id, img, bio, date, descr, listOfServices } = profileData;
    const cardItem =
        `
        <div class="card profile-card" data-profile-id="${id}">
            <div class="card__top profile-card_top">
                <a href="/servicePage.html?id=serviceCase${id}" class="card__image profile-card__image --test-get-img">
                    <img class=" img"
                        src="${img}"
                        alt="${bio}"
                    />
                </a>
               
            </div>
            <div class="card__bottom profile-card__bottom">
                <div class="card__info ">
                    <div class="card__people heading profile-card__heading">${bio}</div>
                    <div class="card__descr card__descr--common">${descr}</div>
                </div>
               
                <button class="card__add">В корзину</button>
            </div>
        </div>
    `
    container.insertAdjacentHTML('beforeend', cardItem);
    const btn = container.querySelector(`[data-id="${id}"]`);
    btn.addEventListener('click', () => clickToCart(id));
}
// 

export function createCartCards(container, data, key = "basket", modifier = "non") {

    console.log(data.id)
    const { id, img, title, price, descr, timing, owner } = data;

    const cardItem =
        `
                <div class="card cart-card" data-product-id="${id}">
                    <div class="card__top cart-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image cart-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label cart-card__label">-${timing}</div>
                    </div>
                    <div class="card__bottom cart-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading cart-card__heading">${title}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__title cart-card__title">${title}</a>
                        <button class="card__add" data-id="${id}">удалить</button>
                    </div>
                </div>
            `


    container.insertAdjacentHTML('beforeend', cardItem);

    const btn = container.querySelector(`[data-id="${id}"]`);

    if (key == null) return
    btn.addEventListener('click', () => {
        deleteCard(id, key, container, modifier);


        const tasksArray = getLsbyKey("services");
        const indexToRemove = tasksArray.findIndex(item => item.id == id);
        if (indexToRemove !== -1) {
            tasksArray.splice(indexToRemove, 1);
        }
        setLsbyKey("services", tasksArray)

    });

}
// 

export function createPersonalProfileCard(user, container) {

    const { id, bio, date, descr, } = user;
    const cardItem =
        `
        <div class="card profile-card" data-profile-id="${id}">
           
            
                <div class="card__info ">
                <h3 class="card__title txt title">${bio}</h3>
                <p class="card__description txt">${descr}</p>
                <p class="card__registration-date txt">${date}</p>
                </div>
            
        </div>
    `
    container.insertAdjacentHTML('beforeend', cardItem);

}


// 

export function renderPeopleCard(data, container) {
    console.log(data)
    const { id, img, date, bio, descr, listOfServices } = data;

    const cardItem =
        // ссылку поменял! - мб логический баг
        `
                <div class="card profile-card" data-product-id="${id}">
                    <div class="card__top profile-card_top">
                        <a href="/userPage.html?id=${id}" class="card__image profile-card__image "> 
                            <img class=" img card__img --test-get-img"
                                src="${img}"
                                alt="${bio}"
                            />
                        </a>
                        <div class="card__label profile-card__label">-${date}%</div>
                    </div>
                    <div class="card__bottom profile-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading profile-card__heading">${bio}</div>
                            <div class="card__descr ">${descr}</div>
                        </div>
                        
                       
                    </div>
                </div>
            `
    container.insertAdjacentHTML('beforeend', cardItem);

}

export function renderTaskCard(data, container) {
    let user = User.load();

    const { id, img, title, price, descr, timing, owner, ownerId, type } = data;
    let buffBtn;
    if (type == 'order') {
        buffBtn = `
        <button class="buy-btn btn  --for-implementer-only">выполнить</button>`
    } else if (type != 'order') {
        buffBtn = `
        <button class="buy-btn btn --for-client-only">заказать</button>`

    } if (user.id == ownerId) {
        buffBtn = `
        <button class="buy-btn btn  ">Удалить</button>`
    }
    const cardItem =
        `
                <div class="card task-card" data-product-id="${id}">
                    <div class="card__top task-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image task-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label task-card__label">-${timing}%</div>
                    </div>
                    <div class="card__bottom task-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading task-card__heading">${title}</div>
                            <div class="card__descr ">${descr}</div>
                        </div>
                        <div class="card__price ">
                            <p class="card__price txt task-card__txt">${price}</p>
                           
                        </div>
                        
                        <button class="card__add btn">В Избранное</button>
                        ${buffBtn}
                    </div>
                </div>
            `
    container.insertAdjacentHTML('beforeend', cardItem);
    const btn = container.querySelector(`.card__add`);
    btn.addEventListener('click', () => clickToCart(id));


    const evBtn = container.querySelector(`.buy-btn`);
    if (user.id == ownerId) {
        evBtn.addEventListener('click', () => goDeleteTask(container, id));

    } else
        if (type == 'order') {
            evBtn.addEventListener('click', () => goDoing(container));
        }
        else if (type != 'order') {
            evBtn.addEventListener('click', () => goBuy(container, price, id));
        }
}