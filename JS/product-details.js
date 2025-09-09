// Product details page functionality
document.addEventListener('DOMContentLoaded', async () => {
    showLoading();

    try {
        // --- تهيئة اللغة ---
        if (typeof LanguageManager !== 'undefined') {
            window.languageManager = new LanguageManager();
            await languageManager.loadTranslations(['Header', 'Footer', 'Cart', 'Pages']);
            languageManager.applyDirection();
            languageManager.updateContent();
            window.currentLang = languageManager.currentLang || 'ar';
        } else {
            window.currentLang = localStorage.getItem('preferredLang') || 'ar';
            document.documentElement.lang = window.currentLang;
            document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
        }

        // --- تهيئة السلة ---
        if (typeof cart !== 'undefined' && cart.updateCartDisplay) {
            cart.updateCartDisplay();
        }

        // --- تهيئة البحث ---
        initializeSearch();

        // --- تهيئة قائمة اللغة ---
        setupLanguageDropdownDirection();

        // --- تحميل المنتج ---
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            await loadProductDetails(productId);
            await loadRelatedProducts(productId);
        } else {
            window.location.href = 'products.html';
        }

        // --- تفويض الأحداث ---
        setupGlobalHandlers();

    } catch (err) {
        console.error('خطأ في تحميل صفحة التفاصيل:', err);
        showProductNotFound();
    } finally {
        hideLoading();
    }
});

// ============================================
// 🛍️ تحميل تفاصيل المنتج
// ============================================

async function loadProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) {
        showProductNotFound();
        return;
    }

    const lang = window.currentLang;

    // تحديث العنوان
    document.title = `${product.name[lang] || product.name['en']} - المتجر الإلكتروني`;

    // تحديث الـ breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name[lang] || product.name['en'];
    }

    displayProductDetails(product, lang);
}

// ============================================
// 🖼️ عرض تفاصيل المنتج
// ============================================

function displayProductDetails(product, lang = 'ar') {
    const productDetails = document.getElementById('productDetails');
    if (!productDetails) return;

    const name = product.name[lang] || product.name['en'];
    const description = product.description[lang] || product.description['en'];

    const discountBadge = product.discount
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">-${product.discount}%</span>`
        : '';

    const originalPrice = product.originalPrice
        ? `<span class="text-muted text-decoration-line-through me-2 fs-5">${formatPrice(product.originalPrice)}</span>`
        : '';

    const stockText = product.inStock
        ? (lang === 'ar' ? 'متوفر في المخزون' : lang === 'fr' ? 'Disponible' : 'In Stock')
        : (lang === 'ar' ? 'نفد من المخزون' : lang === 'fr' ? 'Rupture de stock' : 'Out of Stock');

    const stockStatus = `<span class="badge ${product.inStock ? 'bg-success' : 'bg-danger'} fs-6">${stockText}</span>`;

    // === عرض المواصفات حسب اللغة ===
    let specsHTML = '';
    if (product.specifications && product.specifications[lang]) {
        specsHTML = product.specifications[lang].map(spec => `
            <li class="list-group-item d-flex align-items-center">
                <i class="fas fa-check text-success me-2"></i>
                ${spec}
            </li>
        `).join('');
    } else if (product.specifications && product.specifications.en) {
        // fallback إلى الإنجليزية
        specsHTML = product.specifications.en.map(spec => `
            <li class="list-group-item d-flex align-items-center">
                <i class="fas fa-check text-success me-2"></i>
                ${spec}
            </li>
        `).join('');
    }
    // === دعم الهيكل القديم (للتراجع) ===
    else if (Array.isArray(product.specifications)) {
        specsHTML = product.specifications.map(spec => `
            <li class="list-group-item d-flex align-items-center">
                <i class="fas fa-check text-success me-2"></i>
                ${spec}
            </li>
        `).join('');
    }

    const images = product.images || [product.image];
    const thumbnails = images.map((img, index) => `
        <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" 
             alt="${name}" data-src="${img}">
    `).join('');

    productDetails.innerHTML = `
        <div class="col-lg-6 col-md-6 mb-4">
            <div class="product-gallery">
                <div class="position-relative">
                    <img src="${images[0]}" class="main-image" id="mainImage" alt="${name}">
                    ${discountBadge}
                </div>
                <div class="thumbnail-images mt-3 d-flex gap-2 overflow-auto" style="max-height: 100px;">
                    ${thumbnails}
                </div>
            </div>
        </div>

        <div class="col-lg-6 col-md-6">
            <div class="product-info">
                <h1 class="product-title">${name}</h1>

                <div class="product-rating mb-3">
                    ${generateStarRating(product.rating)}
                    <span class="text-muted ms-2">(${formatNumberToArabic(product.reviews)} ${lang === 'ar' ? 'تقييم' : lang === 'fr' ? 'évaluation' : 'reviews'})</span>
                </div>

                <div class="product-price mb-3">
                    ${originalPrice}
                    <span class="fw-bold text-success fs-3">${formatPrice(product.price)}</span>
                </div>

                <div class="mb-3">
                    ${stockStatus}
                </div>

                <div class="product-description mb-4">
                    <p class="lead">${description}</p>
                </div>

                <div class="specifications mb-4">
                    <h5 class="fw-bold mb-3">${lang === 'ar' ? 'المواصفات' : lang === 'fr' ? 'Spécifications' : 'Specifications'}</h5>
                    <ul class="list-group list-group-flush">
                        ${specsHTML}
                    </ul>
                </div>

                <div class="quantity-selector mb-4">
                    <label class="form-label fw-bold">${lang === 'ar' ? 'الكمية:' : lang === 'fr' ? 'Quantité :' : 'Quantity:'}</label>
                    <div class="d-flex align-items-center">
                        <button class="quantity-btn" data-action="decrease" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" id="quantityInput"  value="1" min="1" max="10" readonly="readonly" ${!product.inStock ? 'disabled' : ''}>
                        <button class="quantity-btn" data-action="increase" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                        <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary btn-lg flex-fill add-to-cart-btn"
                    onclick="addToCartWithQuantity('${product.id}')"
                    ${!product.inStock ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart me-2"></i>
                ${product.inStock
            ? (lang === 'ar' ? 'إضافة إلى السلة' : lang === 'fr' ? 'Ajouter au panier' : 'Add to Cart')
            : (lang === 'ar' ? 'نفد من المخزون' : lang === 'fr' ? 'Rupture' : 'Out of Stock')}
            </button>
            <button class="btn btn-outline-primary btn-lg" data-action="continue-shopping">
                <i class="fas fa-arrow-right me-2"></i>
                ${lang === 'ar' ? 'متابعة التسوق' : lang === 'fr' ? 'Continuer les achats' : 'Continue Shopping'}
            </button>
        </div>
            </div>
        </div>
    `;

    attachThumbnailEvents();
}

// ============================================
// 🖼️ تغيير الصورة الرئيسية
// ============================================

function attachThumbnailEvents() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const mainImage = document.getElementById('mainImage');
            if (mainImage) mainImage.src = thumb.dataset.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

// ============================================
// 🔗 تفويض الأحداث (لا تستخدم onclick)
// ============================================

function setupGlobalHandlers() {
    document.addEventListener('click', function (e) {
        // --- إضافة إلى السلة ---
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn && !addBtn.disabled) {
            e.preventDefault();
            const productId = addBtn.dataset.productId;
            if (!productId) return;

            // تعطيل مؤقت + سبينر
            addBtn.disabled = true;
            const originalHTML = addBtn.innerHTML;
            const lang = window.currentLang || 'ar';
            const loadingText = lang === 'ar' ? 'جاري الإضافة...' : 'Adding...';
            addBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${loadingText}`;

            // ✅ جلب الكمية بشكل صحيح
            const quantityInput = document.getElementById('quantityInput');
            let quantity = 1;

            if (quantityInput) {
                const value = parseInt(quantityInput.value);
                // تأكد من أن الكمية رقم صحيح وضمن النطاق
                if (!isNaN(value) && value > 0) {
                    quantity = value;
                } else {
                    // إذا كانت القيمة غير صالحة، استخدم 1
                    quantity = 1;
                    quantityInput.value = 1;
                }
            }

            // ✅ إضافة المنتج بالكمية المحددة
            if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
                cart.addItem(productId, quantity);
            } else {
                addToCartManual(productId, quantity);
            }

            // إعادة الزر بعد 800ms
            setTimeout(() => {
                if (addBtn && addBtn.innerHTML.includes('fa-spinner')) {
                    addBtn.disabled = false;
                    addBtn.innerHTML = originalHTML;
                }
            }, 800);
            return;
        }

        // --- زيادة/تقليل الكمية ---
        const qtyBtn = e.target.closest('.quantity-btn');
        if (qtyBtn) {
            e.preventDefault();
            const input = document.getElementById('quantityInput');
            if (!input || input.disabled) return;

            const action = qtyBtn.dataset.action;
            let value = parseInt(input.value) || 1;

            if (action === 'increase' && value < 10) value++;
            if (action === 'decrease' && value > 1) value--;

            input.value = value;
            return;
        }

        // --- متابعة التسوق ---
        if (e.target.closest('[data-action="continue-shopping"]')) {
            goToProducts();
        }
    });
}

function addToCartManual(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    let cartItems = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const existing = cartItems.find(item => item.productId === productId);

    if (existing) {
        existing.quantity += quantity; // ✅ إضافة الكمية
    } else {
        cartItems.push({
            productId: productId,
            quantity: quantity, // ✅ حفظ الكمية
            product: product
        });
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    cart.updateCartDisplay();
    cart.renderCartModal();
    cart.showAddToCartMessage(product);
}

// ============================================
// 🔗 المنتجات المشابهة
// ============================================

async function loadRelatedProducts(productId) {
    const relatedProducts = getRelatedProducts(productId, 4);
    const container = document.getElementById('relatedProducts');
    if (!container || relatedProducts.length === 0) return;

    const lang = window.currentLang;
    let html = '';
    relatedProducts.forEach(p => {
        html += createProductCard(p, lang);
    });
    container.innerHTML = html;
}

function createProductCard(product, lang = 'ar') {
    const name = product.name[lang] || product.name['en'];
    const description = product.description[lang] || product.description['en'];

    const discountBadge = product.discount
        ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${product.discount}%</span>`
        : '';

    const originalPrice = product.originalPrice
        ? `<span class="text-muted text-decoration-line-through me-2">${formatPrice(product.originalPrice)}</span>`
        : '';

    const stockText = product.inStock
        ? (lang === 'ar' ? 'متوفر' : lang === 'fr' ? 'Disponible' : 'In Stock')
        : (lang === 'ar' ? 'نفد' : lang === 'fr' ? 'Rupture' : 'Out of Stock');

    return `
        <div class="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
            <div class="card product-card h-100">
                <div class="position-relative" data-product-id="${product.id}" style="cursor:pointer;"  onclick="goToProduct('${product.id}')">
                    <img src="${product.image}" class="card-img-top product-image" alt="${name}" loading="lazy">
                    ${discountBadge}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text text-muted flex-grow-1">${description.substring(0, 80)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <span class="text-muted ms-2">(${product.reviews})</span>
                    </div>
                    <div class="product-price mb-2">
                        ${originalPrice}
                        <span class="fw-bold text-success">${formatPrice(product.price)}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge ${product.inStock ? 'bg-success' : 'bg-danger'}">${stockText}</span>
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

// ============================================
// ❌ منتج غير موجود
// ============================================

function showProductNotFound() {
    const details = document.getElementById('productDetails');
    if (!details) return;

    const lang = window.currentLang;
    const msg = lang === 'ar' ? 'المنتج غير موجود' : lang === 'fr' ? 'Produit non trouvé' : 'Product not found';
    const btn = lang === 'ar' ? 'تصفح المنتجات' : lang === 'fr' ? 'Voir les produits' : 'Browse Products';
    const txt = lang === 'ar' ? 'عذراً لا يمكن العثور على المنتج المطلوب' : lang === 'fr' ? 'Désolé, le produit demandé est introuvable' : 'Sorry, the requested product was not found';

    details.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h2>${msg}</h2>
            <p class="text-muted mb-4">${txt}</p>
            <a href="products.html" class="btn btn-primary">${btn}</a>
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
    if (query) window.location.href = `products.html?search=${encodeURIComponent(query)}`;
}

// ============================================
// 🌍 تغيير اللغة + اتجاه القائمة
// ============================================

function setupLanguageDropdownDirection() {
    function updateDirection() {
        const menu = document.querySelector('#languageDropdown + .dropdown-menu');
        if (!menu) return;

        const lang = window.currentLang || 'ar';
        if (lang === 'ar') {
            menu.style.left = 'auto';
            menu.style.right = '0';
            menu.style.transform = 'translateX(0)';
        } else {
            menu.style.right = 'auto';
            menu.style.left = '0';
            menu.style.transform = 'translateX(0)';
        }
    }

    // عند التحميل
    updateDirection();

    // عند تغيير اللغة
    document.body.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-lang]');
        if (!btn) return;

        e.preventDefault();
        const lang = btn.dataset.lang;
        if (!['ar', 'en', 'fr'].includes(lang)) return;

        if (window.languageManager && typeof languageManager.setLanguage === 'function') {
            await languageManager.setLanguage(lang);
            languageManager.applyDirection();
            languageManager.updateContent();
        }

        window.currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        updateDirection();
        await loadProductDetails(new URLSearchParams(window.location.search).get('id'));
    });
}

// ============================================
// 🚶 التنقل
// ============================================

function goToProduct(productId) {
    if (productId) window.location.href = `product-details.html?id=${encodeURIComponent(productId)}`;
}

function goToProducts() {
    window.location.href = 'products.html';
}

// ============================================
// 🛠️ أدوات
// ============================================

function generateStarRating(rating = 0) {
    const r = Math.round(rating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < r ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star text-warning"></i>';
    }
    return stars;
}

function formatPrice(value) {
    const lang = window.currentLang || 'ar';
    const num = Number(value) || 0;
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang).format(num);
}

function formatNumberToArabic(num) {
    return formatPrice(num); // نفس التنسيق
}

// Add to cart with quantity (uses cart object if available, fallback manual otherwise)
function addToCartWithQuantity(productId) {
    // Prevent multiple clicks
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button && button.disabled) return;

    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإضافة...';
    }

    const quantityInput = document.getElementById('quantityInput');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
        cart.addItem(productId, quantity);
    } else {
        addToCartManual(productId, quantity);
    }

    setTimeout(() => {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>إضافة إلى السلة';
        }
    }, 1000);
}

// ============================================
// 🌀 تحميل
// ============================================

function showLoading() {
    if (document.getElementById('pageLoader')) return;
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75" style="z-index: 9999;">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    document.getElementById('pageLoader')?.remove();
}