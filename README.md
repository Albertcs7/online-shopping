# MyCart - Online Shopping Website

A complete, responsive Online Shopping Website built with Bootstrap 5, Material Design components, and JavaScript.

## Project Structure

```
online-shopping-site/
├── index.html          # Home page with featured categories
├── login.html          # User/Admin login page
├── register.html       # User registration page
├── products.html       # Product listing with filtering
├── add-product.html    # Admin: Add new product
├── edit-product.html   # Admin: Edit existing product
├── cart.html           # Shopping cart page
├── css/
│   └── styles.css      # Custom styles and variables
├── js/
│   ├── main.js         # Global logic, data seeding, auth check
│   ├── auth.js         # Login and registration logic
│   ├── product.js      # Product CRUD and rendering logic
│   └── cart.js         # Cart management logic
└── images/             # Product images
    ├── smartphone.png
    ├── jacket.png
    ├── chair.png
    ├── headphones.png
    ├── watch.png
    ├── shoes.png
    └── coffee.png
```

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop.
- **Authentication**: User and Admin roles.
- **Product Management**: Admin can Create, Read, Update, and Delete products.
- **Shopping Cart**: Users can add items, update quantities, and remove items.
- **Category Filtering**: Filter products by category from the Home page.
- **Data Persistence**: Uses `LocalStorage` to save data in the browser.

## How to Run

1.  Open the project folder.
2.  Double-click `index.html` to open it in your web browser.
3.  **Login Credentials**:
    - **Admin**: Email: `admin@shopeasy.com`, Password: `admin`
    - **User**: Email: `user@shopeasy.com`, Password: `user`
    - Or register a new account!

## Technologies Used

- HTML5
- Bootstrap 5
- JavaScript (Vanilla)
- LocalStorage
- Google Fonts (Inter)
- Material Icons
