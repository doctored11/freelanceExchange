const ordersContainer = document.querySelector('.orders-container');
const ordersSlider = document.querySelector('.orders-slider');

// Функция для добавления заказов в блок-слайдер
function addOrdersToSlider(orders) {
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');
    orderCard.innerHTML = `
      <h3>${order.orderId}</h3>
      <p>${order.orderDetails}</p>
    `;
    ordersSlider.appendChild(orderCard);
  });
}

// Вызов функции для добавления заказов в слайдер
addOrdersToSlider(orders);