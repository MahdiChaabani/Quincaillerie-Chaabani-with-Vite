// categories.js - Module compatible avec Vite

// Fonction pour initialiser l'animation au scroll
export function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-on-scroll
    const elementsToObserve = document.querySelectorAll('.animate-on-scroll');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    return observer; // Retourner l'observer pour pouvoir le nettoyer si nécessaire
}

// Fonction pour l'effet parallaxe sur les cartes
export function initParallaxEffect() {
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = y / 10;
            const rotateY = -x / 10;
            
            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = '';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
}

// Fonction principale pour initialiser tous les effets
export function initCategoryAnimations() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollAnimation();
            initParallaxEffect();
        });
    } else {
        initScrollAnimation();
        initParallaxEffect();
    }
}

// Auto-initialisation si le script est importé directement
if (typeof window !== 'undefined') {
    initCategoryAnimations();
}

// Export par défaut
export default {
    initScrollAnimation,
    initParallaxEffect,
    initCategoryAnimations
};