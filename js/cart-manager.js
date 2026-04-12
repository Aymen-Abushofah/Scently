/* =========================================================
   GLOBAL TOAST NOTIFICATION SYSTEM
   ========================================================= */
window.ScentlyNotifs = {
    _containerReady: false,
    _ensureContainer() {
        if (this._containerReady) return document.getElementById('scently-toast-container');
        const container = document.createElement('div');
        container.id = 'scently-toast-container';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            #scently-toast-container {
                position: fixed; bottom: 30px; left: 30px; z-index: 99999;
                display: flex; flex-direction: column-reverse; gap: 12px;
                pointer-events: none;
            }
            .scently-toast {
                pointer-events: auto;
                display: flex; align-items: center; gap: 12px;
                background: rgba(2, 16, 36, 0.92); backdrop-filter: blur(14px);
                border: 1px solid rgba(125, 160, 202, 0.35); color: #fff;
                padding: 16px 24px; border-radius: 14px; min-width: 280px;
                box-shadow: 0 12px 35px rgba(0,0,0,0.5), 0 0 15px rgba(125,160,202,0.15);
                font-family: 'Rubik', sans-serif; font-size: 0.95rem;
                transform: translateX(-120%); opacity: 0;
                transition: transform 0.4s cubic-bezier(0.68, -0.35, 0.265, 1.55), opacity 0.4s ease;
            }
            .scently-toast.show { transform: translateX(0); opacity: 1; }
            .scently-toast.hide { transform: translateX(-120%); opacity: 0; }
            .scently-toast .toast-icon { flex-shrink: 0; display: flex; }
            .scently-toast.success .toast-icon { color: #4CAF50; }
            .scently-toast.error .toast-icon { color: #F44336; }
            .scently-toast.info .toast-icon { color: #C1E8FF; }
            .scently-toast.warning .toast-icon { color: #FFC107; }
            .scently-toast .toast-msg { flex: 1; line-height: 1.4; }
            .scently-toast .toast-close {
                background: none; border: none; color: rgba(255,255,255,0.4);
                cursor: pointer; padding: 4px; transition: color 0.2s;
            }
            .scently-toast .toast-close:hover { color: #fff; }
            @media (max-width: 768px) {
                #scently-toast-container { left: 15px; right: 15px; bottom: 20px; }
                .scently-toast { min-width: unset; transform: translateY(120%); }
                .scently-toast.show { transform: translateY(0); }
                .scently-toast.hide { transform: translateY(120%); }
            }
        `;
        document.head.appendChild(style);
        this._containerReady = true;
        return container;
    },

    show(message, type = 'success', duration = 3500) {
        const container = this._ensureContainer();
        const toast = document.createElement('div');
        toast.className = `scently-toast ${type}`;

        const icons = {
            success: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
            warning: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-msg">${message}</span>
            <button class="toast-close" onclick="this.parentElement.classList.replace('show','hide');setTimeout(()=>this.parentElement.remove(),400)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;
        container.appendChild(toast);

        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

        const timer = setTimeout(() => {
            toast.classList.replace('show', 'hide');
            setTimeout(() => toast.remove(), 400);
        }, duration);

        // Pause on hover
        toast.addEventListener('mouseenter', () => clearTimeout(timer));
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => {
                toast.classList.replace('show', 'hide');
                setTimeout(() => toast.remove(), 400);
            }, 1500);
        });
    }
};

/* =========================================================
   CART MANAGER
   Handles LocalStorage logic, Cart UI updates, and Prices
   ========================================================= */

const CartManager = {
    // 1. Storage Keys
    CART_KEY: 'scently_cart',
    WISHLIST_KEY: 'scently_wishlist',

    // 2. Initialize
    init() {
        if (!localStorage.getItem(this.CART_KEY)) {
            localStorage.setItem(this.CART_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.WISHLIST_KEY)) {
            localStorage.setItem(this.WISHLIST_KEY, JSON.stringify([]));
        }
        this.updateCartIconCount();
    },

    // 3. Price Generation (Deterministic pseudo-random based on id)
    getPrice(id) {
        if (!id) return 120;
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt(i);
        }
        // Price between $80 and $250
        return (sum % 170) + 80;
    },

    // 4. Cart Methods
    getCart() {
        return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    },

    saveCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        this.updateCartIconCount();
    },

    addToCart(item) {
        let cart = this.getCart();
        let existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            item.quantity = item.quantity || 1;
            // Retrieve dynamic price if not supplied
            if (!item.price) item.price = this.getPrice(item.id);
            cart.push(item);
        }
        this.saveCart(cart);

        // Toast notification
        if (item.id !== 'mock-item') {
            ScentlyNotifs.show(`تمت إضافة "${item.name}" إلى السلة 🛒`, 'success');
        }

        // Broadcast custom event for other scripts to react
        window.dispatchEvent(new Event('cartUpdated'));
    },

    updateQuantity(id, delta) {
        let cart = this.getCart();
        let existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity += delta;
            if (existing.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            this.saveCart(cart);
            window.dispatchEvent(new Event('cartUpdated'));
        }
    },

    removeFromCart(id) {
        let cart = this.getCart();
        const removed = cart.find(i => i.id === id);
        cart = cart.filter(i => i.id !== id);
        this.saveCart(cart);
        if (removed) {
            ScentlyNotifs.show(`تم إزالة "${removed.name}" من السلة`, 'error');
        }
        window.dispatchEvent(new Event('cartUpdated'));
    },

    getCartTotal() {
        let cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getCartCount() {
        let cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    // 5. Wishlist Methods
    getWishlist() {
        return JSON.parse(localStorage.getItem(this.WISHLIST_KEY)) || [];
    },

    toggleWishlist(item) {
        let list = this.getWishlist();
        let existing = list.find(i => i.id === item.id);
        let added = false;
        if (existing) {
            list = list.filter(i => i.id !== item.id);
            ScentlyNotifs.show(`تم إزالة "${item.name}" من المفضلة`, 'error');
        } else {
            list.push(item);
            added = true;
            ScentlyNotifs.show(`تمت إضافة "${item.name}" للمفضلة ❤️`, 'info');
        }
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(list));
        return added;
    },

    isInWishlist(id) {
        return this.getWishlist().some(i => i.id === id);
    },

    // 6. UI Updates
    updateCartIconCount() {
        const counts = document.querySelectorAll('.cart-badge-count');
        const count = this.getCartCount();
        counts.forEach(c => {
            c.textContent = count;
            if (count > 0) {
                c.style.display = 'flex';
            } else {
                c.style.display = 'none';
            }
        });
    }
};

// Initialize automatically
CartManager.init();
window.CartManager = CartManager;
