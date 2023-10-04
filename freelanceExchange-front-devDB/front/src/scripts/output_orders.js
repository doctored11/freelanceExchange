const activeOrdersToggle = document.getElementById('activeOrdersToggle');
const acceptedOrdersToggle = document.getElementById('acceptedOrdersToggle');
const ordersContent = document.getElementById('ordersContent');
activeOrdersToggle.addEventListener('click', () => {
ordersContent.textContent = 'здесь проверяется фрилансер человек или заказчик'
                              
              
activeOrdersToggle.classList.add('active');
acceptedOrdersToggle.classList.remove('active');
});
            
acceptedOrdersToggle.addEventListener('click', () => {
ordersContent.textContent = 'и здесь тоже проверить надо и вывести нужные карточки';
              
activeOrdersToggle.classList.remove('active');
acceptedOrdersToggle.classList.add('active');
});
