import { setAllProductsItems } from './cart.js';

export function fetchProducts() {
  fetch('public/Data/items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Products fetched:', data); // Debug log
      
      const swiper_item_sale = document.getElementById('swiper-item-sale');
      if (!swiper_item_sale) {
        console.error('swiper-item-sale element not found');
        return;
      }
      
      // Set products data in cart module
      setAllProductsItems(data);
      
      // Clear existing content
      swiper_item_sale.innerHTML = '';
      
      data.forEach(product => {
        const discount = Math.floor((product.old_price - product.price) / product.old_price * 100);
        
        // Determine if product is new and set display style
        let newProductDisplay = 'none';
        let newProductText = '';
        
        if (product.new == 1) {
          newProductDisplay = 'inline-block';
          newProductText = 'New';
        }

        swiper_item_sale.innerHTML += `
          <!-- product ${product.id} -->
          <div class="product swiper-slide">
            <div class="icons">
              <span><i id="heart" class="fa-solid fa-heart"></i></span>
              <span><i onclick="addProductToCart(${product.id}, this)" class="fa-duotone fa-solid fa-cart-plus" data-product-id="${product.id}"></i></span>
              <span><i class="fa-solid fa-share-from-square"></i></span>
              <span><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
            
            <span class="sale-present">${discount}%</span>
            <span class="sale-new" style="display: ${newProductDisplay};">${newProductText}</span>

            <div class="img-product">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-name">
              <h4 class="name-product"><a href="#">${product.name}</a></h4>
            </div>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="price">
              <p><span>${product.price} TND</span></p>
              <p class="old-price">${product.old_price} TND</p>
            </div>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}