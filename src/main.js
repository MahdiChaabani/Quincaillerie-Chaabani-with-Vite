import './style.css';

import { initSwipers } from './swipers.js';
import { fetchProducts } from './fetch-products.js';
import { openCart, closeCart, removeProductFromCart, addProductToCart } from './cart.js';

// Make functions globally available for onclick in HTML
window.openCart = openCart;
window.closeCart = closeCart;
window.removeProductFromCart = removeProductFromCart;
window.addProductToCart = addProductToCart;

document.addEventListener('DOMContentLoaded', () => {
  initSwipers();
  fetchProducts();
});