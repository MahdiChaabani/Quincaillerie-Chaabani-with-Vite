import { showNotification } from './notifications.js';

// Global variables for favorites
let products_in_favorites = [];
let all_products_items = [];

// Export function to set products data
export function setAllProductsItemsForFavorites(products) {
  all_products_items = products;
}

// Add/Remove product from favorites
export function toggleFavorite(id, heartIcon) {
  console.log('Toggling favorite for product:', id);
  
  if (!all_products_items || all_products_items.length === 0) {
    console.error('Products data not available');
    showNotification('Données des produits non chargées', 'warning');
    return;
  }

  // Normalize ID
  const productId = typeof id === 'string' ? parseInt(id) : id;

  // Check if product is already in favorites
  const existingIndex = products_in_favorites.findIndex(product => product.id === productId);
  
  if (existingIndex !== -1) {
    // Remove from favorites
    products_in_favorites.splice(existingIndex, 1);
    heartIcon.classList.remove('active');
    heartIcon.style.color = '';
    showNotification('Produit retiré des favoris ❤️', 'info');
  } else {
    // Add to favorites
    const productToAdd = all_products_items.find(p => p.id === productId);
    
    if (!productToAdd) {
      console.error('Product not found:', productId);
      showNotification('Error: Produit introuvable', 'warning');
      return;
    }

    products_in_favorites.push(productToAdd);
    heartIcon.classList.add('active');
    heartIcon.style.color = '#e74c3c';
    showNotification('Produit ajouté aux favoris ! ❤️', 'info');
  }

  updateFavoriteCount();
  console.log('Favorites updated:', products_in_favorites);
}

// Update favorite count in header
function updateFavoriteCount() {
  const countElement = document.querySelector('.count-item-fav');
  if (countElement) {
    countElement.textContent = products_in_favorites.length;
  }
}

// Show favorites modal/panel
export function showFavorites() {
  // Always remove existing modal first
  const existingModal = document.querySelector('.favorites-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create new favorites modal
  const favoritesModal = document.createElement('div');
  favoritesModal.className = 'favorites-modal';
  favoritesModal.innerHTML = `
    <div class="favorites-content">
      <div class="favorites-header">
        <h3>Mes Favoris <span>(${products_in_favorites.length} Article${products_in_favorites.length !== 1 ? 's' : ''})</span></h3>
        <span class="close-favorites">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div class="favorites-items">
        ${getFavoritesHTML()}
      </div>
      <div class="favorites-footer">
        <button class="btn-favorites">
          Continuer mesC achats
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(favoritesModal);

  // Add close event listeners
  favoritesModal.querySelector('.close-favorites').addEventListener('click', () => {
    favoritesModal.remove();
  });

  favoritesModal.querySelector('.btn-favorites').addEventListener('click', () => {
    favoritesModal.remove();
  });

  // Close on background click
  favoritesModal.addEventListener('click', (e) => {
    if (e.target === favoritesModal) {
      favoritesModal.remove();
    }
  });

  // Add remove listeners for favorite items
  initFavoriteRemoveListeners();
}

// Generate favorites items HTML
function getFavoritesHTML() {
  if (products_in_favorites.length === 0) {
    return `
      <div class="empty-favorites">
        <i class="fa-solid fa-heart-broken fa-3x"></i>
        <p>Aucun produit dans vos favoris</p>
        <p>Ajoutez des produits à vos favoris pour les retrouver facilement !</p>
      </div>
    `;
  }

  let favoritesHTML = "";
  products_in_favorites.forEach((product, index) => {
    const discount = Math.floor((product.old_price - product.price) / product.old_price * 100);
    
    favoritesHTML += `
      <div class="favorite-item" data-index="${index}">
        <div class="favorite-img">
          <img src="${product.image}" alt="${product.name}">
          <span class="sale-badge">${discount}%</span>
        </div>
        <div class="favorite-content">
          <h4>${product.name}</h4>
          <div class="favorite-price">
            <span class="current-price">${product.price} TND</span>
            <span class="old-price">${product.old_price} TND</span>
          </div>
          <div class="favorite-actions">
            <button class="add-to-cart-btn" onclick="addProductToCartFromFavorites(${product.id})">
              <i class="fa-solid fa-cart-plus"></i> Ajouter au panier
            </button>
            <button class="remove-favorite-btn" data-index="${index}">
              <i class="fa-solid fa-heart-broken"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  return favoritesHTML;
}

// Remove product from favorites
export function removeFromFavorites(index) {
  const productIndex = typeof index === 'string' ? parseInt(index) : index;
  
  if (productIndex >= 0 && productIndex < products_in_favorites.length) {
    const removedProduct = products_in_favorites[productIndex];
    products_in_favorites.splice(productIndex, 1);
    
    // Update heart icon in product display
    const heartIcons = document.querySelectorAll(`[onclick*="toggleFavorite(${removedProduct.id}"]`);
    heartIcons.forEach(icon => {
      icon.classList.remove('active');
      icon.style.color = '';
    });
    
    updateFavoriteCount();
    showNotification('Produit retiré des favoris', 'info');
    
    // Refresh favorites modal if open
    const favoritesModal = document.querySelector('.favorites-modal');
    if (favoritesModal) {
      favoritesModal.querySelector('.favorites-items').innerHTML = getFavoritesHTML();
      favoritesModal.querySelector('.favorites-header span').innerHTML = `(${products_in_favorites.length} Article${products_in_favorites.length !== 1 ? 's' : ''})`;
      initFavoriteRemoveListeners();
    }
  }
}

// Add to cart from favorites
export function addProductToCartFromFavorites(id) {
  // Import addProductToCart dynamically to avoid circular dependency
  import('./cart.js').then(({ addProductToCart }) => {
    addProductToCart(id);
  });
}

// Initialize remove listeners for favorites modal
function initFavoriteRemoveListeners() {
  document.querySelectorAll('.remove-favorite-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(button.getAttribute('data-index'));
      removeFromFavorites(index);
    });
  });
}

// Make functions globally available
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.addProductToCartFromFavorites = addProductToCartFromFavorites;