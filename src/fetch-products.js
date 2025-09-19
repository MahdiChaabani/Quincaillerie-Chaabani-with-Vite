import { setAllProductsItems } from './cart.js';
import { setAllProductsItemsForFavorites } from './favorites.js';
import { Swiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

let allProductsData = {};
let swipers = {};

// Quick config for all sections
const sections = {
  'mySwiper_outillages': { 
    container: 'swiper-item-outillages',
    defaultCategory: 'outils'
  },
  'mySwiper_visserie': { 
    container: 'swiper-item-visserie',
    defaultCategory: 'outils' // Use existing data for now
  },
  'mySwiper_electricité': { 
    container: 'swiper-item-electricité',
    defaultCategory: 'robinetterie'
  },
  'mySwiper_plomberie': { 
    container: 'swiper-item-plomberie',
    defaultCategory: 'sanitaire'
  },
  'mySwiper_peintures': { 
    container: 'swiper-item-peintures',
    defaultCategory: 'chauffage'
  }
};

export function initProductsSystem() {
  fetchProducts();
  initAllTabs();
}

function fetchProducts() {
  fetch('/items.json')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      allProductsData = data;
      const allProducts = Object.values(data).flat();
      setAllProductsItems(allProducts);
      setAllProductsItemsForFavorites(allProducts);
      
      // Load all sections
      Object.keys(sections).forEach(swiperClass => {
        const config = sections[swiperClass];
        loadProducts(config.container, config.defaultCategory);
        initSwiper(swiperClass);
      });
    })
    .catch(() => {
      // Fallback
      fetch('/public/Data/items.json')
        .then(response => response.json())
        .then(data => {
          allProductsData = data;
          const allProducts = Object.values(data).flat();
          setAllProductsItems(allProducts);
          setAllProductsItemsForFavorites(allProducts);
          
          Object.keys(sections).forEach(swiperClass => {
            const config = sections[swiperClass];
            loadProducts(config.container, config.defaultCategory);
            initSwiper(swiperClass);
          });
        })
        .catch(err => console.error('Failed to load products:', err));
    });
}

function initAllTabs() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-tab')) {
      const section = e.target.closest('section');
      const swiperElement = section.querySelector('[class*="mySwiper_"]');
      if (!swiperElement) return;
      
      const swiperClass = swiperElement.className.split(' ').find(c => c.startsWith('mySwiper_'));
      const config = sections[swiperClass];
      if (!config) return;
      
      // Remove active from siblings
      section.querySelectorAll('.category-tab').forEach(tab => 
        tab.classList.remove('active')
      );
      e.target.classList.add('active');
      
      // Get category based on current data
      const category = getCategoryFromTab(e.target);
      loadProducts(config.container, category);
      
      // Refresh swiper
      if (swipers[swiperClass]) {
        setTimeout(() => swipers[swiperClass].update(), 100);
      }
    }
  });
}

function getCategoryFromTab(tab) {
  const text = tab.textContent.trim().toLowerCase();
  
  // Map to existing categories in your JSON
  const mapping = {
    'robinetterie': 'robinetterie',
    'sanitaire': 'sanitaire',
    'chauffage': 'chauffage',
    'outils': 'outils',
    
    // For new sections, use existing data temporarily
    'boulons & écrous': 'outils',
    'chevilles & plugs': 'robinetterie',
    'rondelles': 'sanitaire',
    'colliers & serre-joints': 'chauffage',
    
    'câbles & fils': 'outils',
    'tableaux électriques & disjoncteurs': 'robinetterie',
    'éclairage intérieur & extérieur': 'sanitaire',
    'accessoires électriques': 'chauffage',
    
    'tubes & raccords': 'outils',
    'robinets & mitigeurs': 'robinetterie',
    'chauffe-eau & accessoires': 'chauffage',
    'joints & accessoires d\'étanchéité': 'sanitaire',
    
    'peintures intérieures & extérieures': 'outils',
    'enduits & mastics': 'robinetterie',
    'vernis & lasures': 'sanitaire',
    'accessoires': 'chauffage'
  };
  
  return mapping[text] || 'outils';
}

function loadProducts(containerId, category) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const products = allProductsData[category] || [];
  
  container.innerHTML = products.length === 0 
    ? '<div class="no-products swiper-slide">Aucun produit disponible</div>'
    : products.map(createProductHTML).join('');
}

function createProductHTML(product) {
  const discount = Math.floor((product.old_price - product.price) / product.old_price * 100);
  const newDisplay = product.new == 1 ? 'inline-block' : 'none';
  
  let status = 'Disponible', statusClass = 'disponible';
  if (product.disponability == -1) {
    status = 'Rupture de stock';
    statusClass = 'rupture';
  } else if (product.disponability == 0) {
    status = 'Stock limité';
    statusClass = 'stock-limit';
  }

  return `
    <div class="product swiper-slide">
      <div class="icons">
        <span><i class="fa-solid fa-heart" onclick="toggleFavorite(${product.id}, this)" data-product-id="${product.id}"></i></span>
        <span><i onclick="addProductToCart(${product.id}, this)" class="fa-duotone fa-solid fa-cart-plus" data-product-id="${product.id}"></i></span>
        <span><i class="fa-solid fa-share-from-square"></i></span>
      </div>
      
      <span class="sale-discount">${discount}%</span>
      <span class="sale-new" style="display: ${newDisplay};">New</span>

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
      <span class="product-status ${statusClass}">${status}</span>
    </div>
  `;
}

function initSwiper(swiperClass) {
  setTimeout(() => {
    if (swipers[swiperClass]) {
      swipers[swiperClass].destroy(true, true);
    }
    
    try {
      swipers[swiperClass] = new Swiper(`.${swiperClass}`, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        navigation: {
          nextEl: `.${swiperClass} .swiper-button-next`,
          prevEl: `.${swiperClass} .swiper-button-prev`,
        },
        breakpoints: {
          640: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 25 },
          1200: { slidesPerView: 5, spaceBetween: 30 }
        }
      });
    } catch (error) {
      console.error(`Swiper error for ${swiperClass}:`, error);
    }
  }, 100);
}

// Global functions
window.displayProducts = (category, section) => {
  const config = Object.values(sections).find(s => s.container.includes(section));
  if (config) loadProducts(config.container, category);
};

export { allProductsData };