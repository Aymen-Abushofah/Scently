document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const layoutContainer = document.getElementById('cart-layout');
    const emptyState = document.getElementById('empty-cart-state');

    function renderCart() {
        if (!window.CartManager) return;
        
        const cart = window.CartManager.getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            layoutContainer.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        } else {
            layoutContainer.style.display = 'flex';
            emptyState.style.display = 'none';
        }

        cart.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.style.animationDelay = `${index * 0.1}s`;
            row.innerHTML = `
                <div class="item-img-container">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-category">${item.category}</p>
                    <p class="item-price">$${item.price}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                    </div>
                    <p class="item-subtotal">$${item.price * item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.id}')" title="إزالة">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            `;
            cartItemsContainer.appendChild(row);
        });

        updateSummary();
    }

    function updateSummary() {
        const total = window.CartManager.getCartTotal();
        document.getElementById('subtotal-price').textContent = `$${total}`;
        
        // Let's add $15 shipping if total < 200, else free
        const shipping = total > 200 ? 0 : 15;
        const grandTotal = total === 0 ? 0 : total + shipping;

        document.getElementById('total-price').textContent = `$${grandTotal}`;
        
        const shippingText = document.querySelectorAll('.summary-line')[1].querySelectorAll('span')[1];
        if (total === 0) {
            shippingText.textContent = '-';
        } else {
            shippingText.textContent = shipping === 0 ? 'مجاناً (فوق 200$)' : `$${shipping}`;
        }
    }

    window.updateQty = function(id, delta) {
        window.CartManager.updateQuantity(id, delta);
        renderCart();
    };

    window.removeItem = function(id) {
        window.CartManager.removeFromCart(id);
        renderCart();
    };

    // Listen to global changes
    window.addEventListener('cartUpdated', renderCart);

    // --- Promo code handling ---
    const promoBtn = document.getElementById('apply-promo');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => {
            const input = document.getElementById('promo-input');
            const code = input.value.trim();
            if (!code) {
                ScentlyNotifs.show('\u0627\u0644\u0631\u062c\u0627\u0621 \u0625\u062f\u062e\u0627\u0644 \u0643\u0648\u062f \u0627\u0644\u062e\u0635\u0645', 'warning');
                return;
            }
            // Demo: no real codes, just show feedback
            ScentlyNotifs.show(`\u0627\u0644\u0643\u0648\u062f "${code}" \u063a\u064a\u0631 \u0635\u0627\u0644\u062d \u0623\u0648 \u0645\u0646\u062a\u0647\u064a \u0627\u0644\u0635\u0644\u0627\u062d\u064a\u0629`, 'error');
            input.value = '';
        });
    }

    // Initial render
    renderCart();
});
