import { setAllProductsItems } from './cart.js';
import { setAllProductsItemsForFavorites } from './favorites.js';
import { Swiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

let allProductsData = {};
let currentSwiper = null;

export function initProductsSystem() {
  fetchProducts();
  initCategoryTabs();
}

function fetchProducts() {
  fetch('/items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Products fetched:', data);
      allProductsData = data;
      
      // Flatten all products for cart and favorites
      const allProducts = Object.values(data).flat();
      setAllProductsItems(allProducts);
      setAllProductsItemsForFavorites(allProducts);
      
      // Load default category (sanitaire)
      displayProducts('sanitaire');
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      // Fallback - try different path
      fetch('/public/Data/items.json')
        .then(response => response.json())
        .then(data => {
          console.log('Products fetched (fallback):', data);
          allProductsData = data;
          const allProducts = Object.values(data).flat();
          setAllProductsItems(allProducts);
          setAllProductsItemsForFavorites(allProducts);
          displayProducts('sanitaire');
        })
        .catch(fallbackError => {
          console.error('Fallback fetch also failed:', fallbackError);
        });
    });
}

function initCategoryTabs() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      categoryTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Get category from tab text or data attribute
      const categoryText = this.textContent.trim().toLowerCase();
      let category;
      
      switch(categoryText) {
        case 'robinetterie':
          category = 'robinetterie';
          break;
        case 'sanitaire':
          category = 'sanitaire';
          break;
        case 'chauffage':
          category = 'chauffage';
          break;
        case 'outils':
          category = 'outils';
          break;
        default:
          category = 'sanitaire';
      }
      
      displayProducts(category);
    });
  });
}

function displayProducts(category) {
  const swiper_item_sale = document.getElementById('swiper-item-sale');
  if (!swiper_item_sale) {
    console.error('swiper-item-sale element not found');
    return;
  }
  
  const products = allProductsData[category] || [];
  
  // Destroy existing swiper if it exists
  if (currentSwiper) {
    currentSwiper.destroy(true, true);
    currentSwiper = null;
  }
  
  // Clear existing content
  swiper_item_sale.innerHTML = '';
  
  if (products.length === 0) {
    swiper_item_sale.innerHTML = '<div class="no-products swiper-slide">Aucun produit disponible dans cette catégorie</div>';
    return;
  }
  
  products.forEach(product => {
    const discount = Math.floor((product.old_price - product.price) / product.old_price * 100);
    
    // Determine if product is new and set display style
    let newProductDisplay = 'none';
    let newProductText = '';
    let disp = "";
    let dispo_style = "";
    
    if (product.new == 1) {
      newProductDisplay = 'inline-block';
      newProductText = 'New';
    }
    
    if (product.disponability == -1) {
      disp = "Rupture de stock";
      dispo_style = "rupture";
    }
    else if (product.disponability == 1) {
      disp = "Disponible";
      dispo_style = "disponible";
    }
    else {
      disp = "Stock limité";
      dispo_style = "stock-limit";
    }

    const productHTML = `
      <!-- product ${product.id} -->
      <div class="product swiper-slide">
        <div class="icons">
          <span><i id="heart" class="fa-solid fa-heart" onclick="toggleFavorite(${product.id}, this)" data-product-id="${product.id}"></i></span>
          <span><i onclick="addProductToCart(${product.id}, this)" class="fa-duotone fa-solid fa-cart-plus" data-product-id="${product.id}"></i></span>
          <span><i class="fa-solid fa-share-from-square"></i></span>
        </div>
        
        <span class="sale-discount">${discount}%</span>
        <span class="sale-new" style="display: ${newProductDisplay};">${newProductText}</span>

        <div class="img-product">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-name">
          <h4 class="name-product"><a href="#">${product.name}</a></h4>
        </div>
       
        <div class="price">
          <p><span>${product.price} TND</span></p>
          <p class="old-price">${product.old_price} TND</p>
        </div>
        <span class="product-status ${dispo_style}">${disp}</span>
      </div>
    `;
    
    swiper_item_sale.innerHTML += productHTML;
  });
  
  // Reinitialize Swiper after content is loaded
  initializeSwiper();
}

function initializeSwiper() {
  // Wait a bit for DOM to be ready
  setTimeout(() => {
    try {
      currentSwiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 30,
          }
        }
      });
      
      console.log('Swiper initialized successfully');
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }, 100);
}

// Make functions globally available if needed
window.displayProducts = displayProducts;

// Export for use in other modules
export { displayProducts, allProductsData };