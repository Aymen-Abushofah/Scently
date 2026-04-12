// Global Functions
window.selectPayment = function(element, type) {
    // Remove active class from all
    document.querySelectorAll('.payment-card').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Toggle card form
    const cardForm = document.getElementById('credit-card-form');
    if (type === 'cod') {
        cardForm.style.display = 'none';
        ScentlyNotifs.show('تم اختيار الدفع عند الاستلام 💵', 'success');
    } else {
        cardForm.style.display = 'block';
        ScentlyNotifs.show('تم اختيار الدفع بالبطاقة 💳', 'success');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // For design review purposes: If the cart is empty, mock an item so the user can see the layout.
    if (!window.CartManager || window.CartManager.getCart().length === 0) {
        // We do not redirect, instead we mock an item
        if (window.CartManager) {
            window.CartManager.addToCart({
                id: 'mock-item',
                name: 'عطر كوردون بلو (تجربة)',
                price: 150,
                image: 'images/perfumes/unisex/Cordon Bleu.png',
                category: 'للجنسين',
                quantity: 1
            });
        }
    }

    renderSummary();

    function renderSummary() {
        const cart = window.CartManager.getCart();
        const total = window.CartManager.getCartTotal();
        
        const itemsList = document.getElementById('checkout-items-list');
        itemsList.innerHTML = '';
        
        cart.forEach(item => {
            const line = document.createElement('div');
            line.style.display = 'flex';
            line.style.justifyContent = 'space-between';
            line.style.marginBottom = '8px';
            line.innerHTML = `<span>${item.quantity}x ${item.name}</span> <span>$${item.price * item.quantity}</span>`;
            itemsList.appendChild(line);
        });

        document.getElementById('subtotal-price').textContent = `$${total}`;
        
        const shippingNode = document.getElementById('shipping-price');
        let shipping = 0;
        if (total > 200) {
            shippingNode.textContent = 'مجاناً';
        } else {
            shipping = 15;
            shippingNode.textContent = `$${shipping}`;
        }

        const grandTotal = total + shipping;
        document.getElementById('total-price').textContent = `$${grandTotal}`;
    }

    // Place Order Flow
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.addEventListener('click', () => {
        // Minimal fake validation
        const email = document.getElementById('checkout-email').value;
        if (!email) {
            ScentlyNotifs.show('الرجاء إدخال البريد الإلكتروني لإتمام الطلب', 'warning');
            document.getElementById('checkout-email').focus();
            document.getElementById('checkout-email').style.borderColor = '#FFC107';
            setTimeout(() => document.getElementById('checkout-email').style.borderColor = '', 3000);
            return;
        }
        
        // Setup loading state
        placeOrderBtn.innerHTML = `
            <svg viewBox="0 0 50 50" width="20" height="20" style="animation: spin 1s linear infinite;">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="31.4 31.4" stroke-dashoffset="0"></circle>
            </svg>
            جاري المعالجة...
        `;
        placeOrderBtn.style.opacity = '0.8';
        placeOrderBtn.style.pointerEvents = 'none';

        // Simulate network delay
        setTimeout(() => {
            // Generate fake Order ID
            document.getElementById('order-id').textContent = '#' + Math.floor(100000 + Math.random() * 900000);
            
            // Empty the cart
            window.CartManager.saveCart([]);

            // Show success overlay
            document.getElementById('checkout-main-container').style.display = 'none';
            const overlay = document.getElementById('success-overlay');
            overlay.style.display = 'flex';
        }, 1500);
    });
});

// A quick helper to spin the loader
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
