/* =========================================================
   GLOBAL SCRIPT
   Runs only after the DOM is fully loaded
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       ELEMENT SELECTORS
       Cache all frequently-used DOM elements
       ===================================================== */

    const searchBar = document.getElementById('search-bar');
    const fragranceDisplay = document.getElementById('fragrance-display');

    // All fragrance cards inside the grid
    const allCards = Array.from(
        fragranceDisplay.querySelectorAll('.fragrance-card')
    );

    // Section headers (e.g. Men, Women, Unisex...)
    const allHeaders = Array.from(
        fragranceDisplay.querySelectorAll('.section-header')
    );

    // Message shown when no results are found
    const noResultsMessage = document.getElementById('no-results-message');


    /* =====================================================
       INITIALIZE CARD CATEGORIES
       Tag each card with its corresponding section ID
       ===================================================== */
    allHeaders.forEach(header => {
        const categoryId = header.id; // e.g., "men", "women", "unisex"
        let nextElement = header.nextElementSibling;
        
        while (nextElement && !nextElement.classList.contains('section-header')) {
            if (nextElement.classList.contains('fragrance-card')) {
                nextElement.dataset.category = categoryId;
            }
            nextElement = nextElement.nextElementSibling;
        }
    });

    // Dynamically inject actual prices into the HTML cards
    allCards.forEach(card => {
        const onclickAttr = card.getAttribute('onclick');
        if (onclickAttr && window.CartManager) {
            const match = onclickAttr.match(/id=([^']+)/);
            if (match && match[1]) {
                const price = window.CartManager.getPrice(match[1]);
                const priceElement = card.querySelector('.fragrance-price');
                if (priceElement) {
                    priceElement.textContent = '$' + price;
                }
            }
        }
    });

    let currentVisibleCategory = 'all'; 


    /* =====================================================
       DROPDOWN MENU LOGIC
       Handles opening / closing of the filter dropdown
       ===================================================== */

    const dropdown = document.querySelector('.dropdown');
    let dropdownMenu;
    
    if (dropdown) {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown visibility when clicking the toggle button
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevents immediate close by window click
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when any option inside is clicked
        dropdownMenu.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    }

    // Close dropdown when clicking anywhere else on the page
    window.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });


    /* =====================================================
       FILTER BUTTONS LOGIC
       Handles filter clicks
       ===================================================== */
    const filterAnchors = document.querySelectorAll('.filter-anchor');

    filterAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = anchor.getAttribute('data-filter');
            if (!filterValue) return;

            currentVisibleCategory = filterValue;

            // Update active states
            filterAnchors.forEach(a => a.classList.remove('active'));
            // Keep both desktop and mobile version active
            document.querySelectorAll(`.filter-anchor[data-filter="${filterValue}"]`).forEach(a => a.classList.add('active'));

            // Re-trigger the filter to apply the search term + category
            applyFilters();
        });
    });


    /* =====================================================
       SEARCH LOGIC
       Triggers filter application
       ===================================================== */

    searchBar.addEventListener('input', () => {
        applyFilters();
    });

    let animationTimeouts = [];

    function applyFilters() {
        // 1. Clear any running stagger animations to avoid conflict
        animationTimeouts.forEach(clearTimeout);
        animationTimeouts = [];

        const searchTerm = searchBar.value.toLowerCase().trim();
        let visibleCardCount = 0;
        let cardsThatWillBeVisible = [];

        // 2. Loop through all cards and filter them
        allCards.forEach(card => {
            const nameElement = card.querySelector('.fragrance-name');
            const fragranceName = nameElement
                ? nameElement.textContent.toLowerCase()
                : '';

            // Match only from the start of the name (search term)
            const matchesSearch = searchTerm === '' || fragranceName.startsWith(searchTerm);
            
            // Match the selected category
            const matchesCategory = currentVisibleCategory === 'all' || card.dataset.category === currentVisibleCategory;

            const isVisible = matchesSearch && matchesCategory;

            if (isVisible) {
                // Instantly revert to pre-animated state (snap hidden, no transition)
                card.style.transition = 'none';
                card.classList.remove('visible');
                card.style.display = 'block';
                
                // Force a layout recalculation
                void card.offsetHeight;
                
                // Restore the CSS transition for the upcoming entrance
                card.style.transition = '';
                
                cardsThatWillBeVisible.push(card);
                visibleCardCount++;
            } else {
                // Hide completely
                card.classList.remove('visible');
                card.style.display = 'none';
            }
        });

        /* -----------------------------------------------
           Hide section headers if their section is empty
           ----------------------------------------------- */

        allHeaders.forEach(header => {
            if (currentVisibleCategory !== 'all' && header.id !== currentVisibleCategory) {
                header.style.display = 'none';
                return;
            }

            let nextElement = header.nextElementSibling;
            let sectionHasVisibleContent = false;

            while (nextElement && !nextElement.classList.contains('section-header')) {
                if (nextElement.classList.contains('fragrance-card') && nextElement.style.display !== 'none') {
                    sectionHasVisibleContent = true;
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }

            header.style.display = sectionHasVisibleContent ? 'block' : 'none';
        });

        /* -----------------------------------------------
           No Results Handling
           ----------------------------------------------- */

        if (visibleCardCount === 0) {
            fragranceDisplay.style.display = 'none';
            noResultsMessage.style.display = 'block';
        } else {
            fragranceDisplay.style.display = 'grid';
            noResultsMessage.style.display = 'none';

            // 3. Re-trigger the staggered entry animation for visible cards
            // Slight delay ensures the browser registers the display: block first
            const initialDelay = setTimeout(() => {
                cardsThatWillBeVisible.forEach((card, index) => {
                    const timeoutId = setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 40); // 40ms stagger looks fast and premium
                    animationTimeouts.push(timeoutId);
                });
            }, 10);
            animationTimeouts.push(initialDelay);
        }
    }

    // Trigger initial animation on load
    applyFilters();

});
