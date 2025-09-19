import './style.css';

import { initSwipers } from './swipers.js';
import { initProductsSystem } from './fetch-products.js'; // Fixed import
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
  console.log('Initializing app...');
  
  // Initialize products system first
  initProductsSystem();
  
  // Initialize other components
  initSwipers();
  initUserFunctionality();
  
  // Add click listener for favorites icon in header
  const heartIcon = document.querySelector('header .fa-heart');
  if (heartIcon) {
    heartIcon.addEventListener('click', showFavorites);
  }
  
  console.log('App initialized');
});