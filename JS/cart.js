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
            const rawItems = JSON.parse(savedCart);
            this.items = rawItems.map(item => {
                const fullProduct = getProductById(item.productId);
                return {
                    ...item,
                    product: fullProduct
                };
            });
        }
    }


    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product || typeof product.price !== 'number') return false;

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
            confirmRemoveItem(productId);
        }
    }


    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
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
                        <button class="btn btn-outline-danger btn-sm" onclick="confirmRemoveItem('${item.productId}')">
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

        document.getElementById("checkoutBtn").addEventListener("click", function () {
            if (!cart.items || cart.items.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'السلة فارغة',
                    text: 'يرجى إضافة منتجات قبل إتمام الطلب.',
                    confirmButtonText: 'حسنًا'
                });
            } else {
                window.location.href = "checkout.html";
            }
        });

    }

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
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            cart.renderCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });

        const checkoutBtn = document.getElementById('checkoutBtn');

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function (e) {
                e.preventDefault();

                if (cart.getItemsCount() === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'السلة فارغة!',
                        text: 'الرجاء إضافة منتجات قبل إتمام الطلب.',
                        confirmButtonText: 'حسنًا'
                    });
                } else {
                    // انتقل إلى صفحة إتمام الطلب
                    window.location.href = "checkout.html";
                }
            });
        }
    }

    document.addEventListener('click', function (e) {
        if ((e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) &&
            !document.getElementById('quantityInput')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = button.getAttribute('data-product-id');
            const quantity = parseInt(button.getAttribute('data-quantity')) || 1;

            if (productId) {
                if (button.disabled) return;
                button.disabled = true;
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                cart.addItem(productId, quantity);

                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }, 1000);
            }
        }
    });
});

// Helpers
function confirmRemoveItem(productId) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "هل تريد حذف هذا المنتج من السلة؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            cart.removeItem(productId);
        }
    });
}

function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

function removeFromCart(productId) {
    confirmRemoveItem(productId);
}

function updateCartQuantity(productId, quantity) {
    cart.updateQuantity(productId, quantity);
}

function clearCart() {
    cart.clear();
}


