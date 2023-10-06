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
        console.log(card)

        const { id, img, title, price, descr, timing, owner, ownerId, type } = card;
        let user = await DataManager.getUserById(ownerId);
        console.log("😂");
        console.log(user);
        let rate = user.rate;
        let userName
        if (!rate) rate = 0;
        let rateTxt = "🔹"
        if (rate > 4.7) rateTxt = "🔥"
        if (rate > 3.6) rateTxt = "💥"
        if (rate > 2) rateTxt = "✨"

        console.log(ownerId, user)
        console.log(card)
        if (user) {
            userName = user.bio;

        } else if (card.owner) {
            userName = card.owner;
        } else {
            userName = "Отличный мужчина"
        }


        //./files/unStar.svg -?
        const cardItem =
            `
            <div class="card service-card ${type}-card" data-product-id="${id}">
        <button class="card__add card__star" data-id="${id}">
          <img
            class=" card__star-${id}"
            src="./files/unStar.svg"
            alt="избранное"
          />
        </button>
        <a
          href="/servicePage.html?id=serviceCase${id}"
          class="card__image service-card__image "
        >
          <img class="img" src="${img}" alt="${title}" />
        </a>
        <div class=" card__content-block">
          <a
            href="/servicePage.html?id=serviceCase${id}"
            class="card__title"
            >${title}</a
          >
          <p class="card__txt txt">${descr}</p>

          <div class="card__info">
            <div
              class="card__people heading service-card__heading card__Author"
            >
              ${userName}
            </div>
            <div class="rate-block">
              <span class="authorRating txt card__rating">${rate}</span>
              <span>${rateTxt}</span>
              <div></div>
            </div>
          </div>
          <div class="card__info">
            <div class="card__price-logo">Цена</div>
            <div>
              <div class="card__price card__price--common">${price}</div>
              <span class="card__span">Р</span>
            </div>
          </div>
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
    console.log('________________')
    let user = User.load();
    user = await DataManager.getUserById(user.id)

    user = User.createUserFromObject(user);
    console.log(user.balance)
    user.save()
    console.log(user)


    user.pendingTasks.push(id)
    if (!user.balance.freeze(price)) return;

    user.save();
    updateMoneyNowText();

    let task = await DataManager.getServiceById(id);

    task.status = "pending";


    DataManager.updateServiceById(id, task)


    let owner = await DataManager.getUserById(task.ownerId);
    owner = User.createUserFromObject(owner);
    owner.pendingTasks.push(id);
    DataManager.updateUserById(owner.id, owner);



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

async function goInWork(partnerId, taskId) {

    console.log("goInWork")
    let partner = await DataManager.getUserById(partnerId);
    let user = User.load();
    user = await DataManager.getUserById(user.id);
    let task = await DataManager.getServiceById(taskId)


    console.log(user)
    partner.pendingTasks = partner.pendingTasks.filter(t => t != taskId);
    user.pendingTasks = user.pendingTasks.filter(t => t != taskId);


    //просто удаляем одинаковые   - хорошо бы вынести  и переиспользовать
    partner.pendingTasks = [...new Set(partner.pendingTasks)];
    user.pendingTasks = [...new Set(user.pendingTasks)];


    console.log(user);
    console.log(partner)

    partner = User.createUserFromObject(partner)
    user = User.createUserFromObject(user)

    console.log(partner)
    console.log(partner.activeTasks)


    partner.activeTasks.push(taskId)
    user.activeTasks.push(taskId)
    task.status = "inWork";

    console.log(partnerId)

    console.log(user);
    console.log(partner)

    partner.saveToServer();
    user.saveToServer();
    // DataManager.updateUserById(partnerId, partner);
    // DataManager.updateUserById(user.id, user);
    DataManager.updateServiceById(taskId, task);

    // user.save();

}

async function goDoing(container, id) {
    console.log('doing')

    let user = User.load();
    console.log(user)
    user = await DataManager.getUserById(user.id)
    console.log(user)
    user = User.createUserFromObject(user);
    console.log(user)


    console.log("do")
    const cardItem =
        `
    <div>
        <p> Вы откликнулись</p>
        <p> Ожидаем подтверждения заказчика</p>
        
    </div>
    `
    container.insertAdjacentHTML('beforeend', cardItem);
    // forcePushToField("user", "pendingTasks", [id], true);


    //todo
    //да теперь не добавляем а перезаписываем, желательно оптимизировать
    let pend = user.pendingTasks;
    pend = [...pend, id]
    user.pendingTasks = pend;

    let task = await DataManager.getServiceById(id);

    task.status = "pending";



    DataManager.updateServiceById(id, task)
    console.log(user)
    user.saveToServer();

    let owner = await DataManager.getUserById(task.ownerId);
    owner = User.createUserFromObject(owner);
    owner.pendingTasks.push(id);
    console.log(owner)
    owner.saveToServer()
    // DataManager.updateUserById(owner.id, owner);

}

async function goReject(taskId, userId) {
    let user = await DataManager.getUserById(userId);
    user = User.createUserFromObject(user);


    user.pendingTasks = user.pendingTasks.filter(task => task != taskId);
    console.log(user)

    //могу и у ownerа чистить но вдруг он не один откликнулся? 



    user.saveToServer();

}



async function goDone(taskId, container) {
    console.log('done')

    const formContainer = document.createElement("div");
    formContainer.classList.add("done-form");


    const textarea = document.createElement("textarea");
    textarea.classList.add("done-form__textarea");
    textarea.placeholder = "Введите комментарий";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Сдать работу";
    submitButton.classList.add("done-form__submit-button");

    submitButton.addEventListener("click", () => {
        const comment = textarea.value;
        //todo await
        sendDone(container, taskId, comment);

        textarea.value = "";
    });

    formContainer.appendChild(textarea);
    formContainer.appendChild(submitButton);


    container.appendChild(formContainer);


}



async function sendDone(container, taskid, comment) {
    console.log('done')

    const task = await DataManager.getServiceById(taskid);
    console.log(taskid);

    // task.closeComment = Array.isArray(task.closeComment) ? task.closeComment.push(comment) : [comment];

    task.closeComment = task.closeComment || [];
    task.closeComment.push(comment);

    let usersId = await DataManager.getUsersWithActiveTaskIds(taskid);

    console.log(taskid)
    console.log(usersId)
    let user1 = await DataManager.getUserById([usersId[0]]);
    let user2 = await DataManager.getUserById([usersId[1]]);
    const price = parseInt(task.price)



    user1 = User.createUserFromObject(user1);
    user2 = User.createUserFromObject(user2);

    console.log(user1)
    console.log(user2)

    let buffUs = User.load();

    task.status = "inСonfirm";
    DataManager.updateServiceById(task.id, task)
    if (!buffUs.client) return
    createAcceptRejectButtons(container, taskid)

    let user = User.load();
    user = await DataManager.getUserById(user.id)
    user = User.createUserFromObject(user);


    task.status = "ready";

    DataManager.updateServiceById(task.id, task)



}


export function createAcceptRejectButtons(container, taskId) {


    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Принять";
    acceptButton.classList.add("accept-button");


    const rejectButton = document.createElement("button");
    rejectButton.textContent = "На доработку";
    rejectButton.classList.add("reject-button");


    acceptButton.addEventListener("click", () => {
        createConfirmForm(container, taskId)
        // confirmDone(taskId);
        console.log("Задача принята");
    });


    rejectButton.addEventListener("click", async () => {
        createRejectForm(container, taskId)
        const task = await DataManager.getServiceById(taskId);
        task.status = "inWork"
        DataManager.updateServiceById(taskId, task)
        console.log("Задача отправлена на доработку");
    });
    console.log(container)

    container.appendChild(acceptButton);
    container.appendChild(rejectButton);
}


function createConfirmForm(container, taskId) {

    const form = document.createElement('form');
    form.classList.add('confirm-form', 'form');

    const textarea = document.createElement('textarea');
    textarea.setAttribute('placeholder', 'Введите комментарий...');
    textarea.classList.add('confirm-form__textarea', 'form__textarea');

    //todo - можно сделатб по другому - главное мне чтоб число от 1 до 5 было
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', '1');
    input.setAttribute('max', '5');
    input.setAttribute('placeholder', 'Введите оценку (1-5)');
    input.classList.add('confirm-form__input', 'form__input');


    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Отправить';
    submitButton.classList.add('confirm-form__submit-button', 'form__submit-button');

    form.appendChild(textarea);
    form.appendChild(input);
    form.appendChild(submitButton);

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const comment = textarea.value;
        const rating = input.value; //вот тут от 1 до 5

        console.log('Комментарий:', comment);
        console.log('Оценка:', rating);

        confirmDone(taskId, comment, rating);
    });


    container.appendChild(form);
}




function createRejectForm(container, taskId) {
    const formContainer = document.createElement("div");
    formContainer.classList.add("reject-form");


    const textarea = document.createElement("textarea");
    textarea.classList.add("reject-form__textarea");
    textarea.placeholder = "Введите комментарий";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Отправить";
    submitButton.classList.add("reject-form__submit-button");

    submitButton.addEventListener("click", () => {
        const comment = textarea.value;
        //todo await
        confirmReject(comment, taskId);



        textarea.value = "";
    });


    formContainer.appendChild(textarea);
    formContainer.appendChild(submitButton);


    container.appendChild(formContainer);
}













async function confirmReject(txt, taskId) {
    console.log('reject')
    console.log(txt)

    const task = await DataManager.getServiceById(taskId);
    console.log(task)
    console.log(txt)
    task.closeComment = task.closeComment || [];
    console.log(task)
    console.log(Array.isArray(task.closeComment));

    console.log(txt)

    task.closeComment = task.closeComment || [];
    task.closeComment.push(txt);

    console.log(task)
    console.log(task.closeComment)

    DataManager.updateServiceById(task.id, task);

}




















































async function confirmDone(taskid, globalComment, rate) {
    console.log('done')
    console.log(taskid)

    const task = await DataManager.getServiceById(taskid);
    let usersId = await DataManager.getUsersWithActiveTaskIds(taskid);

    console.log(taskid)
    console.log(usersId)
    let user1 = await DataManager.getUserById([usersId[0]]);
    let user2 = await DataManager.getUserById([usersId[1]]);
    const price = parseInt(task.price)


    user1 = User.createUserFromObject(user1);
    user2 = User.createUserFromObject(user2);

    console.log(user1)
    console.log(user2)

    try { await finalTranzaction(user1, price, rate); } catch { console.log("ошибка транзакции") }
    try { await finalTranzaction(user2, price, rate); } catch { console.log("ошибка транзакции") }

    // let user = User.load();
    // user = await DataManager.getUserById(user.id)
    // user = User.createUserFromObject(user);


    task.status = "ready";
    task.rate = rate + "";
    task.globalComment = globalComment;

    DataManager.updateServiceById(task.id, task);
}
async function finalTranzaction(user, count, rate) {


    console.log(user);
    console.log(user.implementer)
    console.log('count: ', count)
    if (user.implementer) {
        const nowBalance = user.balance.getActiveBalance()
        console.log('countNow: ', nowBalance)
        console.log('res: ', parseInt(nowBalance) + parseInt(count))
        user.balance.activeBalance = parseInt(nowBalance) + parseInt(count);
        console.log(user)

        if (rate) {
            if (user.rate && parseFloat(user.rate) > 0) {
                console.log(user.rate)
                user.rate = (parseFloat(user.rate) + parseFloat(rate)) / 2
                console.log(user.rate)
            } else {
                console.log(user.rate)
                user.rate = rate;
                console.log(user.rate)
            }
        }


        await user.saveToServer();
        // await DataManager.updateUserById(user.id, user);
        return
    }

    const isSpendFrozen = user.balance.spendFrozen(count)

    if (!isSpendFrozen) {
        if (!user.balance.spend(count)) console.log("!как так, за это банить надо. Таск выполнен а платить нечем")
    }


    // DataManager.updateUserById(user.id, user)
    user.saveToServer();

}

export async function goDeleteTask(container, id) {
    let user = User.load();
    user = await DataManager.getUserById(user.id)
    user = User.createUserFromObject(user);

    container.innerHTML = " ";
    // const tasksArray = getLsbyKey("services");
    console.log("del")

    // const indexToRemove = tasksArray.findIndex(item => item.id == id);
    const task = await DataManager.getServiceById(id);
    const indexToRemove = task.id;
    if (task.status == "inWork" || task.status == "ready" || task.status == "inСonfirm") {
        console.log("удаление не возможно")
        return
    }

    console.log(id)


    if (user.client) {
        const isUnFreeze = await user.balance.unfreeze(task.price, user.id);
        user.balanceHistory = isUnFreeze
        if (!isUnFreeze) console.log('ну что то с деньгами не так, обратитесь в тех поддержку')
    }


    await DataManager.deleteService(indexToRemove);

    console.log(indexToRemove);

    const field = user.client ? "listOfOrders" : "listOfServices";
    forceRemoveFromField("user", field, [id]);
    // user = User.load();
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
    const { id, img, title, price, descr, timing, owner, status } = data;

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
                            <div class="card__people txt cart-card__descr">${descr}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__title cart-card__title">перейти</a>
                        <button class="card__add" data-id="${id}">удалить</button>
                    </div>
                </div>
            `


    container.insertAdjacentHTML('beforeend', cardItem);

    const btn = container.querySelector(`[data-id="${id}"]`);
    if (status && (status == "inWork" || status == "inConfirm" || status == "ready")) {
        btn.classList.add("none")
    }

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

export async function renderTaskCard(data, container) {
    let user = User.load();
    user = await DataManager.getUserById(user.id)
    const { id, img, title, price, descr, timing, owner, ownerId, type, status } = data;
    let buffBtn;
    if (type == 'order') {
        buffBtn = `
        <button class="buy-btn btn  --for-implementer-only">выполнить</button>`
    } else if (type != 'order') {
        buffBtn = `
        <button class="buy-btn btn --for-client-only">заказать</button>`

    }
    if (user.id == ownerId) {
        buffBtn = ``
        console.log(status)
        if (user.id == ownerId && status != "inWork" && status != "ready" && status != "inСonfirm") {
            buffBtn = `
            <button class="buy-btn btn  ">Удалить</button>`
        }

        switch (status) {
            case "ready":
                buffBtn = ''

                break;
            case "pending":
                const pendingUsersId = await DataManager.getUsersWithPendingTaskIds(id);
                renderPartners(pendingUsersId, container, ownerId, id, true)
                break;
            case "inWork":
                if (user.implementer && user.activeTasks.includes(id))
                    buffBtn = '<button class="buy-btn btn  ">Готово!</button>'

                break;
            default:

        }
    }
    else {

        switch (status) {
            case "ready":

                buffBtn = ''

                break;
            case "pending":

                const pendingUsersId = await DataManager.getUsersWithPendingTaskIds(id);
                renderPartners(pendingUsersId, container, ownerId, id)

                if (user.pendingTasks && user.pendingTasks.includes(id)) {
                    buffBtn = '<button class="buy-btn btn btn--coward ">струсить 🐓</button>'
                }
                break;
            case "inWork":

                buffBtn = ''

                if (!user.activeTasks.includes(id)) {
                    const pendingUsersId = await DataManager.getUsersWithPendingTaskIds(id);
                    renderPartners(pendingUsersId, container, ownerId, id)
                } else {
                    if (user.implementer) {
                        buffBtn = `
                    <button class="buy-btn btn  ">готово</button>`}
                }
                break;
            default:

        }
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
    // if (task.status == "inWork" || task.status == "ready" || task.status == "inСonfirm")
    if (user.id == ownerId && status != "inWork" && status != "ready" && status != "inСonfirm") {
        evBtn.addEventListener('click', () => goDeleteTask(container, id));

    } else if (user.pendingTasks && user.pendingTasks.includes(id)) {
        evBtn.addEventListener('click', async () => await goReject(id, user.id).then(
            evBtn.remove()
        ));

    } else
        if (type == 'order' && status != 'inWork') {
            evBtn.addEventListener('click', () => goDoing(container, id));
        }
        else if (type != 'order' && status != 'inWork') {
            evBtn.addEventListener('click', () => goBuy(container, price, id));
        }
    if (user.implementer && status == 'inWork' && user.activeTasks.includes(id)) {
        evBtn.addEventListener('click', () => goDone(id, container).then(
            evBtn.remove()
        ));
    }
}



export async function renderPrivateComment(container, cardId) {
    console.log("renderCloseComments!")

    let user = User.load();
    user = await DataManager.getUserById(user.id);
    user = User.createUserFromObject(user);

    const card = await DataManager.getServiceById(cardId);
    console.log(card)

    if (!card.closeComment) return
    let cardCom = card.closeComment;

    let cardBlock = "";

    // console.log((user.id == card.ownerId || user.activeTasks.includes(parseInt(cardId))))
    if (!(user.id == card.ownerId || user.activeTasks.includes(parseInt(cardId)))) return



    //Из логики что автор коммента на отказ всегда клиент 
    let autor
    //на самом деле новая логика, нечетные - исполнитель четные клиент
    console.log(cardCom)
    cardCom = Array.isArray(cardCom) ? cardCom : [cardCom]
    console.log(cardCom)

    console.log(autor)

    const cardBlocks = await Promise.all(cardCom.map(async (com, index) => {
        const isEven = (index + 1) % 2 === 0; // Четный - клиент, нечетный исполнитель
        console.log(isEven);

        if (isEven) {
            if (!user.client) {
                autor = await DataManager.getUserById(card.ownerId);
            } else {
                autor = user;
            }
            return `<div class="card card--comment card--close-comment even">
            <img class="card__image" src="${autor.img}" alt="прекрасное лицо">
            <div class="card__content card">
              <h2 class="card__title title title--litle">${autor.bio}</h2>
              <p class="card__text txt">${com}</p>
            </div>
          </div>`;
        } else { //от клиента
            if (!user.client) {
                autor = user;
            } else {
                // static async getUsersWithActiveTaskIds(taskId) {
                let autors = await DataManager.getUsersWithActiveTaskIds(card.id);
                console.log(autors)
                autors = autors.filter((autor) => {
                    return autor != user.id;
                });
                let autorId = autors[0]


                autor = await DataManager.getUserById(autorId)
            }
            return `<div class="card card--comment card--close-comment odd card--client-com">
            <img class="card__image" src="${autor.img}" alt="прекрасное лицо">
            <div class="card__content card">
              <h2 class="card__title title title--litle">${autor.bio}</h2>
              <p class="card__text txt">${com}</p>
            </div>
          </div>`;
        }
    }));

    cardBlock = cardBlocks.join('');

    console.log(cardBlock)
    container.innerHTML += cardBlock;
    console.log(container)


}

export async function renderGlobalComment(container, normalId) {
    console.log(normalId)


    console.log("renderCloseComments!");


    const task = await DataManager.getServiceById(normalId);
    if (!task.globalComment) return;
    const com = task.globalComment;

    const cardBlock =
        `<div class="card card--comment card--global-comment even">
            <div class="card__content card">
              <h2 class="card__title title title--litle">Реальный отзыв клиента:</h2>
              <p class="card__text txt">${com}</p>
            </div>
          </div>`;




    console.log(cardBlock)
    container.innerHTML += cardBlock;
    console.log(container)


}

function renderPartners(usersIds, container, ownerId, id, isCreator = false) {
    const cont = document.createElement("div");
    cont.classList.add('container', 'container--partners');

    usersIds.forEach(async (userId) => {
        if (userId == ownerId) return
        let userData = await DataManager.getUserById(userId);
        if (userData) {
            console.log(userData)
            cardCreate(userData, cont, id, isCreator);
        }
    });
    container.appendChild(cont);
}

function cardCreate(userData, container, relativeTaskId, isCreator = false) {
    const card = document.createElement("div");
    card.classList.add("user-card");


    const image = document.createElement("img");
    image.src = `userPage.html?id=${userData.id}`;
    image.alt = userData.bio;

    const name = document.createElement("h2");
    name.textContent = userData.bio;

    const rating = document.createElement("p");
    rating.textContent = `Рейтинг: ${userData.rate}`;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(rating);


    if (isCreator) {
        const approveButton = document.createElement("button");
        approveButton.textContent = "Подтвердить";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Отменить";

        approveButton.addEventListener("click", () => {

            console.log(`Подтверждено: ${userData.bio}`);
            goInWork(userData.id, relativeTaskId);
        });
        cancelButton.addEventListener("click", async () => {

            console.log(`Отменено: ${userData.bio}`);
            //todo
            // goReject(userData.id);
            let us = await DataManager.getUserById(userData.id);
            us.pendingTasks = us.pendingTasks.filter(taskId => parseInt(taskId) != parseInt(relativeTaskId));
            us = User.createUserFromObject(us);

            DataManager.updateUserById(userData.id, us)

        });



        card.appendChild(approveButton);
        card.appendChild(cancelButton);
    }

    container.appendChild(card)

}