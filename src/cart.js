import { showNotification } from './notifications.js';

// Global variables for cart
let products_in_cart = [];
let all_products_items = [];
const items_in_cart = document.querySelector('.items-in-cart');
const cart = document.querySelector('.cart');

// Export function to set products data
export function setAllProductsItems(products) {
  all_products_items = products;
}

// Cart open/close functions
export function openCart() {
  cart.classList.add('open');
}

export function closeCart() {
  cart.classList.remove('open');
}
// Add product to cart function
export function addProductToCart(id, btn) {
  console.log('Adding product to cart:', id, all_products_items); // Debug log
  
  if (!all_products_items || all_products_items.length === 0) {
    console.error('Products data not available');
    showNotification('Error: Products data not loaded', 'warning');
    return;
  }

  // Normalize ID
  const productId = typeof id === 'string' ? parseInt(id) : id;

  // ✅ Check against normalized productId
  const existingProduct = products_in_cart.find(product => product.id === productId);
  if (existingProduct) {
    showNotification('This product is already in your cart!✅ <br> Check it out 👀', 'warning');
    return;
  }

  // ✅ Find product using normalized productId
  const productToAdd = all_products_items.find(p => p.id === productId);
  
  if (!productToAdd) {
    console.error('Product not found:', productId);
    showNotification('Error: Product not found', 'warning');
    return;
  }

  // Add product with quantity
  products_in_cart.push({
    ...productToAdd,
    quantity: 1
  });

  if (btn) {
    btn.classList.add('active');
  }

  console.log('Product added to cart:', products_in_cart);
  showNotification('Product added to cart successfully!', 'info');
  getcartitems();
}


// Generate cart items HTML
function getcartitems() {
  let item_in_cart = "";
  for (let i = 0; i < products_in_cart.length; i++) {
    item_in_cart += `
      <div class="item-cart" data-index="${i}">
        <div class="img-cart">
          <img src="${products_in_cart[i].image}" alt="${products_in_cart[i].name}">
        </div>
        <div class="content-cart">
          <h4>${products_in_cart[i].name}</h4>
          <p class="price-cart">${products_in_cart[i].price} TND </p>
          <div class="quantity" data-index="${i}">
            <span class="minus" data-index="${i}">-</span>
            <span class="num">${products_in_cart[i].quantity || 1}</span>
            <span class="plus" data-index="${i}">+</span>
          </div>
        </div>
        <button class="remove-item" data-index="${i}">
          <i class="fa-solid fa-trash fa-lg"></i>
        </button>
      </div>
    `;
  }
  items_in_cart.innerHTML = item_in_cart;
  initQuantityListeners();
  initRemoveListeners();
}

// Remove product from cart
export function removeProductFromCart(index) {
  const productIndex = typeof index === 'string' ? parseInt(index) : index;
  
  if (productIndex >= 0 && productIndex < products_in_cart.length) {
    const removedProduct = products_in_cart[productIndex];
    products_in_cart.splice(productIndex, 1);
    
    // Remove active state from corresponding button
    const productButtons = document.querySelectorAll(`[onclick*="addProductToCart(${removedProduct.id}"]`);
    productButtons.forEach(btn => btn.classList.remove('active'));
    
    showNotification('Product removed from cart', 'info');
    getcartitems();
    
    if (products_in_cart.length === 0) {
      items_in_cart.innerHTML = "<p style='text-align: center; color: var(--dark-color);font-family: cursive; font-weight: 500; font-size: 1rem'>Your cart is empty</p>";
    }
  }
}

// Initialize remove button listeners
function initRemoveListeners() {
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(button.getAttribute('data-index'));
      removeProductFromCart(index);
    });
  });
}

// Initialize quantity listeners
function initQuantityListeners() {
  document.querySelectorAll('.quantity').forEach(quantity => {
    const index = parseInt(quantity.getAttribute('data-index'));
    const num = quantity.querySelector('.num');
    const minusBtn = quantity.querySelector('.minus');
    const plusBtn = quantity.querySelector('.plus');
    
    // Remove existing listeners by cloning elements
    const newPlusBtn = plusBtn.cloneNode(true);
    const newMinusBtn = minusBtn.cloneNode(true);
    plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
    minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
    
    // Update disabled state
    updateMinusButtonState(newMinusBtn, parseInt(num.textContent));
    

  });
}

// Update minus button disabled state
function updateMinusButtonState(minusBtn, quantity) {
  if (quantity <= 1) {
    minusBtn.classList.add('disabled');
  } else {
    minusBtn.classList.remove('disabled');
  }
}

// Initialize quantity functionality globally for dynamically added elements
document.addEventListener('DOMContentLoaded', function() {
  // Global event delegation for quantity buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('plus')) {
      const quantityElement = e.target.parentElement.querySelector('.num');
      const index = parseInt(e.target.getAttribute('data-index'));
      
      if (!isNaN(index) && products_in_cart[index]) {
        let currentQuantity = parseInt(quantityElement.textContent);
        currentQuantity++;
        quantityElement.textContent = currentQuantity;
        products_in_cart[index].quantity = currentQuantity;
        
        // Enable minus button
        const minusBtn = e.target.parentElement.querySelector('.minus');
        minusBtn.classList.remove('disabled');
      }
    }
    
    if (e.target.classList.contains('minus') && !e.target.classList.contains('disabled')) {
      const quantityElement = e.target.parentElement.querySelector('.num');
      const index = parseInt(e.target.getAttribute('data-index'));
      
      if (!isNaN(index) && products_in_cart[index]) {
        let currentQuantity = parseInt(quantityElement.textContent);
        
        if (currentQuantity > 1) {
          currentQuantity--;
          quantityElement.textContent = currentQuantity;
          products_in_cart[index].quantity = currentQuantity;
          
          // Disable minus button if quantity reaches 1
          if (currentQuantity === 1) {
            e.target.classList.add('disabled');
          }
        }
      }
    }
  });
});