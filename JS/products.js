// Products page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize products page
    initializeProductsPage();
    initializeFilters();
    initializePagination();
    initializeSearch();

    // Load cart count
    cart.updateCartDisplay();
});

// Global variables
let currentPage = 1;
let productsPerPage = 12;
let currentFilters = {
    category: 'all',
    minPrice: '',
    maxPrice: '',
    rating: '',
    query: ''
};
let currentSort = 'default';

// Initialize products page
function initializeProductsPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category) {
        currentFilters.category = category;
    }

    if (search) {
        currentFilters.query = search;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = search;
        }
    }

    // Load category filters
    loadCategoryFilters();

    if (category) {
        const categoryRadio = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryRadio) {
            categoryRadio.checked = true;
        }
    }

    // Load and display products
    loadProducts();
}

// Load category filters
function loadCategoryFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;

    let filtersHTML = `
        <div class="form-check">
            <input class="form-check-input" type="radio" name="category" id="categoryAll" value="all" ${currentFilters.category === 'all' ? 'checked' : ''}>
            <label class="form-check-label" for="categoryAll">جميع المنتجات</label>
        </div>
    `;

    categories.forEach(category => {
        filtersHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="category${category.id}" value="${category.id}">
                <label class="form-check-label" for="category${category.id}">
                    ${category.name} (${category.count})
                </label>
            </div>
        `;
    });

    categoryFilter.innerHTML = filtersHTML;
}

function loadProducts() {
    showLoadingSpinner();

    setTimeout(() => {
        let filteredProducts = filterProducts(currentFilters);
        filteredProducts = sortProducts(filteredProducts, currentSort);

        // Update products count
        updateProductsCount(filteredProducts.length);

        // Paginate products
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Display products
        displayProducts(paginatedProducts);

        // Update pagination
        updatePagination(filteredProducts.length);
    }, 500);
}


// Display products
function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>لا توجد منتجات</h4>
                    <p class="text-muted">لم يتم العثور على منتجات تطابق معايير البحث</p>
                    <button class="btn btn-primary" onclick="resetFilters()">إعادة تعيين الفلاتر</button>
                </div>
            </div>
        `;
        return;
    }

    let productsHTML = '';
    products.forEach(product => {
        productsHTML += createProductCard(product);
    });

    productsContainer.innerHTML = productsHTML;
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
        <div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative" onclick="goToProduct('${product.id}')">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" loading="lazy">
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

// Initialize filters
function initializeFilters() {
    // Category filter
    document.addEventListener('change', function (e) {
        if (e.target.name === 'category') {
            currentFilters.category = e.target.value;
            currentPage = 1;
            loadProducts();
        }

        if (e.target.name === 'rating') {
            currentFilters.rating = e.target.value;
            currentPage = 1;
            updateURLParams();
            loadProducts();
        }
    });

    // Price filters
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(function () {
            currentFilters.minPrice = minPriceInput.value;
            currentPage = 1;
            loadProducts();
        }, 500));
    }

    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(function () {
            currentFilters.maxPrice = maxPriceInput.value;
            currentPage = 1;
            loadProducts();
        }, 500));
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            currentSort = this.value;
            loadProducts();
        });
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function () {
            loadProducts();
        });
    }

    // Reset filters button
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

// Reset filters
function resetFilters() {
    currentFilters = {
        category: 'all',
        minPrice: '',
        maxPrice: '',
        rating: '',
        query: ''
    };
    currentSort = 'default';
    currentPage = 1;

    // Reset form elements
    document.getElementById('categoryAll').checked = true;
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'default';

    // Reset rating filter
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => input.checked = false);

    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    loadProducts();
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function () {
        currentFilters.query = this.value;
        currentPage = 1;
        updateURLParams();
        loadProducts();
    }, 300));

    // Search button
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            currentFilters.query = searchInput.value;
            currentPage = 1;
            updateURLParams();
            loadProducts();
        });
    }
}

// Initialize pagination
function initializePagination() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            const page = parseInt(e.target.getAttribute('data-page'));
            if (page && page !== currentPage) {
                currentPage = page;
                loadProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// Update products count
function updateProductsCount(count) {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.textContent = formatNumberToArabic(count);
    }
}

// Update pagination
function updatePagination(totalProducts) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${currentPage - 1}">السابق</a>
            </li>
        `;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="1">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${formatNumberToArabic(i)}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${totalPages}">${formatNumberToArabic(totalPages)}</a>
            </li>
        `;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${currentPage + 1}">التالي</a>
            </li>
        `;
    }

    pagination.innerHTML = paginationHTML;
}

// Navigation functions
function goToProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Utility functions
function debounce(func, wait) {
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

function updateURLParams() {
    const params = new URLSearchParams();

    if (currentFilters.category && currentFilters.category !== 'all') {
        params.set('category', currentFilters.category);
    }

    if (currentFilters.query) {
        params.set('search', currentFilters.query);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState({}, '', newUrl);
}

function showLoadingSpinner(message = "جاري تحميل المنتجات...") {
    const container = document.getElementById('productsContainer');
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">${message}</span>
            </div>
            <div class="text-muted">${message}</div>
        </div>
    `;
}

