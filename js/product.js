/**
 * ShopEasy - Product JavaScript
 * Handles product CRUD and rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const addProductForm = document.getElementById('add-product-form');
    const editProductForm = document.getElementById('edit-product-form');
    const btnAddProduct = document.getElementById('btn-add-product');

    // Show Add Product button for Admin
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (currentUser && currentUser.role === 'admin' && btnAddProduct) {
        btnAddProduct.classList.remove('d-none');
    }

    if (productsContainer) {
        renderProducts();
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', handleUpdateProduct);
    }
});

function renderProducts() {
    let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const container = document.getElementById('products-container');
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const isAdmin = currentUser && currentUser.role === 'admin';

    // Filter by category if present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        products = products.filter(p => p.category === category);
        // Update title to show filtered category
        const title = document.querySelector('h2.fw-bold');
        if (title) title.textContent = `${category} Products`;
    }

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">No products found in this category.</h4></div>';
        return;
    }

    container.innerHTML = products.map(product => `
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
                        ${isAdmin ? `
                            <div class="d-grid gap-2">
                                <a href="edit-product.html?id=${product.id}" class="btn btn-outline-primary btn-sm rounded-pill">Edit</a>
                                <button onclick="deleteProduct(${product.id})" class="btn btn-outline-danger btn-sm rounded-pill">Delete</button>
                            </div>
                        ` : `
                            <button onclick="addToCart(${product.id})" class="btn btn-primary w-100 rounded-pill shadow-sm">
                                <span class="material-icons-round align-middle fs-6 me-1">add_shopping_cart</span> Add to Cart
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function handleAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;

    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        category,
        image,
        description
    };

    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.location.href = 'products.html';
}

function loadProductForEdit(id) {
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const product = products.find(p => p.id == id);

    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('image').value = product.image;
        document.getElementById('description').value = product.description;
    }
}

function handleUpdateProduct(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;

    let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const index = products.findIndex(p => p.id == id);

    if (index !== -1) {
        products[index] = {
            ...products[index],
            name,
            price: parseFloat(price),
            category,
            image,
            description
        };
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        window.location.href = 'products.html';
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
        products = products.filter(p => p.id != id);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        renderProducts();
    }
}
