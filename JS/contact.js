// Contact page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize contact page
    initializeContactForm();
    initializeSearch();

    // Load cart count
    cart.updateCartDisplay();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Form validation
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateContactForm()) {
            submitContactForm();
        }
    });

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            validatePhoneNumber(this);
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            validateEmail(this);
        });
    }
}

// Validate contact form
function validateContactForm() {
    let isValid = true;

    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            showFieldError(field, 'هذا الحقل مطلوب');
            isValid = false;
        } else if (field) {
            hideFieldError(field);
        }
    });

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value && !validateEmail(emailInput)) {
        isValid = false;
    }

    // Phone validation (if provided)
    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value && !validatePhoneNumber(phoneInput)) {
        isValid = false;
    }

    // Terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (agreeTerms && !agreeTerms.checked) {
        showFieldError(agreeTerms, 'يجب الموافقة على الشروط والأحكام');
        isValid = false;
    } else if (agreeTerms) {
        hideFieldError(agreeTerms);
    }

    return isValid;
}

// Validate email
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    if (input.value && !isValid) {
        input.classList.add('is-invalid');
        showFieldError(input, 'يرجى إدخال بريد إلكتروني صحيح');
    } else {
        input.classList.remove('is-invalid');
        hideFieldError(input);
    }

    return isValid;
}

// Validate phone number
function validatePhoneNumber(input) {
    const phoneRegex = /^(05|5)[0-9]{8}$/;
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

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    hideFieldError(field);

    // Add error class
    field.classList.add('is-invalid');

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Hide field error
function hideFieldError(field) {
    field.classList.remove('is-invalid');
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Submit contact form
function submitContactForm() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');

    // Show loading state
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...';
        submitBtn.disabled = true;
    }

    // Simulate form submission
    setTimeout(() => {
        // Create contact message object
        const contactMessage = createContactMessage();

        // Save message to localStorage
        saveContactMessage(contactMessage);

        // Show success modal
        showSuccessModal();

        // Reset form
        resetContactForm();

        // Reset button
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>إرسال الرسالة';
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Create contact message object
function createContactMessage() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    const message = {
        id: generateMessageId(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || '',
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        createdAt: new Date().toISOString(),
        status: 'new'
    };

    return message;
}

// Generate message ID
function generateMessageId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `MSG-${timestamp}-${random}`;
}

// Save contact message to localStorage
function saveContactMessage(message) {
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

// Show success modal
function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Reset contact form
function resetContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();

        // Remove validation classes
        const inputs = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });

        // Remove error messages
        const errors = form.querySelectorAll('.invalid-feedback');
        errors.forEach(error => error.remove());
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search button click
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Smooth scrolling for FAQ links
document.addEventListener('click', function (e) {
    if (e.target.matches('.accordion-button')) {
        // Let Bootstrap handle the accordion
        return;
    }
});

// Auto-expand FAQ if coming from a direct link
document.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#faq')) {
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });

            // Expand the accordion item
            const collapseTarget = target.querySelector('.accordion-collapse');
            if (collapseTarget) {
                const collapse = new bootstrap.Collapse(collapseTarget, { show: true });
            }
        }
    }
});