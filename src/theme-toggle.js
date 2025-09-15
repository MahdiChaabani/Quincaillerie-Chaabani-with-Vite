// Theme Toggle Class for better organization
        class ThemeToggle {
            constructor() {
                this.currentTheme = this.getStoredTheme();
                this.toggleBtn = null;
                this.init();
            }

            init() {
                // Load theme immediately to prevent flash
                this.applyTheme(this.currentTheme);
                
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
                } else {
                    this.setupEventListeners();
                }

                // Add CSS animations
                this.addAnimationStyles();
            }

            getStoredTheme() {
                return localStorage.getItem('theme') || 'light';
            }

            applyTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                this.currentTheme = theme;
            }

            setupEventListeners() {
                this.toggleBtn = document.querySelector('.theme-toggle');
                if (this.toggleBtn) {
                    // Remove any existing onclick to prevent conflicts
                    this.toggleBtn.removeAttribute('onclick');
                    this.toggleBtn.addEventListener('click', (e) => this.handleToggle(e));
                }
            }

            handleToggle(event) {
                event.preventDefault();
                
                const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                
                // Add click animation
                this.addClickAnimation();
                
                // Apply theme with slight delay for better UX
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        this.applyTheme(newTheme);
                        localStorage.setItem('theme', newTheme);
                        this.addPulseAnimation();
                    }, 100);
                });
            }

            addClickAnimation() {
                if (this.toggleBtn) {
                    this.toggleBtn.style.transform = 'scale(0.95) translateY(-2px)';
                    
                    setTimeout(() => {
                        this.toggleBtn.style.transform = 'translateY(-2px)';
                    }, 150);
                }
            }

            addPulseAnimation() {
                if (this.toggleBtn) {
                    this.toggleBtn.style.animation = 'pulse 0.6s ease-out';
                    setTimeout(() => {
                        this.toggleBtn.style.animation = '';
                    }, 600);
                }
            }

            addAnimationStyles() {
                // Check if styles already exist
                if (!document.getElementById('theme-animations')) {
                    const style = document.createElement('style');
                    style.id = 'theme-animations';
                    style.textContent = `
                        @keyframes pulse {
                            0% { transform: translateY(-2px) scale(1); }
                            50% { transform: translateY(-2px) scale(1.1); }
                            100% { transform: translateY(-2px) scale(1); }
                        }

                        @keyframes themeSwitch {
                            0% { opacity: 1; }
                            50% { opacity: 0.7; }
                            100% { opacity: 1; }
                        }

                        .theme-switching {
                            animation: themeSwitch 0.3s ease-in-out;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }

        // Enhanced Cart and User Management for Vite
        class HeaderManager {
            constructor() {
                this.cartCount = 0;
                this.favCount = 0;
                this.totalPrice = 0;
                this.init();
            }

            init() {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
                } else {
                    this.setupEventListeners();
                }
            }

            setupEventListeners() {
                // Remove onclick attributes and use event listeners for better Vite compatibility
                const userIcon = document.getElementById('user');
                const heartIcon = document.querySelector('.fa-heart');
                const cartIcon = document.getElementById('shop-cart');
                const totalPriceEl = document.querySelector('.total-price');

                if (userIcon) {
                    userIcon.removeAttribute('onclick');
                    userIcon.addEventListener('click', () => this.openUserDropdown());
                }

                if (heartIcon) {
                    heartIcon.removeAttribute('onclick');
                    heartIcon.addEventListener('click', () => this.showFavorites());
                }

                if (cartIcon) {
                    cartIcon.removeAttribute('onclick');
                    cartIcon.addEventListener('click', () => this.openCart());
                }

                if (totalPriceEl) {
                    totalPriceEl.removeAttribute('onclick');
                    totalPriceEl.addEventListener('click', () => this.openCart());
                }
            }

            openUserDropdown() {
                console.log('Opening user dropdown...');
                // Add ripple effect
                this.addRippleEffect(document.getElementById('user'));
                
                // Add your user dropdown logic here
                // Example: show/hide dropdown menu
            }

            showFavorites() {
                console.log('Showing favorites...');
                this.addRippleEffect(document.querySelector('.fa-heart'));
                
                // Add your favorites logic here
                // Example: toggle favorites panel
            }

            openCart() {
                console.log('Opening cart...');
                this.addRippleEffect(document.getElementById('shop-cart'));
                
                // Add your cart logic here
                // Example: slide in cart sidebar
            }

            addRippleEffect(element) {
                if (!element) return;
                
                element.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            }

            // Utility methods for cart management
            updateCartCount(count) {
                const countEl = document.querySelector('.count-item');
                if (countEl) {
                    countEl.textContent = count;
                    this.cartCount = count;
                }
            }

            updateFavCount(count) {
                const countEl = document.querySelector('.count-item-fav');
                if (countEl) {
                    countEl.textContent = count;
                    this.favCount = count;
                }
            }

            updateTotalPrice(price) {
                const priceEl = document.querySelector('.price-cart-head');
                if (priceEl) {
                    priceEl.textContent = `${price} DT`;
                    this.totalPrice = price;
                }
            }
        }

        // Initialize everything
        const themeToggle = new ThemeToggle();
        const headerManager = new HeaderManager();

        // Export for global access if needed
        window.themeToggle = themeToggle;
        window.headerManager = headerManager;

        // Vite HMR support
        if (import.meta.hot) {
            import.meta.hot.accept(() => {
                console.log('Theme module updated');
            });
        }