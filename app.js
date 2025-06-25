function renderCheckout() {
    const $checkout = $('#checkout-wrapper');
    $checkout.empty();

    if (cart.length === 0) {
        $checkout.html('<p>🛒 購物車為空，無法進行結帳。</p>');
        showWrapper('checkout');
        return;
    }

    let total = 0;
    let checkoutItemsHtml = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        return `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}" class="cart-thumb">
                <div>
                    <h4>${item.name}</h4>
                    <p>尺寸: ${item.size}　顏色: ${item.color}</p>
                    <p>數量: ${item.quantity}</p>
                    <p>小計: $${subtotal.toLocaleString()}</p>
                </div>
            </div>
        `;
    }).join('');

    const checkoutHtml = `
        <h2>確認您的訂單</h2>
        <div class="checkout-items">${checkoutItemsHtml}</div>
        <p><strong>總金額: </strong> $${total.toLocaleString()}</p>

        <form id="checkout-form">
            <label for="delivery-method">取貨方式:</label>
            <select id="delivery-method" required>
                <option value="">請選擇</option>
                <option value="7-11">7-11 Store</option>
                <option value="physical">Physical Shop</option>
            </select><br>

            <label for="recipient-name">收件人姓名:</label>
            <input type="text" id="recipient-name" required><br>

            <label for="email">Email:</label>
            <input type="email" id="email" required><br>

            <label for="phone">電話:</label>
            <input type="tel" id="phone" pattern="^09\\d{8}$" placeholder="例如: 0912345678" required><br>

            <label for="payment-method">付款方式:</label>
            <select id="payment-method" required>
                <option value="">請選擇</option>
                <option value="cod">到店付款</option>
                <option value="ecpay">Credit Card (Via ECPay)</option>
            </select><br><br>

            <button type="submit" id="confirm-order-btn" disabled>✅ 確認下單</button>
            <button type="button" id="back-to-cart-btn">返回購物車</button>
        </form>
    `;

    $checkout.html(checkoutHtml);
    showWrapper('checkout');

    // Enable button only if form is valid
    $('#checkout-form input, #checkout-form select').on('input change', validateForm);

    function validateForm() {
        const allFilled = [...$('#checkout-form')[0].elements].every(el =>
            (el.type !== 'submit' && el.type !== 'button') ? el.checkValidity() : true
        );
        $('#confirm-order-btn').prop('disabled', !allFilled);
    }

    // Handle confirm order
    $('#checkout-form').on('submit', function (e) {
        e.preventDefault();

        const orderDetails = {
            deliveryMethod: $('#delivery-method').val(),
            recipientName: $('#recipient-name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            paymentMethod: $('#payment-method').val(),
            cart,
            total
        };

        console.log('Order submitted:', orderDetails);

        Swal.fire({
            icon: 'success',
            title: '下單成功！',
            text: '我們已收到您的訂單。',
        });

        cart = [];
        saveCart();
        updateCartDisplay();
        showWrapper('showroom');
    });

    // Back to cart
    $('#back-to-cart-btn').on('click', function () {
        $('#side-cart').addClass('active');
        showWrapper('content');
    });
}
