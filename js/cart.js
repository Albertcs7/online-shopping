/**
 * ShopEasy - Cart JavaScript
 * Handles shopping cart operations.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        renderCart();
    }
});

function addToCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const cartKey = CART_PREFIX + currentUser.id;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount(currentUser.id);
    alert('Product added to cart!');
}

function renderCart() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return;

    const cartKey = CART_PREFIX + currentUser.id;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const table = document.querySelector('.table-responsive');

    if (cart.length === 0) {
        emptyMessage.classList.remove('d-none');
        if (table) table.parentElement.parentElement.classList.add('d-none');
        updateTotals(0);
        return;
    }

    if (table) table.parentElement.parentElement.classList.remove('d-none');
    emptyMessage.classList.add('d-none');

    let total = 0;

    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return ''; // Should not happen if data integrity is maintained

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        return `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0 fw-semibold">${product.name}</h6>
                            <small class="text-muted">${product.category}</small>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(product.price)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 100px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.productId}, -1)">-</button>
                        <input type="text" class="form-control text-center bg-white" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.productId}, 1)">+</button>
                    </div>
                </td>
                <td class="fw-bold">${formatCurrency(itemTotal)}</td>
                <td class="pe-4 text-end">
                    <button class="btn btn-link text-danger p-0" onclick="removeFromCart(${item.productId})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    updateTotals(total);
}

function updateQuantity(productId, change) {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const cartKey = CART_PREFIX + currentUser.id;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        renderCart();
        updateCartCount(currentUser.id);
    }
}

function removeFromCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const cartKey = CART_PREFIX + currentUser.id;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    cart = cart.filter(item => item.productId !== productId);

    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
    updateCartCount(currentUser.id);
}

function updateTotals(total) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}
