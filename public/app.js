function showOrder() {
  document.querySelector('.order').className = 'order shown';
}

document.querySelector('#order-button').addEventListener('click', showOrder);

document.querySelector('#order-box-close').addEventListener('click', () => {
  document.querySelector('.order').className = 'order hidden';
})