// Initialize search functionality
document.addEventListener('DOMContentLoaded', function () {
    // Load cart count
    cart.updateCartDisplay();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
});

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}