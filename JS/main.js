// Main JavaScript for homepage
document.addEventListener('DOMContentLoaded', function () {
    // Initialize components
    initializeCategories();
    initializeFeaturedProducts();
    initializeSearch();
    initializeCarousel();

    // Load cart count
    cart.updateCartDisplay();
});

// Initialize categories section
function initializeCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    let categoriesHTML = '';

    categories.forEach(category => {
        categoriesHTML += `
            <div class="col-lg-2 col-md-4 col-6 mb-4">
                <div class="card category-card h-100" onclick="goToCategory('${category.id}')">
                    <div class="card-body text-center">
                        <i class="${category.icon} category-icon"></i>
                        <h5 class="card-title">${category.name}</h5>
                        <p class="card-text text-muted">${category.count} منتج</p>
                    </div>
                </div>
            </div>
        `;
    });

    categoriesContainer.innerHTML = categoriesHTML;
}

// Initialize featured products
function initializeFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    const featuredProducts = getFeaturedProducts();
    let productsHTML = '';

    featuredProducts.forEach(product => {
        productsHTML += createProductCard(product);
    });

    featuredContainer.innerHTML = productsHTML;
}

// Create product card HTML
function createProductCard(product) {
    const discountBadge = product.discount ?
        `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${product.discount}%</span>` : '';

    const originalPrice = product.originalPrice ?
        `<span class="text-muted text-decoration-line-through me-2">${formatPrice(product.originalPrice)}</span>` : '';

    const stockStatus = product.inStock ?
        '<span class="badge bg-success">متوفر</span>' :
        '<span class="badge bg-danger">نفد المخزون</span>';

    return `
        <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative"  onclick="goToProduct('${product.id}')">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    ${discountBadge}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${product.description.substring(0, 100)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <span class="text-muted ms-2">(${product.reviews})</span>
                    </div>
                    <div class="product-price mb-2">
                        ${originalPrice}
                        <span class="fw-bold text-success">${formatPrice(product.price)}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        ${stockStatus}
                        <div>
                            <button class="btn btn-outline-primary btn-sm me-2" onclick="goToProduct('${product.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-primary btn-sm add-to-cart-btn" 
                                    data-product-id="${product.id}" 
                                    ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search button click
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Initialize carousel
function initializeCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        // Add auto-play functionality
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            touch: true
        });
    }
}

// Navigation functions
function goToCategory(categoryId) {
    window.location.href = `products.html?category=${categoryId}`;
}

function goToProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeLazyLoading();
});

// Page loading indicator
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75" style="z-index: 9999;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.remove();
    }
}

// Error handling
window.addEventListener('error', function (e) {
    console.error('خطأ في الصفحة:', e.error);
});

// Performance monitoring
window.addEventListener('load', function () {
    const loadTime = performance.now();
    console.log(`تم تحميل الصفحة في ${loadTime.toFixed(2)} مللي ثانية`);
});