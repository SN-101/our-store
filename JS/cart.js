// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.lastRenderedCartItems = '';
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItem = this.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ productId, quantity });
        }

        this.refreshCartUI();
        this.showAddToCartMessage(product.name);
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.refreshCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
                this.refreshCartUI();
            } else {
                const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا المنتج من السلة؟");
                if (confirmDelete) {
                    this.removeItem(productId);
                }
            }
        }
    }


    getTotal() {
        return this.items.reduce((total, item) => {
            const product = getProductById(item.productId);
            const price = parseFloat(product?.price) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.refreshCartUI();
    }

    updateCartDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const count = this.getItemsCount();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showAddToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'alert alert-success position-fixed';
        message.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        message.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            تم إضافة "${productName}" إلى السلة
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    renderCartModal() {
        const cartModalBody = document.getElementById('cartModalBody');
        if (!cartModalBody) return;

        const currentCartJSON = JSON.stringify(this.items);
        if (this.lastRenderedCartItems === currentCartJSON) return;

        this.lastRenderedCartItems = currentCartJSON;

        if (this.items.length === 0) {
            cartModalBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>السلة فارغة</p>
                    <a href="products.html" class="btn btn-primary">تسوق الآن</a>
                </div>
            `;
            return;
        }

        let cartHTML = '<div class="cart-items">';
        this.items.forEach(item => {
            const product = getProductById(item.productId);
            const price = parseFloat(product?.price) || 0;

            cartHTML += `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h6 class="cart-item-name">${product.name}</h6>
                        <p class="cart-item-price">${formatPrice(price)}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-total">${formatPrice(price * item.quantity)}</div>
                        <button class="btn btn-outline-danger btn-sm" onclick="confirmDelete('${item.productId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartHTML += '</div>';
        cartHTML += `
            <div class="cart-summary">
                <hr>
                <div class="d-flex justify-content-between">
                    <strong>المجموع: ${formatPrice(this.getTotal())}</strong>
                </div>
            </div>
        `;

        cartModalBody.innerHTML = cartHTML;
    }

    getCartItems() {
        return this.items.map(item => {
            const product = getProductById(item.productId);
            const price = parseFloat(product?.price) || 0;
            return {
                productId: item.productId,
                quantity: item.quantity,
                product,
                total: price * item.quantity
            };
        });
    }

    refreshCartUI() {
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartModal();
    }
}

// Initialize cart
const cart = new ShoppingCart();

document.addEventListener('DOMContentLoaded', function () {
    cart.updateCartDisplay();

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            cart.renderCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = button.getAttribute('data-product-id');
            const quantity = parseInt(button.getAttribute('data-quantity')) || 1;
            if (productId) {
                cart.addItem(productId, quantity);
            }
        }
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.items && cart.items.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('سلة المشتريات فارغة. يرجى إضافة منتجات أولًا.');
            }
        });
    }
});

// Helper functions
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

function removeFromCart(productId) {
    cart.removeItem(productId);
}

function updateCartQuantity(productId, quantity) {
    cart.updateQuantity(productId, quantity);
}

function clearCart() {
    cart.clear();
}

function confirmDelete(productId) {
    const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا المنتج من السلة؟");
    if (confirmDelete) {
        cart.removeItem(productId);
    }
}