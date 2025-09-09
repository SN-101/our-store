// checkout.js
document.addEventListener("DOMContentLoaded", async () => {
    try {

        // --- تهيئة اللغة ---
        let langManagerReady = false;
        if (typeof LanguageManager !== 'undefined') {
            try {
                window.languageManager = new LanguageManager();
                await languageManager.loadTranslations(['Header', 'Footer', 'Cart', 'Pages', 'Checkout']);
                languageManager.applyDirection();
                languageManager.updateContent();
                window.currentLang = languageManager.currentLang || 'ar';
                langManagerReady = true;
            } catch (err) {
                console.warn("تحذير: مشكلة في تحميل الترجمة:", err);
                window.currentLang = localStorage.getItem('preferredLang') || 'ar';
            }
        } else {
            console.warn("تحذير: نظام الترجمة غير متاح");
            window.currentLang = localStorage.getItem('preferredLang') || 'ar';
            document.documentElement.lang = window.currentLang;
            document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
        }

        // --- تهيئة السلة ---
        if (typeof cart === 'undefined') {
            console.error("السلة غير معرّفة. تأكد من تحميل cart.js");
            throw new Error("cart.js غير محمل. تأكد من تحميله قبل checkout.js");
        }

        // إصلاح cart.getCartItems إذا لم تكن موجودة
        if (!cart.getCartItems) {
            cart.getCartItems = function () {
                return this.items.map(item => {
                    // التعامل مع الهياكل المختلفة لعناصر السلة
                    const price = item.product ? item.product.price : item.price;
                    const quantity = item.quantity || 1;

                    return {
                        ...item,
                        total: price * quantity
                    };
                });
            };
        }

        // إصلاح cart.getTotal إذا لم تكن موجودة
        if (!cart.getTotal) {
            cart.getTotal = function () {
                return this.getCartItems().reduce((total, item) => total + item.total, 0);
            };
        }

        // تحديث عرض السلة
        cart.updateCartDisplay();
        // --- تحقق من وجود عناصر في السلة ---
        if (cart.items.length === 0) {
            console.log("6. السلة فارغة");
            CartUI.showEmpty();
            return;
        }

        if (Payment.selectedMethod === "paypal") {
            Payment.selectPayPal();
        }

        CartUI.loadSummary();
        FormValidation.init();
        Payment.init("cash");
        setupLanguageDropdownDirection();
        setupCityNames();
        setupGlobalHandlers();

    } catch (err) {
        console.error('❌ خطأ فادح في تحميل صفحة الإتمام:', err);
        showError(`حدث خطأ أثناء تحميل الصفحة: ${err.message}. يرجى المحاولة لاحقًا.`);
    }
});

// ... [بقية الكود كما هو] ...

// ============================================
// 🛒 واجهة سلة التسوق
// ============================================

const CartUI = {
    loadSummary() {
        const orderSummary = document.getElementById("orderSummary");
        const subtotal = document.getElementById("subtotal");
        const totalAmount = document.getElementById("totalAmount");
        const shippingCost = document.getElementById("shippingCost");
        const lang = window.currentLang || 'ar';

        if (!orderSummary) return;
        const items = cart.getCartItems();

        if (items.length === 0) {
            this.showEmpty();
            return;
        }

        // ترجمة "الكمية" و "المجموع"
        const quantityText = lang === 'ar' ? 'الكمية' : lang === 'fr' ? 'Quantité' : 'Quantity';
        const totalText = lang === 'ar' ? 'المجموع' : lang === 'fr' ? 'Total' : 'Total';

        orderSummary.innerHTML = items.map(item => {
            const name = item.product.name[lang] || item.product.name['en'] || item.product.name;
            return `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${item.product.image}" alt="${name}" 
                             class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${name}</h6>
                            <small class="text-muted">${quantityText}: ${formatNumberToArabic(item.quantity)}</small>
                        </div>
                    </div>
                    <span class="fw-bold">${formatPrice(item.total)}</span>
                </div>
            `;
        }).join("");

        const total = cart.getTotal();
        if (subtotal) subtotal.textContent = formatPrice(total);
        if (shippingCost) shippingCost.textContent = lang === 'ar' ? 'مجاني' : lang === 'fr' ? 'Gratuit' : 'Free';
        if (totalAmount) totalAmount.textContent = `${formatPrice(total)} ${lang === 'ar' ? 'درهم' : lang === 'fr' ? 'MAD' : 'MAD'}`;
    },

    showEmpty() {
        const container = document.querySelector(".container");
        if (container) {
            const lang = window.currentLang || 'ar';
            const msg = lang === 'ar' ? 'السلة فارغة' : lang === 'fr' ? 'Panier vide' : 'Cart is empty';
            const btn = lang === 'ar' ? 'تسوق الآن' : lang === 'fr' ? 'Acheter maintenant' : 'Shop now';

            container.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="text-center py-5">
                            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                            <h3>${msg}</h3>
                            <p class="text-muted mb-4">${lang === 'ar' ? 'لا توجد منتجات في سلة المشتريات' : lang === 'fr' ? 'Aucun produit dans le panier' : 'No products in cart'}</p>
                            <a href="products.html" class="btn btn-primary">${btn}</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
};

// ============================================
// 📝 التحقق من النموذج
// ============================================

const FormValidation = {
    init() {
        const phone = document.getElementById("phone");
        if (phone) {
            phone.addEventListener("input", () => this.validatePhone(phone));
        }

        const confirmOrderBtn = document.getElementById("confirmOrder");
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener("click", () => {
                if (this.validate()) {
                    const order = OrderManager.create();
                    OrderManager.confirm(order);
                }
            });
        }
    },

    validate() {
        const form = document.getElementById("checkoutForm");
        let valid = true;
        const required = ["firstName", "lastName", "phone", "city", "address"];
        const lang = window.currentLang || 'ar';

        required.forEach(id => {
            const field = document.getElementById(id);
            if (field && !field.value.trim()) {
                this.showError(field, lang === 'ar' ? 'هذا الحقل مطلوب' : lang === 'fr' ? 'Ce champ est requis' : 'This field is required');
                valid = false;
            } else if (field) {
                this.clearError(field);
            }
        });

        const phone = document.getElementById("phone");
        if (phone && phone.value && !this.validatePhone(phone)) valid = false;

        return valid;
    },

    validatePhone(input) {
        const regex = /^(05|06|07)[0-9]{8}$/;
        const ok = regex.test(input.value);
        const lang = window.currentLang || 'ar';

        if (input.value && !ok) {
            this.showError(input, lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح (06xxxxxxxx)' : lang === 'fr' ? 'Veuillez entrer un numéro de téléphone valide (06xxxxxxxx)' : 'Please enter a valid phone number (06xxxxxxxx)');
        } else {
            this.clearError(input);
        }
        return ok;
    },

    showError(field, msg) {
        this.clearError(field);
        field.classList.add("is-invalid");
        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.textContent = msg;
        field.parentNode.appendChild(div);
    },

    clearError(field) {
        field.classList.remove("is-invalid");
        const err = field.parentNode.querySelector(".invalid-feedback");
        if (err) err.remove();
    }
};

// ============================================
// 📦 إدارة الطلب
// ============================================

const OrderManager = {
    create() {
        const form = document.getElementById("checkoutForm");
        const data = new FormData(form);
        const lang = window.currentLang || 'ar';

        return {
            id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            items: cart.getCartItems(),
            customerInfo: {
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                phone: data.get("phone"),
                email: data.get("email") || "",
                city: data.get("city"),
                address: data.get("address"),
                notes: data.get("notes") || ""
            },
            total: cart.getTotal(),
            status: "pending",
            createdAt: new Date().toISOString(),
            paymentMethod: Payment.selectedMethod === "paypal" ? "paypal" : "cash_on_delivery"
        };
    },

    confirm(order) {
        this.save(order);
        this.sendEmail(order);
        this.showConfirmation(order);
        cart.clear();
    },

    save(order) {
        let orders = JSON.parse(localStorage.getItem("ordersHistory") || "[]");
        orders.push(order);
        localStorage.setItem("ordersHistory", JSON.stringify(orders));
    },

    sendEmail(order) {
        const lang = window.currentLang || 'ar';
        const tempForm = document.createElement("form");

        function addHiddenField(name, value) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            tempForm.appendChild(input);
        }

        addHiddenField("order_id", order.id);
        addHiddenField("customer_name", `${order.customerInfo.firstName} ${order.customerInfo.lastName}`);
        addHiddenField("phone", order.customerInfo.phone);
        addHiddenField("email", order.customerInfo.email);
        addHiddenField("city", getCityName(order.customerInfo.city, lang));
        addHiddenField("address", order.customerInfo.address);

        const notesValue = order.customerInfo.notes && order.customerInfo.notes.trim() !== ""
            ? order.customerInfo.notes.trim()
            : (lang === 'ar' ? 'لا توجد ملاحظات' : lang === 'fr' ? 'Aucune note' : 'No notes');
        addHiddenField("notes", notesValue);

        addHiddenField("total", formatPrice(order.total));
        addHiddenField("items", order.items
            .map(i => `${i.product.name[lang] || i.product.name['en']} × ${i.quantity} = ${formatPrice(i.total)}`)
            .join("\n"));

        // تأكد من تهيئة EmailJS بشكل صحيح
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS غير متاح');
            return;
        }

        emailjs.init("vAodR1HFl2lZJYfhe");
        emailjs.sendForm("service_gtnl9z6", "template_hmsw63u", tempForm)
            .then(res => console.log("✅ تم إرسال الطلب بنجاح", res))
            .catch(err => {
                console.error("❌ فشل الإرسال", err);
                showError(lang === 'ar' ? 'فشل إرسال الطلب. يرجى المحاولة لاحقًا.' : lang === 'fr' ? 'Échec de l\'envoi de la commande. Veuillez réessayer plus tard.' : 'Failed to send order. Please try again later.');
            });
    },

    showConfirmation(order) {
        const lang = window.currentLang || 'ar';
        const details = document.getElementById("orderDetails");
        if (!details) return;

        const notesToShow = order.customerInfo.notes && order.customerInfo.notes.trim() !== ""
            ? order.customerInfo.notes.trim()
            : (lang === 'ar' ? 'لا توجد ملاحظات' : lang === 'fr' ? 'Aucune note' : 'No notes');

        const labels = {
            ar: {
                orderId: 'رقم الطلب',
                customer: 'العميل',
                phone: 'الهاتف',
                city: 'المدينة',
                address: 'العنوان',
                total: 'المجموع',
                notes: 'ملاحظات'
            },
            fr: {
                orderId: 'Numéro de commande',
                customer: 'Client',
                phone: 'Téléphone',
                city: 'Ville',
                address: 'Adresse',
                total: 'Total',
                notes: 'Notes'
            },
            en: {
                orderId: 'Order ID',
                customer: 'Customer',
                phone: 'Phone',
                city: 'City',
                address: 'Address',
                total: 'Total',
                notes: 'Notes'
            }
        };

        const l = labels[lang] || labels.en;

        details.innerHTML = `
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.orderId}:</strong></div>
                <div class="col-sm-8">${order.id}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.customer}:</strong></div>
                <div class="col-sm-8">${order.customerInfo.firstName} ${order.customerInfo.lastName}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.phone}:</strong></div>
                <div class="col-sm-8">${order.customerInfo.phone}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.city}:</strong></div>
                <div class="col-sm-8">${getCityName(order.customerInfo.city, lang)}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.address}:</strong></div>
                <div class="col-sm-8">${order.customerInfo.address}</div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.total}:</strong></div>
                <div class="col-sm-8"><strong class="text-success">${formatPrice(order.total)}</strong></div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-4"><strong>${l.notes}:</strong></div>
                <div class="col-sm-8">${notesToShow}</div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById("confirmationModal"));
        modal.show();
    }
};

// ============================================
// 💳 طرق الدفع
// ============================================

// const Payment = {
//     selectedMethod: "cash",

//     init(method) {
//         const cashBtn = document.getElementById("cashPay");
//         const paypalBtn = document.getElementById("paypalPay");

//         if (cashBtn) cashBtn.addEventListener("click", () => this.selectCash());
//         if (paypalBtn) paypalBtn.addEventListener("click", () => this.selectPayPal());

//         if (method === "paypal") this.selectPayPal();
//         else this.selectCash();
//     },

//     selectCash() {
//         const lang = window.currentLang || 'ar';
//         const confirmBtn = document.getElementById("confirmOrder");
//         const paypalContainer = document.getElementById("paypal-button-container");

//         if (confirmBtn) confirmBtn.style.display = "block";
//         if (paypalContainer) {
//             paypalContainer.style.display = "none";
//             paypalContainer.innerHTML = "";
//         }

//         const alertInfo = document.getElementById("alertInfo");
//         const icon = document.getElementById("iconPaying");
//         const title = document.getElementById("title_pay");
//         const text = document.getElementById("text_pay");
//         const cashBtn = document.getElementById("cashPay");
//         const paypalBtn = document.getElementById("paypalPay");

//         if (alertInfo) {
//             alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i>
//             <strong>${lang === 'ar' ? 'الدفع عند الاستلام:' : lang === 'fr' ? 'Paiement à la livraison:' : 'Cash on delivery:'}</strong> 
//             ${lang === 'ar' ? 'ستقوم بدفع قيمة الطلب نقداً عند استلام المنتجات' : lang === 'fr' ? 'Vous paierez en espèces à la réception des produits' : 'You will pay in cash when receiving the products'}`;
//         }
//         if (icon) icon.className = "fas fa-money-bill-wave text-success me-3 fa-2x";
//         if (title) title.textContent = lang === 'ar' ? 'الدفع عند الاستلام' : lang === 'fr' ? 'Paiement à la livraison' : 'Cash on delivery';
//         if (text) text.textContent = lang === 'ar' ? 'ادفع نقداً عند استلام طلبك' : lang === 'fr' ? 'Payez en espèces à la réception de votre commande' : 'Pay in cash when you receive your order';

//         if (cashBtn) {
//             cashBtn.classList.add("btn-success", "text-white");
//             cashBtn.classList.remove("btn-outline-success");
//         }
//         if (paypalBtn) {
//             paypalBtn.classList.add("btn-outline-primary");
//             paypalBtn.classList.remove("btn-primary", "text-white");
//         }

//         this.selectedMethod = "cash";
//     },

//     selectPayPal() {
//         const lang = window.currentLang || 'ar';
//         const confirmBtn = document.getElementById("confirmOrder");
//         const paypalContainer = document.getElementById("paypal-button-container");

//         if (confirmBtn) confirmBtn.style.display = "none";
//         if (paypalContainer) paypalContainer.style.display = "block";

//         const alertInfo = document.getElementById("alertInfo");
//         const icon = document.getElementById("iconPaying");
//         const title = document.getElementById("title_pay");
//         const text = document.getElementById("text_pay");
//         const paypalBtn = document.getElementById("paypalPay");
//         const cashBtn = document.getElementById("cashPay");

//         if (alertInfo) {
//             alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i>
//             <strong>${lang === 'ar' ? 'الدفع عبر بايبال:' : lang === 'fr' ? 'Paiement par PayPal:' : 'Payment via PayPal:'}</strong> 
//             ${lang === 'ar' ? 'يمكنك الدفع باستخدام حسابك بايبال أو بطاقة بنكية مرتبطة' : lang === 'fr' ? 'Vous pouvez payer avec votre compte PayPal ou une carte bancaire associée' : 'You can pay using your PayPal account or a linked bank card'}`;
//         }
//         if (icon) icon.className = "fab fa-paypal text-primary me-3 fa-2x";
//         if (title) title.textContent = lang === 'ar' ? 'الدفع عبر بايبال' : lang === 'fr' ? 'Paiement par PayPal' : 'Payment via PayPal';
//         if (text) text.textContent = lang === 'ar' ? 'ادفع بأمان باستخدام بايبال أو البطاقة البنكية' : lang === 'fr' ? 'Payez en toute sécurité avec PayPal ou votre carte bancaire' : 'Pay securely with PayPal or your bank card';

//         if (paypalBtn) {
//             paypalBtn.classList.add("btn-primary", "text-white");
//             paypalBtn.classList.remove("btn-outline-primary");
//         }
//         if (cashBtn) {
//             cashBtn.classList.add("btn-outline-success");
//             cashBtn.classList.remove("btn-success", "text-white");
//         }

//         this.selectedMethod = "paypal";
//         this.renderPayPalButton();
//     },

//     renderPayPalButton() {
//         const lang = window.currentLang || 'ar';
//         const paypalContainer = document.getElementById("paypal-button-container");
//         if (!paypalContainer) return;

//         paypalContainer.innerHTML = "";

//         if (!window.paypal || typeof paypal.Buttons !== "function") {
//             console.warn("PayPal SDK غير محمّل أو client-id غير صحيح.");
//             if (paypalContainer) {
//                 paypalContainer.innerHTML = `
//                   <div class="alert alert-warning">
//                     ${lang === 'ar' ? 'تعذّر تحميل PayPal. تأكّد من client-id وترتيب السكربتات.' :
//                         lang === 'fr' ? 'Impossible de charger PayPal. Vérifiez le client-id et l\'ordre des scripts.' :
//                             'Failed to load PayPal. Check client-id and script order.'}
//                   </div>`;
//             }
//             return;
//         }

//         paypal.Buttons({
//             style: {
//                 layout: 'vertical',
//                 color: 'gold',
//                 shape: 'pill',
//                 label: 'pay',
//                 height: 45,
//                 tagline: false
//             },

//             onClick: (data, actions) => {
//                 if (!FormValidation.validate()) {
//                     return actions.reject();
//                 }
//                 if (!cart || !cart.items || cart.items.length === 0) {
//                     CartUI.showEmpty();
//                     return actions.reject();
//                 }
//                 return actions.resolve();
//             },

//             createOrder: (data, actions) => {
//                 // تحويل الدرهم المغربي إلى دولار (1 USD ≈ 10 MAD)
//                 const exchangeRate = 10;
//                 const totalMAD = cart.getTotal();
//                 const totalUSD = (totalMAD / exchangeRate).toFixed(2);

//                 console.log(`[PayPal] تحويل: ${totalMAD} MAD = ${totalUSD} USD`);

//                 return actions.order.create({
//                     purchase_units: [{
//                         amount: {
//                             value: totalUSD,
//                             currency_code: 'USD'
//                         },
//                         description: `طلب من متجرك الإلكتروني - ${totalMAD} MAD`
//                     }],
//                     application_context: {
//                         shipping_preference: 'NO_SHIPPING'
//                     }
//                 });
//             },

//             onApprove: (data, actions) => {
//                 return actions.order.capture().then(details => {
//                     console.log("تفاصيل الدفع:", details);

//                     const order = OrderManager.create();
//                     order.paymentMethod = "paypal";
//                     order.status = "paid";
//                     order.paypalTransactionId = data.orderID;

//                     OrderManager.confirm(order);
//                 }).catch(captureErr => {
//                     console.error("فشل استكمال الدفع:", captureErr);
//                     showError(lang === 'ar' ? 'فشل استكمال الدفع. يرجى المحاولة لاحقًا.' : 'Payment completion failed. Please try again.');
//                 });
//             },

//             onError: (err) => {
//                 console.error("❌ خطأ في الدفع عبر PayPal:", err);

//                 let errorMessage = "";
//                 const lang = window.currentLang || 'ar';

//                 if (err.name === "INSTRUMENT_DECLINED") {
//                     errorMessage = lang === 'ar'
//                         ? "تم رفض البطاقة. يرجى استخدام بطاقة أخرى."
//                         : "Your card was declined. Please use another card.";
//                 } else if (err.details && err.details[0] && err.details[0].description) {
//                     errorMessage = err.details[0].description;
//                 } else if (err.message && err.message.includes("422")) {
//                     errorMessage = lang === 'ar'
//                         ? "الدرهم المغربي غير مدعوم من قبل باي بال. يرجى استخدام طريقة دفع بديلة."
//                         : "MAD currency is not supported by PayPal. Please use an alternative payment method.";
//                 } else {
//                     errorMessage = lang === 'ar'
//                         ? "حدث خطأ أثناء الدفع. يرجى المحاولة لاحقًا."
//                         : "An error occurred during payment. Please try again.";
//                 }

//                 // إضافة رمز التتبع للدعم الفني
//                 const corrId = err.details?.[0]?.debug_id || "N/A";
//                 console.log(`[PayPal] Correlation ID: ${corrId}`);

//                 showError(`${errorMessage} (كود الخطأ: ${corrId})`);
//             }
//         }).render('#paypal-button-container');
//     }
// };

const Payment = {
    selectedMethod: "cash",
    paypalLoaded: false,
    paypalScript: null,
    paypalLoadAttempts: 0,
    maxLoadAttempts: 3,

    init(method) {
        const cashBtn = document.getElementById("cashPay");
        const paypalBtn = document.getElementById("paypalPay");

        if (cashBtn) cashBtn.addEventListener("click", () => this.selectCash());
        if (paypalBtn) paypalBtn.addEventListener("click", () => this.selectPayPal());

        // تحديث باي بال عند تغيير اللغة
        document.body.addEventListener('click', (e) => {
            const langBtn = e.target.closest('[data-lang]');
            if (langBtn && this.selectedMethod === "paypal") {
                this.selectPayPal(); // إعادة تحميل باي بال باللغة الجديدة
            }
        });

        if (method === "paypal") this.selectPayPal();
        else this.selectCash();
    },

    selectCash() {
        const lang = window.currentLang || 'ar';

        this.selectedMethod = "cash";

        // إخفاء باي بال
        const paypalContainer = document.getElementById("paypal-button-container");
        if (paypalContainer) {
            paypalContainer.style.display = "none";
            paypalContainer.innerHTML = "";
        }

        // تحديث الواجهة
        const alertInfo = document.getElementById("alertInfo");
        const icon = document.getElementById("iconPaying");
        const title = document.getElementById("title_pay");
        const text = document.getElementById("text_pay");
        const cashBtn = document.getElementById("cashPay");
        const paypalBtn = document.getElementById("paypalPay");
        const confirmBtn = document.getElementById("confirmOrder");

        if (alertInfo) {
            alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i>
            <strong>${lang === 'ar' ? 'الدفع عند الاستلام:' : lang === 'fr' ? 'Paiement à la livraison:' : 'Cash on delivery:'}</strong> 
            ${lang === 'ar' ? 'ستقوم بدفع قيمة الطلب نقداً عند استلام المنتجات' : lang === 'fr' ? 'Vous paierez en espèces à la réception des produits' : 'You will pay in cash when receiving the products'}`;
        }

        if (icon) icon.className = "fas fa-money-bill-wave text-success me-3 fa-2x";
        if (title) title.textContent = lang === 'ar' ? 'الدفع عند الاستلام' : lang === 'fr' ? 'Paiement à la livraison' : 'Cash on delivery';
        if (text) text.textContent = lang === 'ar' ? 'ادفع نقداً عند استلام طلبك' : lang === 'fr' ? 'Payez en espèces à la réception de votre commande' : 'Pay in cash when you receive your order';

        if (cashBtn) {
            cashBtn.classList.add("btn-success", "text-white");
            cashBtn.classList.remove("btn-outline-success");
        }
        if (paypalBtn) {
            paypalBtn.classList.add("btn-outline-primary");
            paypalBtn.classList.remove("btn-primary", "text-white");
        }
        if (confirmBtn) {
            confirmBtn.style.display = "block";
        }

        this.selectedMethod = "cash";
    },

    selectPayPal() {
        const lang = window.currentLang || 'ar';

        this.selectedMethod = "paypal";

        // إظهار باي بال مع رسالة تحميل
        const paypalContainer = document.getElementById("paypal-button-container");
        if (paypalContainer) {
            paypalContainer.style.display = "block";
            paypalContainer.innerHTML = `<div class="text-center py-3"><i class="fas fa-spinner fa-spin me-2"></i> ${lang === 'ar' ? 'جاري التحميل...' : lang === 'fr' ? 'Chargement en cours...' : 'Loading...'}</div>`;
        }

        // تحديث الواجهة
        const alertInfo = document.getElementById("alertInfo");
        const icon = document.getElementById("iconPaying");
        const title = document.getElementById("title_pay");
        const text = document.getElementById("text_pay");
        const paypalBtn = document.getElementById("paypalPay");
        const cashBtn = document.getElementById("cashPay");
        const confirmBtn = document.getElementById("confirmOrder");

        if (alertInfo) {
            alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i>
            <strong>${lang === 'ar' ? 'الدفع عبر PayPal:' : lang === 'fr' ? 'Paiement par PayPal:' : 'Payment via PayPal:'}</strong> 
            ${lang === 'ar' ? 'يمكنك الدفع باستخدام حسابك بايبال أو بطاقة بنكية مرتبطة' : lang === 'fr' ? 'Vous pouvez payer avec votre compte PayPal ou une carte bancaire associée' : 'You can pay using your PayPal account or a linked bank card'}`;
        }

        if (icon) icon.className = "fab fa-paypal text-primary me-3 fa-2x";
        if (title) title.textContent = lang === 'ar' ? 'الدفع عبر PayPal' : lang === 'fr' ? 'Paiement par PayPal' : 'Payment via PayPal';
        if (text) text.textContent = lang === 'ar' ? 'ادفع بأمان باستخدام PayPal أو البطاقة البنكية' : lang === 'fr' ? 'Payez en toute sécurité avec PayPal ou votre carte bancaire' : 'Pay securely with PayPal or your bank card';

        if (paypalBtn) {
            paypalBtn.classList.add("btn-primary", "text-white");
            paypalBtn.classList.remove("btn-outline-primary");
        }
        if (cashBtn) {
            cashBtn.classList.add("btn-outline-success");
            cashBtn.classList.remove("btn-success", "text-white");
        }
        if (confirmBtn) {
            confirmBtn.style.display = "none";
        }

        // إعادة تعيين محاولات التحميل
        this.paypalLoadAttempts = 0;

        // تحميل باي بال باللغة الجديدة مع الحفاظ على الدولة المغربية
        this.loadPayPalScript().then(() => {
            this.renderPayPalButton();
        }).catch(err => {
            console.error("فشل تحميل PayPal SDK:", err);
            this.handlePayPalLoadError(lang);
        });
    },

    loadPayPalScript() {
        return new Promise((resolve, reject) => {
            // إعادة تعيين المحاولات إذا تجاوزت الحد
            if (this.paypalLoadAttempts >= this.maxLoadAttempts) {
                reject(new Error("تم تجاوز الحد الأقصى لمحاولات التحميل"));
                return;
            }

            // زيادة عدد المحاولات
            this.paypalLoadAttempts++;

            // تحديد اللغة الحالية مع الحفاظ على الدولة المغربية (MA)
            let locale = "en_MA"; // الافتراضي

            if (window.currentLang === 'ar') {
                locale = "ar_MA";
            } else if (window.currentLang === 'fr') {
                locale = "fr_MA";
            } else {
                locale = "en_MA";
            }

            // إزالة السكربت القديم إذا وجد
            if (this.paypalScript) {
                document.body.removeChild(this.paypalScript);
                this.paypalLoaded = false;
            }

            // تحميل PayPal SDK مع اللغة الصحيحة والدولة المغربية
            const sdkUrl = `https://www.paypal.com/sdk/js?client-id=AfeyzZmy4zvSj3PrLqUaaIvDYjAfKRb_oQ26nTgGRrAVd4tZbNqgkyrU4gYrftm813U7if03GcFmxkYl&currency=USD&locale=${locale}`;

            const script = document.createElement("script");
            script.src = sdkUrl;
            script.id = "paypal-sdk";

            script.onload = () => {
                this.paypalLoaded = true;
                this.paypalScript = script;
                resolve();
            };

            script.onerror = (err) => {
                console.warn(`محاولة تحميل باي بال ${this.paypalLoadAttempts} فشلت`);
                reject(err);
            };

            document.body.appendChild(script);
        });
    },

    handlePayPalLoadError(lang) {
        const paypalContainer = document.getElementById("paypal-button-container");
        if (!paypalContainer) return;

        // إذا فشلت المحاولات الثلاث، حاول استخدام الإنجليزية المغربية كخيار احتياطي
        if (this.paypalLoadAttempts >= this.maxLoadAttempts) {
            // محاولة استخدام الإنجليزية المغربية
            window.currentLang = 'en';
            document.documentElement.lang = 'en';

            this.paypalLoadAttempts = 0;

            this.loadPayPalScript().then(() => {
                this.renderPayPalButton();
            }).catch(() => {
                paypalContainer.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${lang === 'ar'
                        ? 'واجه باي بال مشكلة في التحميل بلغة عربية. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع بديلة.'
                        : lang === 'fr'
                            ? 'PayPal a rencontré un problème de chargement en arabe. Veuillez réessayer ou utiliser un autre mode de paiement.'
                            : 'PayPal encountered an issue loading in Arabic. Please try again or use an alternative payment method.'}
                    </div>
                `;
            });
            return;
        }

        // إذا لم تكن المحاولات قد انتهت، حاول مرة أخرى بعد فترة
        paypalContainer.innerHTML = `<div class="text-center py-3">
            <i class="fas fa-sync fa-spin me-2"></i> 
            ${lang === 'ar' ? `إعادة المحاولة (${this.paypalLoadAttempts}/${this.maxLoadAttempts})...` : 'Retrying...'}
        </div>`;

        // محاولة إعادة التحميل بعد 1.5 ثانية
        setTimeout(() => {
            this.loadPayPalScript().then(() => {
                this.renderPayPalButton();
            }).catch(() => {
                this.handlePayPalLoadError(lang);
            });
        }, 1500);
    },

    renderPayPalButton() {
        const lang = window.currentLang || 'ar';
        const paypalContainer = document.getElementById("paypal-button-container");
        if (!paypalContainer) return;

        // التأكد من تحميل PayPal SDK
        if (!window.paypal || typeof paypal.Buttons !== "function") {
            this.showPayPalError(lang);
            return;
        }

        paypalContainer.innerHTML = "";

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'pill',
                label: 'pay',
                height: 45,
                tagline: false
            },

            onClick: (data, actions) => {
                if (!FormValidation.validate()) {
                    showError(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                    return actions.reject();
                }
                if (cart.items.length === 0) {
                    CartUI.showEmpty();
                    return actions.reject();
                }
                return actions.resolve();
            },

            createOrder: (data, actions) => {
                // تحويل الدرهم المغربي إلى دولار (1 USD = 10 MAD)
                const exchangeRate = 10;
                const totalMAD = cart.getTotal();
                const totalUSD = (totalMAD / exchangeRate).toFixed(2);

                console.log(`[PayPal] تحويل: ${totalMAD} MAD = ${totalUSD} USD`);

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: totalUSD,
                            currency_code: 'USD'
                        },
                        description: `طلب من متجرك الإلكتروني - ${totalMAD} MAD`
                    }],
                    application_context: {
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW'
                    }
                });
            },

            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    console.log("تفاصيل الدفع:", details);

                    const order = OrderManager.create();
                    order.paymentMethod = "paypal";
                    order.status = "paid";
                    order.paypalTransactionId = data.orderID;

                    OrderManager.confirm(order);
                }).catch(captureErr => {
                    console.error("فشل استكمال الدفع:", captureErr);
                    showError(lang === 'ar' ? 'فشل استكمال الدفع. يرجى المحاولة لاحقًا.' : 'Payment completion failed. Please try again.');
                });
            },

            onError: (err) => {
                console.error("❌ خطأ في الدفع عبر PayPal:", err);

                let errorMessage = "";
                if (err.name === "INSTRUMENT_DECLINED") {
                    errorMessage = lang === 'ar'
                        ? "تم رفض البطاقة. يرجى استخدام بطاقة أخرى."
                        : "Your card was declined. Please use another card.";
                } else if (err.details && err.details[0] && err.details[0].description) {
                    errorMessage = err.details[0].description;
                } else if (err.message && err.message.includes("422")) {
                    errorMessage = lang === 'ar'
                        ? "الدرهم المغربي غير مدعوم من قبل باي بال. يرجى استخدام طريقة دفع بديلة."
                        : "MAD currency is not supported by PayPal. Please use an alternative payment method.";
                } else {
                    errorMessage = lang === 'ar'
                        ? "حدث خطأ أثناء الدفع. يرجى المحاولة لاحقًا."
                        : "An error occurred during payment. Please try again.";
                }

                // إضافة رمز التتبع للدعم الفني
                const corrId = err.details?.[0]?.debug_id || "N/A";
                console.log(`[PayPal] Correlation ID: ${corrId}`);

                showError(`${errorMessage} (كود الخطأ: ${corrId})`);
            }
        }).render('#paypal-button-container');
    },

    showPayPalError(lang) {
        const paypalContainer = document.getElementById("paypal-button-container");
        if (!paypalContainer) return;

        paypalContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${lang === 'ar'
                ? 'تعذر تحميل PayPal. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع بديلة.'
                : lang === 'fr'
                    ? 'Impossible de charger PayPal. Veuillez réessayer ou utiliser un autre mode de paiement.'
                    : 'Failed to load PayPal. Please try again or use an alternative payment method.'}
            </div>
        `;
    }
};


// ============================================
// 🌍 دعم الترجمة الكاملة
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
        CartUI.loadSummary();
        setupCityNames();
        Payment.init(Payment.selectedMethod); // تحديث واجهة طرق الدفع
    });
}

function setupCityNames() {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;

    const lang = window.currentLang || 'ar';
    const cities = {
        'ar': {
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
        },
        'fr': {
            'casablanca': 'Casablanca',
            'rabat': 'Rabat',
            'marrakech': 'Marrakech',
            'fes': 'Fès',
            'meknes': 'Meknès',
            'tangier': 'Tanger',
            'agadir': 'Agadir',
            'oujda': 'Oujda',
            'kenitra': 'Kénitra',
            'tetouan': 'Tétouan',
            'safi': 'Safi',
            'eljadida': 'El Jadida',
            'nador': 'Nador',
            'khouribga': 'Khouribga',
            'beni_mellal': 'Beni Mellal',
            'taourirt': 'Taourirt',
            'larache': 'Larache',
            'khemisset': 'Khemisset',
            'berkane': 'Berkane',
            'khenifra': 'Khenifra',
            'guelmim': 'Guelmim',
            'settat': 'Settat',
            'taza': 'Taza',
            'errachidia': 'Errachidia',
            'laayoune': 'Laâyoune',
            'dakhla': 'Dakhla',
            'taroudant': 'Taroudant',
            'azrou': 'Azrou',
            'ifrane': 'Ifrane',
            'sidi_ifni': 'Sidi Ifni',
            'zagora': 'Zagora'
        },
        'en': {
            'casablanca': 'Casablanca',
            'rabat': 'Rabat',
            'marrakech': 'Marrakech',
            'fes': 'Fes',
            'meknes': 'Meknes',
            'tangier': 'Tangier',
            'agadir': 'Agadir',
            'oujda': 'Oujda',
            'kenitra': 'Kenitra',
            'tetouan': 'Tetouan',
            'safi': 'Safi',
            'eljadida': 'El Jadida',
            'nador': 'Nador',
            'khouribga': 'Khouribga',
            'beni_mellal': 'Beni Mellal',
            'taourirt': 'Taourirt',
            'larache': 'Larache',
            'khemisset': 'Khemisset',
            'berkane': 'Berkane',
            'khenifra': 'Khenifra',
            'guelmim': 'Guelmim',
            'settat': 'Settat',
            'taza': 'Taza',
            'errachidia': 'Errachidia',
            'laayoune': 'Laayoune',
            'dakhla': 'Dakhla',
            'taroudant': 'Taroudant',
            'azrou': 'Azrou',
            'ifrane': 'Ifrane',
            'sidi_ifni': 'Sidi Ifni',
            'zagora': 'Zagora'
        }
    };

    // تحديث أسماء المدن
    Array.from(citySelect.options).forEach(option => {
        if (option.value && cities[lang][option.value]) {
            option.textContent = cities[lang][option.value];
        }
    });
}

// ============================================
// 🌍 ترجمة أسماء المدن
// ============================================

function getCityName(value, lang = 'ar') {
    const cities = {
        'ar': {
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
        },
        'fr': {
            'casablanca': 'Casablanca',
            'rabat': 'Rabat',
            'marrakech': 'Marrakech',
            'fes': 'Fès',
            'meknes': 'Meknès',
            'tangier': 'Tanger',
            'agadir': 'Agadir',
            'oujda': 'Oujda',
            'kenitra': 'Kénitra',
            'tetouan': 'Tétouan',
            'safi': 'Safi',
            'eljadida': 'El Jadida',
            'nador': 'Nador',
            'khouribga': 'Khouribga',
            'beni_mellal': 'Beni Mellal',
            'taourirt': 'Taourirt',
            'larache': 'Larache',
            'khemisset': 'Khemisset',
            'berkane': 'Berkane',
            'khenifra': 'Khenifra',
            'guelmim': 'Guelmim',
            'settat': 'Settat',
            'taza': 'Taza',
            'errachidia': 'Errachidia',
            'laayoune': 'Laâyoune',
            'dakhla': 'Dakhla',
            'taroudant': 'Taroudant',
            'azrou': 'Azrou',
            'ifrane': 'Ifrane',
            'sidi_ifni': 'Sidi Ifni',
            'zagora': 'Zagora'
        },
        'en': {
            'casablanca': 'Casablanca',
            'rabat': 'Rabat',
            'marrakech': 'Marrakech',
            'fes': 'Fes',
            'meknes': 'Meknes',
            'tangier': 'Tangier',
            'agadir': 'Agadir',
            'oujda': 'Oujda',
            'kenitra': 'Kenitra',
            'tetouan': 'Tetouan',
            'safi': 'Safi',
            'eljadida': 'El Jadida',
            'nador': 'Nador',
            'khouribga': 'Khouribga',
            'beni_mellal': 'Beni Mellal',
            'taourirt': 'Taourirt',
            'larache': 'Larache',
            'khemisset': 'Khemisset',
            'berkane': 'Berkane',
            'khenifra': 'Khenifra',
            'guelmim': 'Guelmim',
            'settat': 'Settat',
            'taza': 'Taza',
            'errachidia': 'Errachidia',
            'laayoune': 'Laayoune',
            'dakhla': 'Dakhla',
            'taroudant': 'Taroudant',
            'azrou': 'Azrou',
            'ifrane': 'Ifrane',
            'sidi_ifni': 'Sidi Ifni',
            'zagora': 'Zagora'
        }
    };

    return cities[lang]?.[value] || value;
}

// ============================================
// 🌍 تفويض الأحداث (لا تستخدم onclick)
// ============================================

function setupGlobalHandlers() {
    document.addEventListener('click', function (e) {
        // --- تغيير الكمية ---
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

// ============================================
// 🛠️ أدوات
// ============================================

function formatPrice(value) {
    const lang = window.currentLang || 'ar';
    const num = Number(value) || 0;
    try {
        return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : lang, {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    } catch (e) {
        return `${num} درهم`;
    }
}

function formatNumberToArabic(num) {
    return formatPrice(num).replace(/[\d]/g, d => '٠١٢٣٤٥٦٧٨٩'[d] || d);
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: window.currentLang === 'ar' ? 'خطأ' : window.currentLang === 'fr' ? 'Erreur' : 'Error',
        text: message,
        confirmButtonText: window.currentLang === 'ar' ? 'حسناً' : window.currentLang === 'fr' ? 'OK' : 'OK'
    });
}

function goToProducts() {
    window.location.href = 'products.html';
}

// دالة لتحديث باي بال عند تغيير اللغة
function updatePayPalLanguage() {
    if (Payment.selectedMethod === "paypal") {
        Payment.selectPayPal(); // إعادة تحميل باي بال باللغة الجديدة
    }
}

// تفعيل الدالة عند تغيير اللغة
document.body.addEventListener('click', (e) => {
    const langBtn = e.target.closest('[data-lang]');
    if (langBtn) {
        setTimeout(updatePayPalLanguage, 500); // انتظر حتى يتم تطبيق التغييرات
    }
});