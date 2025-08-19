// checkout.js
document.addEventListener("DOMContentLoaded", () => {
    CartUI.loadSummary();
    FormValidation.init();
    Payment.init("cash");
    cart.updateCartDisplay();
    
    if (cart.items.length === 0) {
        CartUI.showEmpty();
    }
});

/* ---------------- UI: Cart ---------------- */
const CartUI = {
    loadSummary() {
        const orderSummary = document.getElementById("orderSummary");
        const subtotal = document.getElementById("subtotal");
        const totalAmount = document.getElementById("totalAmount");

        if (!orderSummary) return;
        const items = cart.getCartItems();

        if (items.length === 0) {
            this.showEmpty();
            return;
        }

        orderSummary.innerHTML = items.map(item => `
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
        `).join("");

        const total = cart.getTotal();
        if (subtotal) subtotal.textContent = formatPrice(total);
        if (totalAmount) totalAmount.textContent = formatPrice(total);
    },

    showEmpty() {
        const container = document.querySelector(".container");
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
};

/* ---------------- Validation ---------------- */
const FormValidation = {
    init() {
        const form = document.getElementById("checkoutForm");
        if (!form) return;

        form.addEventListener("submit", e => {
            e.preventDefault();
            if (this.validate()) {
                return true;
            }
        });

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

        required.forEach(id => {
            const field = document.getElementById(id);
            if (field && !field.value.trim()) {
                this.showError(field, "هذا الحقل مطلوب");
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
        if (input.value && !ok) {
            this.showError(input, "يرجى إدخال رقم هاتف صحيح (05xxxxxxxx)");
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

/* ---------------- Order Manager ---------------- */
const OrderManager = {
    create() {
        const form = document.getElementById("checkoutForm");
        const data = new FormData(form);

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
            paymentMethod: "cash_on_delivery"
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
        addHiddenField("city", getCityName(order.customerInfo.city));
        addHiddenField("address", order.customerInfo.address);

        const notesValue = order.customerInfo.notes && order.customerInfo.notes.trim() !== ""
            ? order.customerInfo.notes.trim()
            : "لا توجد ملاحظات";
        addHiddenField("notes", notesValue);

        addHiddenField("total", formatPrice(order.total));
        addHiddenField("items", order.items
            .map(i => `${i.product.name} × ${i.quantity} = ${formatPrice(i.total)}`)
            .join("<br>"));

        emailjs.init("vAodR1HFl2lZJYfhe");
        emailjs.sendForm("service_gtnl9z6", "template_hmsw63u", tempForm)
            .then(res => console.log("✅ تم إرسال الطلب بنجاح", res))
            .catch(err => console.error("❌ فشل الإرسال", err));
    },

    showConfirmation(order) {
        const details = document.getElementById("orderDetails");
        if (!details) return;

        const notesToShow = order.customerInfo.notes && order.customerInfo.notes.trim() !== ""
            ? order.customerInfo.notes.trim()
            : "لا توجد ملاحظات";

        details.innerHTML = `
            <div class="row mb-3"><div class="col-sm-4"><strong>رقم الطلب:</strong></div><div class="col-sm-8">${order.id}</div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>العميل:</strong></div><div class="col-sm-8">${order.customerInfo.firstName} ${order.customerInfo.lastName}</div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>الهاتف:</strong></div><div class="col-sm-8">${order.customerInfo.phone}</div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>المدينة:</strong></div><div class="col-sm-8">${getCityName(order.customerInfo.city)}</div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>العنوان:</strong></div><div class="col-sm-8">${order.customerInfo.address}</div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>المجموع:</strong></div><div class="col-sm-8"><strong class="text-success">${formatPrice(order.total)}</strong></div></div>
            <div class="row mb-3"><div class="col-sm-4"><strong>ملاحظات:</strong></div><div class="col-sm-8">${notesToShow}</div></div>
        `;

        const modal = new bootstrap.Modal(document.getElementById("confirmationModal"));
        modal.show();
    }
};


/* ---------------- Payment ---------------- */
const Payment = {
    init(method) {
        if (method === "cash") {
            this.cash();
        }
        // future: else if (method === "paypal") { this.paypal(); }
    },

    cash() {
        const alertInfo = document.getElementById("alertInfo");
        const icon = document.getElementById("iconPaying");
        const title = document.getElementById("title_pay");
        const text = document.getElementById("text_pay");
        const cashBtn = document.getElementById("cashPay");

        alertInfo.innerHTML = `<i class="fas fa-info-circle me-2"></i><strong>الدفع عند الاستلام:</strong> ستقوم بدفع قيمة الطلب نقداً عند استلام المنتجات`;
        icon.className = "fas fa-money-bill-wave text-success me-3 fa-2x";
        title.textContent = "الدفع عند الاستلام";
        text.textContent = "ادفع نقداً عند استلام طلبك";

        cashBtn.classList.remove("btn-outline-success");
        cashBtn.classList.add("btn-success");
    }
};

/* ---------------- Helpers ---------------- */
function getCityName(value) {
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
    return cities[value] || value;
}
