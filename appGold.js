$(document).ready(function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    function updateCartDisplay() {
        const $cartItems = $('#side-cart-items');
        const $cartTotal = $('#cart-total');
        $cartItems.empty();
        
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const cartItemHtml = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-thumb">
                    <div class="cart-info">
                        <h5>${item.name}</h5>
                        <p>Size: ${item.size}, Color: ${item.color}</p>
                        <p>Qty: ${item.quantity}</p>
                        <p>$${subtotal.toLocaleString()}</p>
                    </div>
                </div>
            `;
            $cartItems.append(cartItemHtml);
        });

        $cartTotal.text(`$${total.toLocaleString()}`);
        $('#side-cart').addClass('active');
    }
    // Get references to the different content wrappers and nav links
    const wrappers = {
        showroom: $('#showroom-wrapper'),
        content: $('#content-wrapper'),
        item: $('#item-wrapper'),
        checkout: $('#checkout-wrapper')
    };
    const navLinks = {
        product: $('#nav-product'),
        about: $('#nav-about'),
        member: $('#nav-member'),
        contact: $('#nav-contact')
    };
    const containers = {
        showroom: $('#showroom-wrapper'),
        productGrid: $('.product-grid'),
        itemDetail: $('#item-wrapper'),
        about: $('#about-container'),
    };

    // --- VIEW MANAGEMENT --- //
    
    // Function to show a specific wrapper and hide others
    function showWrapper(wrapperId) {
        // Hide all wrappers
        for (const key in wrappers) {
            wrappers[key].removeClass('active');
        }
        // Show the target wrapper
        if (wrappers[wrapperId]) {
            wrappers[wrapperId].addClass('active');
        }
    }

    // --- DATA RENDERING FUNCTIONS --- //

    // 1. Render Showroom
    async function renderShowroom() {
        try {
            const response = await fetch('showroom.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const showroomItems = await response.json();

            containers.showroom.empty(); // Clear previous content
            
            const showroomGrid = $('<div class="showroom-grid"></div>');
            showroomItems.forEach(item => {
                const showroomCard = `
                    <div class="showroom-card" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <h3>${item.name}</h3>
                    </div>
                `;
                showroomGrid.append(showroomCard);
            });
            containers.showroom.append(showroomGrid);
            showWrapper('showroom');
        } catch (error) {
            console.error("Failed to load showroom:", error);
            containers.showroom.html('<p>Error loading showroom. Please try again later.</p>');
        }
    }

    // 2. Render All Products
    async function renderProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            
            containers.productGrid.empty(); // Clear previous content
            
            products.forEach(product => {
                const productCard = `
                    <div class="product-card" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toLocaleString()}</p>
                    </div>
                `;
                containers.productGrid.append(productCard);
            });
            // Also ensure the product section within the content wrapper is visible
            $('#product-container').show();
            $('#about-container').hide();
            showWrapper('showroom');
        } catch (error) {
            console.error("Failed to load products:", error);
            containers.productGrid.html('<p>Error loading products. Please try again later.</p>');
        }
    }
    
    // 3. Render a single Item's Details

async function renderItemDetail(itemId) {
    try {
        const response = await fetch('items.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const items = await response.json();
        const item = items[itemId];

        if (!item) {
            console.error("Item not found:", itemId);
            containers.itemDetail.html('<p>Sorry, this item could not be found.</p>');
            showWrapper('item');
            return;
        }

        const itemHtml = `
            <div class="item-detail-container">
                <div class="item-image-column">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-info-column">
                    <button class="close-detail-btn">✖</button>
                    <h2>${item.name}</h2>
                    <p class="item-price">$${item.price.toLocaleString()}</p>
                    <p class="item-description">${item.description}</p>
                    <div class="item-options">
                        <label for="size-select">Size:</label>
                        <select id="size-select">
                            ${item.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                        <label for="color-select">Color:</label>
                        <select id="color-select">
                            ${item.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                        </select>
                    </div>
                    <p class="item-specs"><strong>Details:</strong> ${item.specs}</p>
                    <button class="add-to-cart-btn" data-id="${itemId}">Add to Cart</button>
                </div>
            </div>
        `;

        containers.itemDetail.html(itemHtml);
        showWrapper('item');

        // Close detail view
        $('.close-detail-btn').on('click', function () {
            console.log('I am CLOSE button in itemWrapper!');
            showWrapper('showroom');
        });

        // Add to cart
        $('.add-to-cart-btn').on('click', function () {
            const selectedSize = $('#size-select').val();
            const selectedColor = $('#color-select').val();
            const quantity = 1;
            addToCart({
                id: itemId,
                name: item.name,
                image: item.image,
                price: item.price,
                size: selectedSize,
                color: selectedColor,
                quantity
            });
        });

    } catch (error) {
        console.error("Failed to load item details:", error);
        containers.itemDetail.html('<p>Error loading item details. Please try again later.</p>');
    }
}
    
// --- Cart Logic ---
function addToCart(newItem) {
    const existing = cart.find(
        i => i.id === newItem.id && i.size === newItem.size && i.color === newItem.color
    );
    if (existing) {
        existing.quantity += newItem.quantity;
    } else {
        cart.push(newItem);
    }

    saveCart();
    updateCartDisplay();
    $('#side-cart').addClass('active'); // 👈 This ensures the cart opens immediately
}
function updateCartDisplay() {
    const $cartItems = $('#side-cart-items');
    const $cartTotal = $('#cart-total');
    $cartItems.empty();

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const cartItemHtml = `
            <div class="side-cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="cart-thumb">
                <div class="cart-info">
                    <h5>${item.name}</h5>
                    <p>Size: ${item.size}, Color: ${item.color}</p>
                    <label>Qty:
                        <input type="number" class="qty-input" value="${item.quantity}" min="1">
                    </label>
                    <p>$${subtotal.toLocaleString()}</p>
                    <button class="delete-cart-item">🗑 Remove</button>
                </div>
            </div>
        `;
        $cartItems.append(cartItemHtml);
    });

    $cartTotal.text(`$${total.toLocaleString()}`);
    $('#side-cart').addClass('open');
    saveCart();
}

    // --- EVENT LISTENERS --- //
//Close button of side-cart
   $('#close-cart-btn').on('click', function () {
    $('#side-cart').removeClass('open');
});
   // Increase quantity
$('#side-cart-items').on('click', '.qty-increase', function () {
    const index = $(this).closest('.cart-item').data('index');
    cart[index].quantity += 1;
    saveCart();
    updateCartDisplay();
});

// Decrease quantity
$('#side-cart-items').on('click', '.qty-decrease', function () {
    const index = $(this).closest('.cart-item').data('index');
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1); // Remove if goes below 1
    }
    saveCart();
    updateCartDisplay();
});

// Delete item
$('#side-cart-items').on('click', '.delete-cart-item', function () {
    const index = $(this).closest('.cart-item').data('index');
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
});
    // Navigation link clicks
    navLinks.product.on('click', function(e) {
        e.preventDefault();
        renderProducts();
    });
    
    navLinks.about.on('click', function(e) {
        e.preventDefault();
        // Example: Show the about container
        $('#product-container').hide();
        containers.about.html('<h2>About EDGE</h2><p>This is the story of our brand...</p>').show();
        showWrapper('content');
    });

    // Delegated click listener for dynamically created items
    // Listens on a static parent element for clicks on children matching the selector
    $('main').on('click', '.showroom-card, .product-card', function() {
        const itemId = $(this).data('id');
        if (itemId) {
            renderItemDetail(itemId);
        }
    });
    
    // Logo click to go back to showroom
    $('.logo').on('click', function() {
        renderShowroom();
    });


    // --- INITIALIZATION --- //

    // Load the initial showroom view when the page loads
    renderShowroom();

});