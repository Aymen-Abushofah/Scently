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
       DROPDOWN MENU LOGIC
       Handles opening / closing of the filter dropdown
       ===================================================== */

    const dropdown = document.querySelector('.dropdown');

    if (dropdown) {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown visibility when clicking the toggle button
        dropdownToggle.addEventListener('click', (e) => {
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
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu?.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });


    /* =====================================================
       SEARCH & FILTER LOGIC
       Filters cards based on visible fragrance name
       ===================================================== */

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCardCount = 0;

        // Loop through all cards and filter them
        allCards.forEach(card => {
            const nameElement = card.querySelector('.fragrance-name');
            const fragranceName = nameElement
                ? nameElement.textContent.toLowerCase()
                : '';

            // Match only from the start of the name
            const isVisible =
                searchTerm === '' || fragranceName.startsWith(searchTerm);

            // Hide cards using display to avoid layout gaps
            card.style.display = isVisible ? 'block' : 'none';

            if (isVisible) visibleCardCount++;
        });

        /* -----------------------------------------------
           Hide section headers if their section is empty
           ----------------------------------------------- */

        allHeaders.forEach(header => {
            let nextElement = header.nextElementSibling;
            let sectionHasVisibleContent = false;

            // Walk through elements until the next section header
            while (nextElement && !nextElement.classList.contains('section-header')) {
                if (nextElement.style.display !== 'none') {
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

        if (visibleCardCount === 0 && searchTerm !== '') {
            fragranceDisplay.style.display = 'none';
            noResultsMessage.style.display = 'block';
        } else {
            fragranceDisplay.style.display = 'grid';
            noResultsMessage.style.display = 'none';
        }
    });


    /* =====================================================
       STAGGERED ENTRY ANIMATION
       Animates cards on initial page load
       ===================================================== */

    const cardsToAnimate = document.querySelectorAll('.fragrance-card');

    cardsToAnimate.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150); // Delay increases per card
    });

});
