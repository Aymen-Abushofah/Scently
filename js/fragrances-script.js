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
