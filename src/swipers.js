export function initSwipers() {
  // Initialize banner swiper (the one you're having trouble with)
  initBannerSwiper();
  
  // Initialize sidebar swiper
  initSidebarSwiper();
  
  // Initialize sales swiper
  initSalesSwiper();
}

// NEW: Function for your banner swiper
function initBannerSwiper() {
  const bannerSwiper = new Swiper('.swiperb', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'slide', // You can change this to 'fade', 'cube', 'coverflow', or 'flip'
  });
}

function initSidebarSwiper() {
  const sidebarSwiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 40,
    freeMode: true,
    direction: getDirection(),
    autoplay: {
      delay: 1500,
      disableOnInteraction: true,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    on: {
      resize: function () {
        sidebarSwiper.changeDirection(getDirection());
      },
    },
  });

  function getDirection() {
    var windowWidth = window.innerWidth;
    var direction = window.innerWidth <= 760 ? 'vertical' : 'horizontal';
    return direction;
  }
}

function initSalesSwiper() {
  const salesSwiper = new Swiper('.sale-sec', {
    slidesPerView: 6,
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      // Responsive breakpoints
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 15
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 20
      },
      1400: {
        slidesPerView: 6,
        spaceBetween: 20
      }
    }
  });

  // Manual hover event handling for better browser compatibility
  const swiperContainer = document.querySelector('.sale-sec');
  
  if (swiperContainer) {
    // Pause autoplay on mouse enter
    swiperContainer.addEventListener('mouseenter', function() {
      salesSwiper.autoplay.stop();
    });

    // Resume autoplay on mouse leave
    swiperContainer.addEventListener('mouseleave', function() {
      salesSwiper.autoplay.start();
    });
  }
}