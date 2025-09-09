// ============================================
// 🏠 الصفحة الرئيسية - كاملة وصحيحة
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    showLoading();

    try {
        // --- Language Manager ---
        if (typeof LanguageManager !== 'undefined') {
            window.languageManager = new LanguageManager();
            if (languageManager.loadTranslations) await languageManager.loadTranslations(['Header', 'Footer', 'Cart', 'Pages']);
            languageManager.applyDirection && languageManager.applyDirection();
            languageManager.updateContent && languageManager.updateContent();
            window.currentLang = languageManager.currentLang || 'en';
        } else {
            window.currentLang = 'en';
            console.warn('LanguageManager غير موجود، استخدام الإنجليزية كافتراضي');
        }

        // --- تهيئة المكونات ---
        initializeCategories();
        initializeFeaturedProducts();
        initializeSearch();
        initializeCarousel();
        setupCart();
        setupGlobalProductHandlers();
        initializeLazyLoading();

    } catch (err) {
        console.error('خطأ أثناء تهيئة الصفحة:', err);
    } finally {
        hideLoading();
    }
});

// ============================================
// 🛒 إدارة السلة
// ============================================

function setupCart() {
    window.cart = window.cart || {
        items: JSON.parse(localStorage.getItem('cartItems') || '[]'),

        addProduct: function (productId) {
            const id = String(productId);
            const product = typeof getProductById === 'function' ? getProductById(id) : null;

            if (!product) {
                console.warn('المنتج غير موجود:', id);
                return false;
            }

            if (!product.inStock) {
                const lang = window.currentLang || 'en';
                const messages = {
                    ar: 'هذا المنتج غير متوفر حاليًا.',
                    en: 'This product is out of stock.',
                    fr: 'Ce produit est en rupture de stock.'
                };
                alert(messages[lang] || messages.en);
                return false;
            }

            const existing = this.items.find(p => p.id === id);
            if (existing) {
                existing.qty++;
            } else {
                this.items.push({ id: id, qty: 1 });
            }

            localStorage.setItem('cartItems', JSON.stringify(this.items));
            this.updateCartDisplay();
            this.showAddToCartToast(product);
            return true;
        },

        updateCartDisplay: function () {
            const totalQty = this.items.reduce((acc, p) => acc + p.qty, 0);
            const cartCount = document.getElementById('cartCount');
            if (cartCount) cartCount.textContent = totalQty;
        },

        showAddToCartToast: function (product) {
            const lang = window.currentLang || 'en';
            const name = product.name[lang] || product.name['en'] || 'Product';

            const messages = {
                ar: `تمت إضافة "${name}" إلى السلة`,
                en: `"${name}" has been added to the cart`,
                fr: `"${name}" ajouté au panier`
            };

            const toast = document.createElement('div');
            toast.className = 'alert alert-success position-fixed cart-toast';
            toast.style.cssText = `
                top: 80px; right: 20px; z-index: 9999; max-width: 300px;
                animation: slideIn 0.3s ease-out; border-radius: 8px; padding: 12px 16px;
            `;
            toast.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${messages[lang]}`;
            document.body.appendChild(toast);
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 3000);
        }
    };

    // تحديث عرض السلة عند التحميل
    cart.updateCartDisplay();
}

// ============================================
// 🛍️ تفويض النقر (لا تستخدم onclick)
// ============================================

function setupGlobalProductHandlers() {
    document.addEventListener('click', function (e) {
        // --- زر إضافة إلى السلة ---
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            e.preventDefault();
            const productId = addBtn.dataset.productId;
            if (!productId) return;

            if (addBtn.disabled) return;

            // تعطيل مؤقت + سبينر
            addBtn.disabled = true;
            const originalHTML = addBtn.innerHTML;
            addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // إضافة المنتج
            cart.addProduct(productId);

            // إعادة الزر بعد 800ms
            setTimeout(() => {
                if (addBtn && addBtn.innerHTML.includes('fa-spinner')) {
                    addBtn.disabled = false;
                    addBtn.innerHTML = originalHTML;
                }
            }, 800);
            return;
        }

        // --- زر عرض المنتج أو النقر على الكارد ---
        const viewBtn = e.target.closest('.btn-outline-primary');
        const card = e.target.closest('.product-card');
        if (viewBtn || e.target.closest('.product-clickable, .position-relative') || card) {
            const id = card?.dataset.productId ||
                       e.target.closest('[data-product-id]')?.dataset.productId;
            if (id) goToProduct(id);
            return;
        }
    });
}

// ============================================
// 🎯 عرض المنتجات المميزة
// ============================================

function initializeFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const products = typeof getFeaturedProducts === 'function'
        ? getFeaturedProducts()
        : window.featuredProducts || window.products?.filter(p => p.featured) || [];

    const lang = window.currentLang || 'en';
    let html = '';

    products.forEach(product => {
        html += createProductCard(product, lang);
    });

    container.innerHTML = html;
}

// ============================================
// 🗂️ عرض التصنيفات
// ============================================

function initializeCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer || !window.categories) return;

    const lang = window.currentLang || 'en';
    const productWord = lang === 'ar' ? 'منتجات' : lang === 'fr' ? 'produits' : 'products';

    let html = '';
    categories.forEach(category => {
        const title = category.name?.[lang] || category.name?.['en'] || category.title || '—';
        const count = typeof category.count === 'number' ? category.count : 0;
        html += `
            <div class="col-lg-2 col-md-4 col-6 mb-4">
                <div class="card category-card" data-category-id="${category.id}">
                    <div class="card-body text-center">
                        <i class="${category.icon || 'fas fa-folder'} category-icon"></i>
                        <h5 class="card-title">${escapeHtml(title)}</h5>
                        <p class="card-text text-muted">${count} ${productWord}</p>
                    </div>
                </div>
            </div>
        `;
    });

    categoriesContainer.innerHTML = html;
}

// ============================================
// 🎨 إنشاء بطاقة منتج
// ============================================

function createProductCard(product, lang = 'en') {
    const discountBadge = product.discount
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${product.discount}%</span>`
        : '';

    const originalPrice = product.originalPrice
        ? `<span class="text-muted text-decoration-line-through me-2">${formatPrice(product.originalPrice)}</span>`
        : '';

    const stockStatus = product.inStock
        ? `<span class="badge bg-success">${lang === 'ar' ? 'متوفر' : lang === 'fr' ? 'Disponible' : 'In Stock'}</span>`
        : `<span class="badge bg-danger">${lang === 'ar' ? 'نفد المخزون' : lang === 'fr' ? 'Rupture' : 'Out of Stock'}</span>`;

    const name = product.name[lang] || product.name['en'] || 'Product';
    const description = product.description[lang] || product.description['en'] || '';

    return `
        <div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100" data-product-id="${product.id}">
                <div class="position-relative" style="cursor: pointer;">
                    <img src="${product.image}" class="card-img-top product-image" alt="${escapeHtml(name)}" loading="lazy">
                    ${discountBadge}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${escapeHtml(name)}</h5>
                    <p class="card-text text-muted flex-grow-1">${escapeHtml(description.substring(0, 100))}...</p>
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
                            <button class="btn btn-outline-primary btn-sm me-2">
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

// ============================================
// 🔍 بحث
// ============================================

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });

    document.querySelector('.btn-search')?.addEventListener('click', performSearch);
}

function performSearch() {
    const query = (document.getElementById('searchInput')?.value || '').trim();
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// ============================================
// 🖼️ كاروسيل
// ============================================

function initializeCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    try {
        new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            touch: true
        });
    } catch (err) {
        console.warn('Bootstrap Carousel غير متاح:', err);
    }
}

// ============================================
// 🌍 تغيير اللغة
// ============================================

document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;

    e.preventDefault();
    const lang = btn.dataset.lang;
    if (!['ar', 'en', 'fr'].includes(lang)) return;

    try {
        if (window.languageManager && typeof languageManager.setLanguage === 'function') {
            await languageManager.setLanguage(lang);
            languageManager.applyDirection();
            languageManager.updateContent();
        }

        window.currentLang = lang;

        // إعادة تحميل العناصر باللغة الجديدة
        initializeCategories();
        initializeFeaturedProducts();

    } catch (err) {
        console.error('خطأ أثناء تغيير اللغة:', err);
    }
});

// ============================================
// 🚶 التنقل
// ============================================

function goToCategory(categoryId) {
    if (categoryId) {
        window.location.href = `products.html?category=${encodeURIComponent(categoryId)}`;
    }
}

function goToProduct(productId) {
    if (productId) {
        window.location.href = `product-details.html?id=${encodeURIComponent(productId)}`;
    }
}

// ============================================
// 🖼️ تحميل الصور بذكاء (Lazy Load)
// ============================================

let _ioLazy = null;
function initializeLazyLoading() {
    _ioLazy?.disconnect();
    _ioLazy = null;

    const images = document.querySelectorAll('img[data-src].lazy');
    if (!images.length) return;

    _ioLazy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                _ioLazy.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    images.forEach(img => _ioLazy.observe(img));
}

// ============================================
// 🌀 تحميل الصفحة
// ============================================

function showLoading() {
    if (document.getElementById('pageLoader')) return;
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75" style="z-index: 9999;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.remove();
}

// ============================================
// 🛠️ أدوات
// ============================================

function formatPrice(value, lang = 'en') {
    const num = Number(value) || 0;
    try {
        return new Intl.NumberFormat(lang, {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    } catch (e) {
        return `$${num.toFixed(2)}`;
    }
}

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function generateStarRating(rating = 0) {
    const r = Math.round(rating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < r ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star text-warning"></i>';
    }
    return stars;
}

// ============================================
// 📝 تتبع الأداء
// ============================================

window.addEventListener('error', e => {
    console.error('خطأ في الصفحة:', e.error || e.message);
});

window.addEventListener('load', () => {
    console.log(`تم تحميل الصفحة في ${performance.now().toFixed(2)} مللي ثانية`);
});