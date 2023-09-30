

// карточки для секции всех тасков
export function createCards(container, data, usersData) {

    data.forEach(card => {
        const { id, img, title, price, descr, timing, owner } = card;
        let userName
        const userId = owner;
        const user = usersData.find(userData => userData.id === userId);

        if (user) {
            userName = user.bio;

        } else {
            userName = "Отличный исполнитель"
        }

        const cardItem =
            `
                <div class="card service-card" data-product-id="${id}">
                    <div class="card__top service-card_top">
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__image service-card__image --test-get-img">
                            <img class=" img"
                                src="${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label service-card__label">-${timing}%</div>
                    </div>
                    <div class="card__bottom service-card__bottom">
                        <div class="card__info ">
                            <div class="card__people heading service-card__heading">${userName}</div>
                            <div class="card__price card__price--common">${price}</div>
                        </div>
                        <a href="/servicePage.html?id=serviceCase${id}" class="card__title service-card__title">${title}</a>
                        <button class="card__add">В корзину</button>
                    </div>
                </div>
            `
        container.insertAdjacentHTML('beforeend', cardItem);
    });
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
}