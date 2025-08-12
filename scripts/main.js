// Main JavaScript for the marble website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initActiveNavigation();
    initMobileMenu();
    initFAQ();
    initGalleryLightbox();
    initCounterAnimation();
    initFadeInAnimation();
});

// Smooth scrolling with offset for sticky navbar
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navHeight = 80; // Approximate navbar height
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                }
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navHeight = 100;
    
    function updateActiveNavigation() {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navHeight && rect.bottom >= navHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
    
    // Update on load
    updateActiveNavigation();
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            
            // Update button icon
            const icon = this.querySelector('svg path');
            if (mobileMenu.classList.contains('show')) {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12'); // X icon
            } else {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Hamburger icon
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('svg path');
                    icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                }
            }
        });
    }
}

// FAQ accordion functionality
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-button');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const content = faqItem.querySelector('.faq-content');
            const icon = this.querySelector('.faq-icon');
            
            // Toggle current FAQ
            content.classList.toggle('show');
            icon.classList.toggle('rotate');
            
            // Close other FAQs
            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherContent = otherButton.parentElement.querySelector('.faq-content');
                    const otherIcon = otherButton.querySelector('.faq-icon');
                    otherContent.classList.remove('show');
                    otherIcon.classList.remove('rotate');
                }
            });
        });
    });
}

// Gallery lightbox functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxDetails = document.getElementById('lightbox-details');
    const lightboxClose = document.getElementById('lightbox-close');
    
    if (!lightbox) return;
    
    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const details = this.getAttribute('data-details');
            
            lightboxImage.src = imageSrc;
            lightboxImage.alt = title;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            lightboxDetails.textContent = details;
            
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}

// Counter animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const start = Date.now();
    const startValue = 0;
    
    function updateCounter() {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic(progress));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Fade in animation on scroll
function initFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Utility functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Performance optimization: Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/images/white.jpg',
        'assets/images/grey.jpg',
        'assets/images/c-villa.jpg',
        'assets/images/m-villa.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Console greeting
console.log('🏛️ شركة كسر الرخام المتخصصة');
console.log('📞 للتواصل: 0562755671');
console.log('🌐 موقعنا محمي بحقوق الطبع والنشر');