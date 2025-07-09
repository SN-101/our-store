// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateCartDisplay();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId: productId,
                quantity: quantity,
                product: product
            });
        }

        this.saveToStorage();
        this.updateCartDisplay();
        this.showAddToCartMessage(product.name);
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeItem(productId);
            }
            this.saveToStorage();
            this.updateCartDisplay();
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    // Get cart items count
    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }

    // Update cart display
    updateCartDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const count = this.getItemsCount();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Show add to cart message
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

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Render cart modal content
    renderCartModal() {
        const cartModalBody = document.getElementById('cartModalBody');
        if (!cartModalBody) return;

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
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h6 class="cart-item-name">${item.product.name}</h6>
                        <p class="cart-item-price">${formatPrice(item.product.price)}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-total">${formatPrice(item.product.price * item.quantity)}</div>
                        <button class="btn btn-outline-danger btn-sm" onclick="cart.removeItem('${item.productId}')">
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

    // Get cart items for checkout
    getCartItems() {
        return this.items.map(item => ({
            ...item,
            total: item.product.price * item.quantity
        }));
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Cart button click
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            cart.renderCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }

    // Add to cart buttons
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
});

// Helper function to add item to cart (for direct calls)
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

// Helper function to remove item from cart
function removeFromCart(productId) {
    cart.removeItem(productId);
}

// Helper function to update quantity
function updateCartQuantity(productId, quantity) {
    cart.updateQuantity(productId, quantity);
}

// Helper function to clear cart
function clearCart() {
    cart.clear();
}