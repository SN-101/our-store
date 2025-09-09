// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateCartDisplay();
    }

    loadFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const rawItems = JSON.parse(savedCart);
                this.items = rawItems
                    .map(item => {
                        const fullProduct = typeof getProductById === 'function' ? getProductById(item.productId) : null;
                        if (!fullProduct) return null;
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            product: fullProduct
                        };
                    })
                    .filter(Boolean);
            } catch (e) {
                console.error('Error loading cart from storage:', e);
                this.items = [];
            }
        }
    }

    saveToStorage() {
        const serializable = this.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
        localStorage.setItem('shoppingCart', JSON.stringify(serializable));
    }

    addItem(productId, quantity = 1) {
        const product = typeof getProductById === 'function' ? getProductById(productId) : null;
        if (!product || !product.inStock) {
            if (!product) console.warn('المنتج غير موجود:', productId);
            return false;
        }

        const existing = this.items.find(p => p.productId === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                productId: productId,
                quantity: quantity,
                product: product
            });
        }

        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartModal();
        this.showAddToCartMessage(product);
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartModal();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (!item) return;

        if (quantity > 0) {
            item.quantity = quantity;
            this.saveToStorage();
            this.updateCartDisplay();
            this.renderCartModal();
        } else {
            this.confirmRemoveItem(productId);
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartModal();
    }

    updateCartDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const count = this.getItemsCount();
            cartCountElement.textContent = this.formatNumber(count);
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showAddToCartMessage(product) {
        const lang = this.getCurrentLang();
        const productName = product.name[lang] || product.name['en'] || 'Product';

        const messages = {
            ar: `تم إضافة "${productName}" إلى السلة`,
            en: `"${productName}" has been added to the cart`,
            fr: `"${productName}" a été ajouté au panier`
        };

        const msg = messages[lang] || messages.en;

        const message = document.createElement('div');
        message.className = 'alert alert-success position-fixed cart-notification';
        message.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            border-radius: 8px;
            animation: slideInRight 0.3s ease-out;
        `;
        message.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${msg}`;
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) message.remove();
        }, 3000);
    }

    confirmRemoveItem(productId) {
        const lang = this.getCurrentLang();
        const texts = {
            ar: { title: 'هل أنت متأكد؟', text: 'حذف هذا المنتج من السلة؟', confirm: 'نعم', cancel: 'إلغاء' },
            en: { title: 'Are you sure?', text: 'Remove this item?', confirm: 'Yes', cancel: 'Cancel' },
            fr: { title: 'Êtes-vous sûr ?', text: 'Supprimer cet article ?', confirm: 'Oui', cancel: 'Annuler' }
        };
        const t = texts[lang] || texts.en;

        Swal.fire({
            title: t.title,
            text: t.text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t.confirm,
            cancelButtonText: t.cancel
        }).then(result => {
            if (result.isConfirmed) {
                this.removeItem(productId);
            }
        });
    }

    renderCartModal() {
        const cartModalBody = document.getElementById('cartModalBody');
        if (!cartModalBody) return;

        const lang = this.getCurrentLang();

        if (this.items.length === 0) {
            const emptyTexts = {
                ar: { msg: 'السلة فارغة', btn: 'تسوق الآن' },
                en: { msg: 'Your cart is empty', btn: 'Shop Now' },
                fr: { msg: 'Le panier est vide', btn: 'Acheter maintenant' }
            };
            const t = emptyTexts[lang] || emptyTexts.en;

            cartModalBody.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="lead">${t.msg}</p>
                    <a href="products.html" class="btn btn-primary">${t.btn}</a>
                </div>
            `;
            return;
        }

        let cartHTML = '<div class="cart-items-list">';
        this.items.forEach(item => {
            const name = item.product.name[lang] || item.product.name.en || 'Product';
            cartHTML+=`<div class="cart-item">
                    <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h6 class="cart-item-name">${item.product.name[window.currentLang] || item.product.name['en']}</h6>
                        <p class="cart-item-price">${formatPrice(item.product.price)}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-total">${formatPrice(item.product.price * item.quantity)}</div>
                        <button class="btn btn-outline-danger btn-sm" data-action="remove" onclick="cart.updateQuantity('${item.productId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        cartHTML += '</div>';
        const totalLabel = window.currentLang === 'ar' ? 'المجموع:'
            : window.currentLang === 'fr' ? 'Total:'
                : 'Total:';
        cartHTML += `
    <div class="cart-summary">
        <hr>
        <div class="d-flex justify-content-between">
            <strong>${totalLabel} ${formatPrice(this.getTotal())}</strong>
        </div>
    </div>
`;

        cartModalBody.innerHTML = cartHTML;
    }

    // === تفويض الأحداث (لا تستخدم onclick) ===
    attachCartEvents() {
        const modalBody = document.getElementById('cartModalBody');
        if (!modalBody) return;

        modalBody.addEventListener('click', e => {
            const btn = e.target.closest('[data-action][data-id]');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = btn.dataset.id;

            switch (action) {
                case 'increase':
                    this.updateQuantity(id, this.getQuantity(id) + 1);
                    break;
                case 'decrease':
                    this.updateQuantity(id, this.getQuantity(id) - 1);
                    break;
                case 'remove':
                    this.confirmRemoveItem(id);
                    break;
            }
        });
    }

    getQuantity(productId) {
        const item = this.items.find(i => i.productId === productId);
        return item ? item.quantity : 0;
    }

    // === أدوات ===
    getCurrentLang() {
        return window.currentLang ||
            localStorage.getItem('preferredLang') ||
            localStorage.getItem('language') ||
            'ar';
    }

    formatPrice(price) {
        return Math.round(price); // أو .toFixed(0) إذا أردت نصًا
    }

    formatNumber(num) {
        return num;
    }
}

// === تهيئة السلة ===
const cart = new ShoppingCart();

// === تهيئة الأحداث ===
document.addEventListener('DOMContentLoaded', function () {
    // زر فتح السلة
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            cart.renderCartModal();
            cart.attachCartEvents();
            const modal = new bootstrap.Modal(document.getElementById('cartModal'));
            modal.show();
        });
    }

    // زر الدفع
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = cart.getCurrentLang();
            const messages = {
                ar: { title: 'السلة فارغة', text: 'أضف منتجات قبل الدفع' },
                en: { title: 'Cart is Empty', text: 'Add products before checkout' },
                fr: { title: 'Panier vide', text: 'Ajoutez des produits avant le paiement' }
            };
            const t = messages[lang] || messages.en;

            if (cart.getItemsCount() === 0) {
                Swal.fire({ icon: 'warning', title: t.title, text: t.text, confirmButtonText: 'OK' });
            } else {
                window.location.href = "checkout.html";
            }
        });
    }

    // تحديث السلة عند تغيير اللغة
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            window.currentLang = btn.dataset.lang;
            localStorage.setItem('preferredLang', btn.dataset.lang);
            cart.updateCartDisplay();
            cart.renderCartModal();
        });
    });

    // إضافة المنتجات بالنقر
    document.addEventListener('click', function (e) {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (!addBtn || addBtn.disabled) return;

        const productId = addBtn.dataset.productId;
        if (!productId) return;

        const originalHTML = addBtn.innerHTML;
        const originalDisabled = addBtn.disabled;

        try {
            addBtn.disabled = true;
            addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            const success = cart.addItem(productId, 1);

            setTimeout(() => {
                if (addBtn && addBtn.innerHTML.includes('fa-spinner')) {
                    addBtn.disabled = originalDisabled;
                    addBtn.innerHTML = originalHTML;
                }
            }, 800);

        } catch (error) {
            console.error('Error adding to cart:', error);
            setTimeout(() => {
                if (addBtn) {
                    addBtn.disabled = originalDisabled;
                    addBtn.innerHTML = originalHTML;
                }
            }, 300);
        }
    });
});

function addToCart(id, qty = 1) { cart.addItem(id, qty); }
function removeFromCart(id) { cart.confirmRemoveItem(id); }
function updateCartQuantity(id, qty) { cart.updateQuantity(id, qty); }
function clearCart() { cart.clear(); }