/**
 * ShopEasy - Main JavaScript
 * Handles data initialization, auth state management, and global UI updates.
 */

// Constants
const USERS_KEY = 'shopeasy_users';
const PRODUCTS_KEY = 'shopeasy_products_v9';
const CURRENT_USER_KEY = 'shopeasy_current_user';
const CART_PREFIX = 'shopeasy_cart_';

// Initial Data Seeding
function initData() {
    // Seed Users if empty
    if (!localStorage.getItem(USERS_KEY)) {
        const initialUsers = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@shopeasy.com',
                password: 'admin', // In a real app, hash this!
                role: 'admin'
            },
            {
                id: 2,
                name: 'John Doe',
                email: 'user@shopeasy.com',
                password: 'user',
                role: 'user'
            }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
        console.log('Users seeded.');
    }

    // Seed Products if empty or if using old key (force update for v9)
    // We check for the new key to ensure we seed the new data
    if (!localStorage.getItem(PRODUCTS_KEY)) {
        const initialProducts = [
            {
                id: 1,
                name: 'Smartphone X',
                description: 'Latest model with high-res camera and bezel-less display.',
                price: 84915,
                category: 'Electronics',
                image: 'images/smartphone.png'
            },
            {
                id: 2,
                name: 'Designer Jacket',
                description: 'Stylish leather jacket, perfect for any occasion.',
                price: 16915,
                category: 'Fashion',
                image: 'images/jacket.png'
            },
            {
                id: 3,
                name: 'Ergonomic Chair',
                description: 'Best for office work and gaming, providing ultimate comfort.',
                price: 21250,
                category: 'Home & Living',
                image: 'images/chair.png'
            },
            {
                id: 4,
                name: 'Wireless Headphones',
                description: 'Noise cancelling with long battery life and premium sound.',
                price: 12750,
                category: 'Electronics',
                image: 'images/headphones.png'
            },
            {
                id: 5,
                name: 'Smart Watch',
                description: 'Track your fitness and stay connected on the go.',
                price: 25415,
                category: 'Electronics',
                image: 'images/watch.png'
            },
            {
                id: 6,
                name: 'Running Shoes',
                description: 'Lightweight and durable shoes for your daily run.',
                price: 7565,
                category: 'Fashion',
                image: 'images/shoes.png'
            },
            {
                id: 7,
                name: 'Premium Coffee Maker',
                description: 'Brew the perfect cup of coffee every morning.',
                price: 10965,
                category: 'Home & Living',
                image: 'images/coffee.png'
            },
            {
                id: 8,
                name: 'Gaming Laptop',
                description: 'High-performance laptop for the ultimate gaming experience.',
                price: 127415,
                category: 'Electronics',
                image: 'images/gaming_laptop.jpg'
            },
            {
                id: 9,
                name: 'Modern Floor Lamp',
                description: 'Minimalist standing lamp with warm light.',
                price: 7565,
                category: 'Home & Living',
                image: 'images/floor_lamp.jpg'
            },
            {
                id: 10,
                name: 'Soft Area Rug',
                description: 'Fluffy, textured rug in a neutral color.',
                price: 10200,
                category: 'Home & Living',
                image: 'images/area_rug.jpg'
            },
            {
                id: 11,
                name: 'Ceramic Plant Pot',
                description: 'Stylish pot with a green indoor plant.',
                price: 2975,
                category: 'Home & Living',
                image: 'images/plant_pot.jpg'
            },
            {
                id: 12,
                name: 'Decorative Throw Pillows',
                description: 'Set of colorful and textured decorative throw pillows.',
                price: 3825,
                category: 'Home & Living',
                image: 'images/throw_pillows.jpg'
            }
        ];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
        console.log('Products V9 seeded.');
    }
}

// Auth State Management
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navLogout = document.getElementById('nav-logout');
    const navAdmin = document.getElementById('nav-admin');
    const navCart = document.getElementById('nav-cart');
    const navUserName = document.getElementById('nav-user-name');
    const userNameDisplay = document.getElementById('user-name-display');

    if (currentUser) {
        // User is logged in
        if (navLogin) navLogin.classList.add('d-none');
        if (navRegister) navRegister.classList.add('d-none');
        if (navLogout) navLogout.classList.remove('d-none');
        if (navUserName) navUserName.classList.remove('d-none');
        if (userNameDisplay) userNameDisplay.textContent = `Hi, ${currentUser.name}`;

        if (currentUser.role === 'admin') {
            if (navAdmin) navAdmin.classList.remove('d-none');
        } else {
            if (navCart) navCart.classList.remove('d-none');
            updateCartCount(currentUser.id);
        }
    } else {
        // User is logged out
        if (navLogin) navLogin.classList.remove('d-none');
        if (navRegister) navRegister.classList.remove('d-none');
        if (navLogout) navLogout.classList.add('d-none');
        if (navAdmin) navAdmin.classList.add('d-none');
        if (navCart) navCart.classList.add('d-none');
        if (navUserName) navUserName.classList.add('d-none');
    }
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

function updateCartCount(userId) {
    const cartKey = CART_PREFIX + userId;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

// Global addToCart for Home page usage
window.addToCart = function (productId) {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) {
        alert('Please login to add items to cart.');
        window.location.href = 'login.html';
        return;
    }

    const cartKey = CART_PREFIX + currentUser.id;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount(currentUser.id);
    alert('Product added to cart!');
};

// Helper to format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    // Filter for Home & Living products to feature them
    const featured = products.filter(p => p.category === 'Home & Living').slice(0, 4);

    if (featured.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No featured products available.</p>';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const isAdmin = currentUser && currentUser.role === 'admin';

    container.innerHTML = featured.map(product => `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 border-0 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${product.name}</h5>
                        <span class="badge bg-light text-dark border">${product.category}</span>
                    </div>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <h4 class="fw-bold text-primary mb-3">${formatCurrency(product.price)}</h4>
                    
                    <div class="mt-auto">
                        <button onclick="addToCart(${product.id})" class="btn btn-primary w-100 rounded-pill shadow-sm">
                            <span class="material-icons-round align-middle fs-6 me-1">add_shopping_cart</span> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initData();
    checkAuth();
    renderFeaturedProducts();
});
