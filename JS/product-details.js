// Product details page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetails(productId);
        loadRelatedProducts(productId);
    } else {
        // Redirect to products page if no ID
        window.location.href = 'products.html';
    }

    // Load cart count
    cart.updateCartDisplay();

    // Initialize search
    initializeSearch();
});

// Load product details
function loadProductDetails(productId) {
    const product = getProductById(productId);

    if (!product) {
        showProductNotFound();
        return;
    }

    // Update page title and breadcrumb
    document.title = `${product.name} - المتجر الإلكتروني`;
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    // Display product details
    displayProductDetails(product);
}

// Display product details
function displayProductDetails(product) {
    const productDetails = document.getElementById('productDetails');
    if (!productDetails) return;

    const discountBadge = product.discount ?
        `<span class="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">-${product.discount}%</span>` : '';

    const originalPrice = product.originalPrice ?
        `<span class="text-muted text-decoration-line-through me-2 fs-5">${formatPrice(product.originalPrice)}</span>` : '';

    const stockStatus = product.inStock ?
        '<span class="badge bg-success fs-6">متوفر في المخزون</span>' :
        '<span class="badge bg-danger fs-6">نفد من المخزون</span>';

    const specifications = product.specifications.map(spec =>
        `<li class="list-group-item d-flex align-items-center">
            <i class="fas fa-check text-success me-2"></i>
            ${spec}
        </li>`
    ).join('');

    const images = product.images || [product.image];
    const mainImage = images[0];
    const thumbnails = images.map((img, index) =>
        `<img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" 
              alt="${product.name}" onclick="changeMainImage('${img}')">`
    ).join('');

    productDetails.innerHTML = `
        <div class="col-lg-6 col-md-6 mb-4">
            <div class="product-gallery">
                <div class="position-relative">
                    <img src="${mainImage}" class="main-image" id="mainImage" alt="${product.name}">
                    ${discountBadge}
                </div>
                <div class="thumbnail-images mt-3">
                    ${thumbnails}
                </div>
            </div>
        </div>
        
        <div class="col-lg-6 col-md-6">
            <div class="product-info">
                <h1 class="product-title">${product.name}</h1>
                
                <div class="product-rating mb-3">
                    ${generateStarRating(product.rating)}
                    <span class="text-muted ms-2">(${formatNumberToArabic(product.reviews)} تقييم)</span>
                </div>
                
                <div class="product-price mb-3">
                    ${originalPrice}
                    <span class="fw-bold text-success fs-3">${formatPrice(product.price)}</span>
                </div>
                
                <div class="mb-3">
                    ${stockStatus}
                </div>
                
                <div class="product-description mb-4">
                    <p class="lead">${product.description}</p>
                </div>
                
                <div class="specifications mb-4">
                    <h5 class="fw-bold mb-3">المواصفات:</h5>
                    <ul class="list-group list-group-flush">
                        ${specifications}
                    </ul>
                </div>
                
                <div class="quantity-selector mb-4">
                    <label class="form-label fw-bold">الكمية:</label>
                    <div class="d-flex align-items-center">
                        <button class="quantity-btn" onclick="decreaseQuantity()" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="10" ${!product.inStock ? 'disabled' : ''}>
                        <button class="quantity-btn" onclick="increaseQuantity()" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="d-grid gap-2 d-md-flex">
                    <button class="btn btn-primary btn-lg flex-fill add-to-cart-btn" 
                            data-product-id="${product.id}" 
                            onclick="addToCartWithQuantity('${product.id}')"
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart me-2"></i>
                        ${product.inStock ? 'إضافة إلى السلة' : 'نفد من المخزون'}
                    </button>
                    <button class="btn btn-outline-primary btn-lg" onclick="goToProducts()">
                        <i class="fas fa-arrow-right me-2"></i>
                        متابعة التسوق
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load related products
function loadRelatedProducts(productId) {
    const relatedProducts = getRelatedProducts(productId, 4);
    const relatedContainer = document.getElementById('relatedProducts');

    if (!relatedContainer || relatedProducts.length === 0) return;

    let relatedHTML = '';
    relatedProducts.forEach(product => {
        relatedHTML += createProductCard(product);
    });

    relatedContainer.innerHTML = relatedHTML;
}

// Create product card for related products
function createProductCard(product) {
    const discountBadge = product.discount ?
        `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${product.discount}%</span>` : '';

    const originalPrice = product.originalPrice ?
        `<span class="text-muted text-decoration-line-through me-2">${formatPrice(product.originalPrice)}</span>` : '';

    const stockStatus = product.inStock ?
        '<span class="badge bg-success">متوفر</span>' :
        '<span class="badge bg-danger">نفد المخزون</span>';

    return `
        <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative"  onclick="goToProduct('${product.id}')">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" loading="lazy">
                    ${discountBadge}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${product.description.substring(0, 80)}...</p>
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

// Show product not found
function showProductNotFound() {
    const productDetails = document.getElementById('productDetails');
    if (productDetails) {
        productDetails.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h2>المنتج غير موجود</h2>
                    <p class="text-muted mb-4">عذراً، لم يتم العثور على المنتج المطلوب</p>
                    <a href="products.html" class="btn btn-primary">تصفح المنتجات</a>
                </div>
            </div>
        `;
    }
}

// Change main image
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === imageSrc) {
            thumb.classList.add('active');
        }
    });
}

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max);
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const minValue = parseInt(quantityInput.min);
        if (currentValue > minValue) {
            quantityInput.value = currentValue - 1;
        }
    }
}

// Add to cart with quantity
function addToCartWithQuantity(productId) {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    cart.addItem(productId, quantity);
}

// Navigation functions
function goToProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

function goToProducts() {
    window.location.href = 'products.html';
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