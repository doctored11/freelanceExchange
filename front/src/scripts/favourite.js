let stars = document.querySelectorAll('.card__star');
function updateFavourite(element) {
    element.src = './files/star.svg'
}
stars.forEach((element) => element.addEventListener('click', () => { updateFavourite(element) }));