document.addEventListener('DOMContentLoaded', () => {
    const favGrid = document.getElementById('fav-grid');
    const emptyState = document.getElementById('empty-fav-state');
    const countText = document.getElementById('fav-count-text');

    function renderFavourites() {
        if (!window.CartManager) return;

        const wishlist = window.CartManager.getWishlist();
        favGrid.innerHTML = '';

        if (wishlist.length === 0) {
            favGrid.style.display = 'none';
            emptyState.style.display = 'flex';
            countText.textContent = '0 عطور محفوظة';
            return;
        }

        favGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        countText.textContent = `${wishlist.length} عطور محفوظة`;

        wishlist.forEach((item, index) => {
            const price = item.price || CartManager.getPrice(item.id);
            const card = document.createElement('div');
            card.className = 'fav-card';
            card.style.animationDelay = `${index * 0.08}s`;

            card.innerHTML = `
                <div class="fav-card-image" onclick="window.location.href='fragrance.html?id=${item.id}'">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="fav-card-body">
                    <h3 class="fav-card-name" onclick="window.location.href='fragrance.html?id=${item.id}'">${item.name}</h3>
                    <p class="fav-card-category">${item.category || ''}</p>
                    <p class="fav-card-price">$${price}</p>
                    <div class="fav-card-actions">
                        <button class="fav-action-btn fav-add-cart" data-id="${item.id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            إضافة للسلة
                        </button>
                        <button class="fav-action-btn fav-remove" data-id="${item.id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            إزالة
                        </button>
                    </div>
                </div>
            `;
            favGrid.appendChild(card);
        });

        // Bind add-to-cart buttons
        document.querySelectorAll('.fav-add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = wishlist.find(i => i.id === id);
                if (item) {
                    CartManager.addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price || CartManager.getPrice(item.id),
                        image: item.image,
                        category: item.category
                    });
                }
            });
        });

        // Bind remove buttons
        document.querySelectorAll('.fav-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = wishlist.find(i => i.id === id);
                if (item) {
                    CartManager.toggleWishlist(item);
                    renderFavourites();
                }
            });
        });
    }

    renderFavourites();
});
