// Checkout page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Load cart items and display order summary
    loadOrderSummary();

    // Initialize form validation
    initializeFormValidation();

    // Initialize order confirmation
    initializeOrderConfirmation();

    // Initialize the way paying
    focusBtnPay()

    // Load cart count
    cart.updateCartDisplay();

    // Check if cart is empty
    if (cart.items.length === 0) {
        showEmptyCart();
    }
});

// Load order summary
function loadOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const subtotal = document.getElementById('subtotal');
    const totalAmount = document.getElementById('totalAmount');

    if (!orderSummary) return;

    const cartItems = cart.getCartItems();

    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }

    let summaryHTML = '';
    cartItems.forEach(item => {
        summaryHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <img src="${item.product.image}" alt="${item.product.name}" 
                         class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0">${item.product.name}</h6>
                        <small class="text-muted">الكمية: ${formatNumberToArabic(item.quantity)}</small>
                    </div>
                </div>
                <span class="fw-bold">${formatPrice(item.total)}</span>
            </div>
        `;
    });

    orderSummary.innerHTML = summaryHTML;

    // Update totals
    const total = cart.getTotal();
    if (subtotal) subtotal.textContent = formatPrice(total);
    if (totalAmount) totalAmount.textContent = formatPrice(total);
}

// Show empty cart
function showEmptyCart() {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-cart fa-3x text-white mb-3"></i>
                        <h3>السلة فارغة</h3>
                        <p class="text-white mb-4">لا توجد منتجات في سلة المشتريات</p>
                        <a href="products.html" class="btn btn-primary">تسوق الآن</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            validatePhoneNumber(this);
        });
    }

    // Form submission validation
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            // Form is valid, proceed with order
            return true;
        }
    });
}

// Validate phone number
function validatePhoneNumber(input) {
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    const isValid = phoneRegex.test(input.value);

    if (input.value && !isValid) {
        input.classList.add('is-invalid');
        showFieldError(input, 'يرجى إدخال رقم هاتف صحيح (05xxxxxxxx)');
    } else {
        input.classList.remove('is-invalid');
        hideFieldError(input);
    }

    return isValid;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return false;

    let isValid = true;

    // Required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'city', 'address'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
            showFieldError(field, 'هذا الحقل مطلوب');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
            hideFieldError(field);
        }
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value && !validatePhoneNumber(phoneInput)) {
        isValid = false;
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    hideFieldError(field);

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Hide field error
function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Initialize order confirmation
function initializeOrderConfirmation() {
    const confirmOrderBtn = document.getElementById('confirmOrder');
    if (!confirmOrderBtn) return;

    confirmOrderBtn.addEventListener('click', function () {
        if (validateForm()) {
            processOrder();
        }
    });
}

// Process order
function processOrder() {
    // Show loading state
    const confirmBtn = document.getElementById('confirmOrder');
    if (confirmBtn) {
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري المعالجة...';
        confirmBtn.disabled = true;
    }

    // Simulate processing delay
    setTimeout(() => {
        // Create order object
        const order = createOrder();

        // Save order to localStorage
        saveOrder(order);

        // Show confirmation modal
        showOrderConfirmation(order);

        // Clear cart
        cart.clear();

        // Reset button
        if (confirmBtn) {
            confirmBtn.innerHTML = '<i class="fas fa-check me-2"></i>تأكيد الطلب';
            confirmBtn.disabled = false;
        }
    }, 2000);
}

// Create order object
function createOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);

    const order = {
        id: generateOrderId(),
        items: cart.getCartItems(),
        customerInfo: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email') || '',
            city: formData.get('city'),
            address: formData.get('address'),
            notes: formData.get('notes') || ''
        },
        total: cart.getTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentMethod: 'cash_on_delivery'
    };

    return order;
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

// Save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Show order confirmation
function showOrderConfirmation(order) {
    // Update modal content
    const orderDetails = document.getElementById('orderDetails');
    if (orderDetails) {
        let detailsHTML = `
            <div class="row mb-3">
                <div class="col-sm-4"><strong>رقم الطلب:</strong></div>
                <div class="col-sm-8">${order.id}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>العميل:</strong></div>
                <div class="col-sm-8">${order.customerInfo.firstName} ${order.customerInfo.lastName}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>الهاتف:</strong></div>
                <div class="col-sm-8">${order.customerInfo.phone}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>المدينة:</strong></div>
                <div class="col-sm-8">${getCityName(order.customerInfo.city)}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>العنوان:</strong></div>
                <div class="col-sm-8">${order.customerInfo.address}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>المجموع:</strong></div>
                <div class="col-sm-8"><strong class="text-success">${formatPrice(order.total)}</strong></div>
            </div>
        `;

        if (order.customerInfo.notes) {
            detailsHTML += `
                <div class="row mb-3">
                    <div class="col-sm-4"><strong>ملاحظات:</strong></div>
                    <div class="col-sm-8">${order.customerInfo.notes}</div>
                </div>
            `;
        }

        orderDetails.innerHTML = detailsHTML;
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}


const alertInfo = document.getElementById("alertInfo");
const titlePay = document.getElementById("title_pay");
const textPay = document.getElementById("text_pay");
const paypalPay = document.getElementById("paypalPay");
const cashPay = document.getElementById("cashPay");
const iconPaying = document.getElementById("iconPaying");
const wayToPay = document.getElementById("wayToPay");

function paypalPaying() {
    iconPaying.className = "";
    alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i><strong>الدفع عن طريق PayPal د.م <i class="fa-solid fa-money-bill-transfer"></i> $: </strong> ستقوم بدفع قيمة الطلب عن طريق PayPal وستستلم المنتجات خلال دقائق`;
    iconPaying.classList.add("fa-brands", "fa-cc-paypal", "text-success", "me-3", "fa-2x");
    titlePay.innerHTML = `الدفع عن طريق PayPal`;
    textPay.innerHTML = "ادفع عن طريق PayPal وسنرسل لك طلبك";

    paypalBg();

    // إظهار زر PayPal
    document.getElementById("paypal-button-container").style.display = "block";
    const totalAmountValue = cart.getTotal().toFixed(2);
    document.getElementById('confirmOrder').style.display = "none";

    const exchangeRate = 1 / 10; // 1 MAD = 0.10 USD
    const totalUSD = (totalAmountValue * exchangeRate).toFixed(2);

    // تحميل الزر مرة واحدة فقط
    if (!window.paypalBtnLoaded) {
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: totalUSD
                        }
                        
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('تم الدفع بنجاح بواسطة: ' + details.payer.name.given_name);
                    // يمكنك هنا توجيه المستخدم أو حفظ بيانات الطلب
                });
            }
        }).render('#paypal-button-container');
        window.paypalBtnLoaded = true;
    }
}


function cashPaying() {
    alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i><strong>الدفع عند الاستلام: </strong> ستقوم بدفع قيمة الطلب نقداً عند استلام المنتجات`
    iconPaying.className = "";
    iconPaying.classList.add("fas", "fa-money-bill-wave", "text-success", "me-3", "fa-2x");
    titlePay.innerHTML = "الدفع عند الاستلام";
    textPay.innerHTML = `ادفع نقداً عند استلام طلبك`;
    cashBg()

    document.getElementById("paypal-button-container").style.display = "none";
    document.getElementById('confirmOrder').style.display = "block";
}

function paypalBg() {
    paypalPay.classList.remove("btn-outline-success");
    paypalPay.classList.add("btn-success");
    cashPay.classList.add("btn-outline-success");
    cashPay.classList.remove("btn-success");
}

function cashBg() {
    paypalPay.classList.add("btn-outline-success");
    paypalPay.classList.remove("btn-success");
    cashPay.classList.remove("btn-outline-success");
    cashPay.classList.add("btn-success");
}

function focusBtnPay() {
    const hasRestrictedCategory = cart.getCartItems().some(item =>
        item.product.category === "books" || item.product.category === "courses"
    );

    if (hasRestrictedCategory) {
        paypalBg()
        paypalPaying()
    } else {
        cashBg()
        cashPaying()
    }
}

// Get city name in Arabic
function getCityName(cityValue) {
    const cities = {
        'casablanca': 'الدار البيضاء',
        'rabat': 'الرباط',
        'marrakech': 'مراكش',
        'fes': 'فاس',
        'meknes': 'مكناس',
        'tangier': 'طنجة',
        'agadir': 'أكادير',
        'oujda': 'وجدة',
        'kenitra': 'القنيطرة',
        'tetouan': 'تطوان',
        'safi': 'آسفي',
        'eljadida': 'الجديدة',
        'nador': 'الناظور',
        'khouribga': 'خريبكة',
        'beni_mellal': 'بني ملال',
        'taourirt': 'تاوريرت',
        'larache': 'العرائش',
        'khemisset': 'الخميسات',
        'berkane': 'بركان',
        'khenifra': 'خنيفرة',
        'guelmim': 'كلميم',
        'settat': 'سطات',
        'taza': 'تازة',
        'errachidia': 'الرشيدية',
        'laayoune': 'العيون',
        'dakhla': 'الداخلة',
        'taroudant': 'تارودانت',
        'azrou': 'أزرو',
        'ifrane': 'إفران',
        'sidi_ifni': 'سيدي إفني',
        'zagora': 'زاكورة'
    };

    return cities[cityValue] || cityValue;
}