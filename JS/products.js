// Products page functionality
document.addEventListener('DOMContentLoaded', function () {
    // ===== تهيئة اللغة =====
    initializeLanguage();
    setupLanguageSwitchers(); // ← تمييز الأزرار

    // ===== تهيئة الصفحة =====
    initializeProductsPage();
    initializeFilters();
    initializeSearch();

    // تحديث عرض السلة
    if (window.cart && typeof cart.updateCartDisplay === 'function') {
        cart.updateCartDisplay();
    }
});

// ===== إدارة اللغة =====
let currentLang = 'ar'; // الافتراضي

function initializeLanguage() {
    // 1. استرجاع اللغة من localStorage أو المتصفح
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.startsWith('fr') ? 'fr' :
        navigator.language.startsWith('en') ? 'en' : 'ar';
    currentLang = savedLang || browserLang;
    if (!['ar', 'en', 'fr'].includes(currentLang)) currentLang = 'ar';

    // 2. تطبيق اللغة والاتجاه
    document.documentElement.lang = currentLang;
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // 3. تمييز زر اللغة النشط
    updateLanguageButtons();

    // 4. تحميل الفلاتر باللغة الصحيحة
    loadCategoryFilters();
}

// ===== تهيئة أزرار تغيير اللغة (مرة واحدة) =====
function setupLanguageSwitchers() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            if (!['ar', 'en', 'fr'].includes(lang)) return;

            currentLang = lang;
            localStorage.setItem('preferredLang', lang);
            document.documentElement.lang = lang;
            document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

            updateLanguageButtons();
            loadCategoryFilters();
            loadProducts();
        });
    });
}

// ===== تمييز الزر النشط فقط =====
function updateLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

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
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category) currentFilters.category = category;
    if (search) {
        currentFilters.query = search;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = search;
    }

    loadCategoryFilters();

    const categoryRadio = document.querySelector(`input[name="category"][value="${currentFilters.category}"]`);
    if (categoryRadio) categoryRadio.checked = true;

    loadProducts();
}

// Load category filters
function loadCategoryFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;

    const t = {
        ar: 'جميع المنتجات',
        fr: 'Tous les produits',
        en: 'All Products'
    }[currentLang];

    let filtersHTML = `
        <div class="form-check">
            <input class="form-check-input" type="radio" name="category" id="categoryAll" value="all" ${currentFilters.category === 'all' ? 'checked' : ''}>
            <label class="form-check-label" for="categoryAll">${t}</label>
        </div>
    `;

    window.categories.forEach(category => {
        const name = category.name[currentLang] || category.name['en'] || category.name.ar;
        filtersHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="category${category.id}" value="${category.id}">
                <label class="form-check-label" for="category${category.id}">
                    ${name} (${category.count})
                </label>
            </div>
        `;
    });

    categoryFilter.innerHTML = filtersHTML;
}

// Load and filter products
function loadProducts() {
    showLoadingSpinner();

    setTimeout(() => {
        let filteredProducts = filterProducts(currentFilters);
        filteredProducts = filterProductsByQuery(filteredProducts, currentFilters.query);
        filteredProducts = sortProducts(filteredProducts, currentSort);

        window.productsCountValue = filteredProducts.length;
        updateProductsCount(filteredProducts.length);

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        displayProducts(paginatedProducts);
        updatePagination(filteredProducts.length);
    }, 300);
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    const t = currentLang === 'ar' ? {
        noProducts: 'لا توجد منتجات',
        noMatch: 'لم يتم العثور على منتجات تطابق معايير البحث',
        reset: 'إعادة تعيين الفلاتر'
    } : currentLang === 'fr' ? {
        noProducts: 'Aucun produit',
        noMatch: 'Aucun produit ne correspond',
        reset: 'Réinitialiser'
    } : {
        noProducts: 'No products',
        noMatch: 'No products match your criteria',
        reset: 'Reset Filters'
    };

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>${t.noProducts}</h4>
                <p class="text-muted">${t.noMatch}</p>
                <button class="btn btn-primary" onclick="resetFilters()">${t.reset}</button>
            </div>
        `;
        return;
    }

    let html = '';
    products.forEach(product => {
        html += createProductCard(product);
    });
    container.innerHTML = html;
}

// Create product card with language support
function createProductCard(product) {
    const lang = currentLang;

    const name = (product.name && product.name[lang]) || product.name['en'] || 'Product';
    const description = (product.description && product.description[lang]) || product.description['en'] || '';
    const truncatedDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;

    const discountBadge = product.discount
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${product.discount}%</span>`
        : '';

    const originalPrice = product.originalPrice
        ? `<span class="text-muted text-decoration-line-through me-2">${formatPrice(product.originalPrice)}</span>`
        : '';

    const stockText = product.inStock
        ? (lang === 'ar' ? 'متوفر' : lang === 'fr' ? 'Disponible' : 'In Stock')
        : (lang === 'ar' ? 'نفد المخزون' : lang === 'fr' ? 'Rupture' : 'Out of Stock');

    const stockBadge = `<span class="badge ${product.inStock ? 'bg-success' : 'bg-danger'}">${stockText}</span>`;

    return `
        <div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative" onclick="goToProduct('${product.id}')">
                    <img src="${product.image}" class="card-img-top product-image" alt="${name}" loading="lazy">
                    ${discountBadge}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text text-muted flex-grow-1">${truncatedDesc}</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <span class="text-muted ms-2">(${product.reviews})</span>
                    </div>
                    <div class="product-price mb-2">
                        ${originalPrice}
                        <span class="fw-bold text-success">${formatPrice(product.price)}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        ${stockBadge}
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

// Filter products by category, price, rating
function filterProducts(filters) {
    return window.products.filter(product => {
        if (filters.category !== 'all' && product.category !== filters.category) return false;
        if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
        if (filters.rating && product.rating < parseFloat(filters.rating)) return false;
        return true;
    });
}

// Search across multilingual fields
function filterProductsByQuery(products, query) {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(product => {
        const name = product.name;
        const desc = product.description;

        const nameMatch = typeof name === 'object'
            ? Object.values(name).some(val => String(val).toLowerCase().includes(q))
            : String(name).toLowerCase().includes(q);

        const descMatch = typeof desc === 'object'
            ? Object.values(desc).some(val => String(val).toLowerCase().includes(q))
            : String(desc).toLowerCase().includes(q);

        return nameMatch || descMatch;
    });
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating-desc':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}

// Initialize filters
function initializeFilters() {
    document.addEventListener('change', function (e) {
        if (e.target.name === 'category') {
            currentFilters.category = e.target.value;
            currentPage = 1;
            loadProducts();
        }
        if (e.target.name === 'rating') {
            currentFilters.rating = e.target.value;
            currentPage = 1;
            loadProducts();
        }
    });

    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(() => {
            currentFilters.minPrice = minPriceInput.value;
            currentPage = 1;
            loadProducts();
        }, 500));
    }

    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(() => {
            currentFilters.maxPrice = maxPriceInput.value;
            currentPage = 1;
            loadProducts();
        }, 500));
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            loadProducts();
        });
    }

    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// Reset filters
function resetFilters() {
    currentFilters = { category: 'all', minPrice: '', maxPrice: '', rating: '', query: '' };
    currentSort = 'default';
    currentPage = 1;

    document.getElementById('categoryAll').checked = true;
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'default';
    document.querySelectorAll('input[name="rating"]').forEach(i => i.checked = false);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    loadProducts();
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            performSearch();
        });
    }

    enableLiveSearch({ debounceMs: 250, minChars: 2 });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    currentFilters.query = searchInput.value.trim();
    currentPage = 1;
    loadProducts();
}

function enableLiveSearch({ debounceMs = 250, minChars = 1 } = {}) {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    if (searchInput._handler) {
        searchInput.removeEventListener('input', searchInput._handler);
    }

    const handler = debounce(() => {
        const q = (searchInput.value || '').trim();
        if (q.length >= minChars || q.length === 0) {
            currentFilters.query = q;
            currentPage = 1;
            loadProducts();
        }
    }, debounceMs);

    searchInput.addEventListener('input', handler);
    searchInput._handler = handler;
}

// Pagination
function updatePagination(totalProducts) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const t = currentLang === 'ar' ? { next: 'التالي', prev: 'السابق' } :
        currentLang === 'fr' ? { next: 'Suivant', prev: 'Précédent' } : { next: 'Next', prev: 'Previous' };

    let html = '';

    if (currentPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">${t.prev}</a></li>`;
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                 </li>`;
    }

    if (currentPage < totalPages) {
        html += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">${t.next}</a></li>`;
    }

    pagination.innerHTML = html;
}

document.addEventListener('click', e => {
    const target = e.target.closest('.page-link');
    if (target) {
        e.preventDefault();
        const page = parseInt(target.getAttribute('data-page'));
        if (page && page !== currentPage) {
            currentPage = page;
            loadProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// Utilities
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateProductsCount(count) {
    const el = document.getElementById('productsCount');
    if (el) el.textContent = count;
}

function generateStarRating(rating) {
    let stars = '';
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star text-warning"></i>';
    if (half) stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    for (let i = 0; i < empty; i++) stars += '<i class="far fa-star text-warning"></i>';
    return stars;
}

function showLoadingSpinner() {
    const container = document.getElementById('productsContainer');
    const msg = currentLang === 'ar' ? 'جاري التحميل...' :
        currentLang === 'fr' ? 'Chargement...' : 'Loading...';
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <div class="text-muted mt-2">${msg}</div>
        </div>
    `;
}

function goToProduct(id) {
    window.location.href = `product-details.html?id=${encodeURIComponent(id)}`;
}