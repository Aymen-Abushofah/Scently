document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the fragrance ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let fragranceId = urlParams.get('id');

    // 2. Fetch the corresponding data
    const data = window.fragrancesData;
    
    // If no ID or invalid ID, redirect to home or show error
    if (!fragranceId || !data[fragranceId]) {
        // Fallback for demo: show althair if no id provided
        if (data['althair']) {
            fragranceId = 'althair';
        } else {
            document.body.innerHTML = '<h1>Fragrance not found.</h1><a href="index.html">Go back</a>';
            return;
        }
    }

    const frag = data[fragranceId];

    // --- PAGE META ---
    document.title = frag.Title;

    // --- TITLE & CATEGORY ---
    document.getElementById('fragrance-title').textContent = frag.Title;
    document.getElementById('fragrance-category').textContent = frag.Category;

    // --- IMAGES & LOGOS ---
    document.getElementById('fragrance-image').src = frag.Image;
    if (frag.BrandLogo) {
        document.getElementById('brand-logo').src = frag.BrandLogo;
    }

    // --- RATING ---
    document.getElementById('rating-score').textContent = frag.RatingScore || '';
    document.getElementById('rating-stars').textContent = frag.RatingStars || '';
    document.getElementById('rating-count').textContent = frag.RatingCount || '';

    // --- MAIN NOTES SLIDERS ---
    const mainNotesContainer = document.getElementById('main-notes-grid');
    mainNotesContainer.innerHTML = '';
    if (frag.MainNotes && frag.MainNotes.length > 0) {
        frag.MainNotes.forEach(note => {
            const template = `
                <div class="note-slider" style="--percentage: ${note.Percentage}; --color: ${note.Color};">
                    <div class="slider-track">
                        <div class="slider-fill">
                            <span class="note-name">${note.Name}</span>
                        </div>
                    </div>
                </div>
            `;
            mainNotesContainer.insertAdjacentHTML('beforeend', template);
        });
    }

    // --- OCCASIONS ---
    const occasionsContainer = document.getElementById('occasions-container');
    occasionsContainer.innerHTML = '';
    const occasionOrder = ['winter', 'spring', 'summer', 'autumn', 'day', 'night'];
    const occasionIcons = {
        'winter': 'icons/winter.png',
        'spring': 'icons/spring.png',
        'summer': 'icons/summer.png',
        'autumn': 'icons/autumn.png',
        'day': 'icons/day.png',
        'night': 'icons/night.png'
    };
    
    if (frag.Occasions) {
        occasionOrder.forEach(key => {
            const occ = frag.Occasions[key];
            if (occ) {
                const template = `
                <div class="occasion-item">
                    <div class="icon-wrapper ${occ.Level}"><img src="${occasionIcons[key]}" alt="${occ.Name}"></div>
                    <span>${occ.Name}</span>
                </div>
                `;
                occasionsContainer.insertAdjacentHTML('beforeend', template);
            }
        });
    }

    // --- PERFORMANCE ---
    const perfContainer = document.getElementById('performance-container');
    perfContainer.innerHTML = '';
    if (frag.Performance && frag.Performance.length > 0) {
        frag.Performance.forEach(perf => {
             const template = `
             <div class="performance-item">
                <div class="circular-progress" style="--value: ${perf.Value}; --color: ${perf.Color};">
                    <span class="progress-value">${perf.ProgressText}</span>
                </div>
                <span class="performance-label">${perf.Label}</span>
            </div>
             `;
             perfContainer.insertAdjacentHTML('beforeend', template);
        });
    }

    // --- DESCRIPTION ---
    const descContent = document.getElementById('description-content');
    descContent.innerHTML = `<p class="intro-paragraph">${frag.Description}</p>`;

    // --- META INFO (Perfumer details) ---
    const metaContainer = document.getElementById('perfumer-details');
    metaContainer.innerHTML = '';
    if (frag.Meta && frag.Meta.length > 0) {
        frag.Meta.forEach(meta => {
            const template = `
            <div class="meta-item">
                <strong>${meta.Label}:</strong>
                <span>${meta.Value}</span>
            </div>
            `;
            metaContainer.insertAdjacentHTML('beforeend', template);
        });
    }

    // --- NOTES HIERARCHY ---
    const notesBreakdown = document.getElementById('notes-breakdown');
    notesBreakdown.innerHTML = '';
    if (frag.NotesHierarchy) {
        // usually keys are "مقدمة العطر (Top Notes)", "قلب العطر (Heart Notes)", "قاعدة العطر (Base Notes)"
        // But we just render them in the order they are present (or we can enforce order)
        const order = ['مقدمة العطر (Top Notes)', 'قلب العطر (Heart Notes)', 'قاعدة العطر (Base Notes)'];
        
        order.forEach(groupName => {
            if (frag.NotesHierarchy[groupName]) {
                const notes = frag.NotesHierarchy[groupName];
                let notesHtml = '';
                notes.forEach(note => {
                    notesHtml += `
                    <div class="note-item">
                        <div class="note-image-container">
                            <img src="${note.Image}" alt="${note.Name}">
                        </div>
                        <span>${note.Name}</span>
                    </div>
                    `;
                });

                const groupTemplate = `
                <div class="notes-group">
                    <h3>${groupName}</h3>
                    <div class="notes-grid">
                        ${notesHtml}
                    </div>
                </div>
                `;
                notesBreakdown.insertAdjacentHTML('beforeend', groupTemplate);
            }
        });
    }

    // --- DUPES ---
    const dupesSection = document.getElementById('dupes-section');
    const dupesGrid = document.getElementById('dupes-grid');
    if (dupesGrid) {
        dupesGrid.innerHTML = '';
        if (frag.Dupes && frag.Dupes.length > 0) {
            dupesSection.style.display = 'block';
            frag.Dupes.forEach(dupe => {
                // Try deriving ID from URL
                let dupeId = dupe.Url.replace('.html', '').replace(/ /g, '-').toLowerCase();
                const template = `
                <div class="dupe-card" onclick="window.location.href='fragrance.html?id=${dupeId}'">
                    <div class="dupe-image-container">
                        <img src="${dupe.Image}" alt="${dupe.Name}">
                    </div>
                    <div class="dupe-info">
                        <h4 class="dupe-name">${dupe.Name}</h4>
                        <p class="dupe-brand">${dupe.Brand}</p>
                    </div>
                </div>
                `;
                dupesGrid.insertAdjacentHTML('beforeend', template);
            });
        } else {
            dupesSection.style.display = 'none'; // hide if no dupes
        }
    }

    // --- E-COMMERCE LOGIC ---
    if(window.CartManager) {
        const price = window.CartManager.getPrice(fragranceId);
        document.getElementById('fragrance-price').textContent = price;

        const cartItem = {
            id: fragranceId,
            name: frag.Title,
            price: price,
            image: frag.Image,
            category: frag.Category
        };

        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if(addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                CartManager.addToCart(cartItem);
                addToCartBtn.textContent = 'تمت الإضافة بنجاح ✓';
                addToCartBtn.style.backgroundColor = '#4CAF50';
                addToCartBtn.style.color = '#fff';
                setTimeout(() => {
                    addToCartBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> إضافة للسلة`;
                    addToCartBtn.style.backgroundColor = '';
                    addToCartBtn.style.color = '';
                }, 2000);
            });
        }

        const buyNowBtn = document.getElementById('buy-now-btn');
        if(buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                CartManager.addToCart(cartItem);
                window.location.href = 'checkout.html';
            });
        }

        const wishlistCheckbox = document.getElementById('wishlist-checkbox');
        if(wishlistCheckbox) {
            wishlistCheckbox.checked = CartManager.isInWishlist(fragranceId);
            wishlistCheckbox.addEventListener('change', () => {
                CartManager.toggleWishlist(cartItem);
            });
        }
    }
});
