import './style.css';

import { initSwipers } from './swipers.js';
import { fetchProducts } from './fetch-products.js';
import { openCart, closeCart, removeProductFromCart, addProductToCart } from './cart.js';
import { toggleFavorite, showFavorites, removeFromFavorites, addProductToCartFromFavorites } from './favorites.js';
import { initUserFunctionality } from './user.js';

// Make functions globally available for onclick in HTML
window.openCart = openCart;
window.closeCart = closeCart;
window.removeProductFromCart = removeProductFromCart;
window.addProductToCart = addProductToCart;
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.removeFromFavorites = removeFromFavorites;
window.addProductToCartFromFavorites = addProductToCartFromFavorites;

document.addEventListener('DOMContentLoaded', () => {
  initSwipers();
  fetchProducts();
  initUserFunctionality(); // Initialize user dropdown functionality
  
  // Add click listener for favorites icon in header
  const heartIcon = document.querySelector('header .fa-heart');
  if (heartIcon) {
    heartIcon.addEventListener('click', showFavorites);
  }
});