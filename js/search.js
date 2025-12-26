/* =========================================================
   GLOBAL SEARCH DROPDOWN
   Isolated using an IIFE to avoid polluting the global scope
   ========================================================= */

(() => {

    /* =====================================================
       1. FRAGRANCE DATA SOURCE
       Acts as a lightweight in-memory database for search
       ===================================================== */

    const allFragrances = [
        { name: 'الثائر - بارفومز دي مارلي', url: 'Althair.html', image: 'images/perfumes/male/lthaïr Parfums de Marly.png' },
        { name: 'إماجينيشن - لوي فيتون', url: 'Imagination.html', image: 'images/perfumes/male/Imagination Louis Vuitton.png' },
        { name: 'سوفاج إليكسير - ديور', url: 'Sauvage Elixir.html', image: 'images/perfumes/male/Sauvage Elixir Dior.png' },
        { name: 'أومو بورن إن روما إنتنس - فالنتينو', url: 'Valentino.html', image: 'images/perfumes/male/Valentino Uomo Born In Roma Intense Valentino.png' },
        { name: 'وانتد أو دو بارفان - أزارو', url: 'Wanted.html', image: 'images/perfumes/male/Wanted Eau de Parfum Azzaro.png' },
        { name: 'برادا لوهم - برادا', url: 'Prada LHomme.html', image: "images/perfumes/male/Prada L'Homme Prada.png" },
        { name: 'باد بوي كوبالت إليكسير - كارولينا هيريرا', url: 'Bad Boy Cobalt.html', image: 'images/perfumes/male/Bad Boy Cobalt Elixir Carolina Herrera.png' },
        { name: 'سبايسبوم دارك ليذر - فيكتور آند رولف', url: 'Spicebomb Dark Leather.html', image: 'images/perfumes/male/Spicebomb Dark Leather Viktor&Rolf.png' },
        { name: 'مليون جولد فور هير - رابيان', url: 'Million Gold For Her.html', image: 'images/perfumes/female/Million Gold For Her Rabanne.png' },
        { name: 'ماي واي - جورجيو أرماني', url: 'My Way.html', image: 'images/perfumes/female/My Way Giorgio Armani.png' },
        { name: 'ميس ديور بارفان - ديور', url: 'Miss Dior.html', image: 'images/perfumes/female/Miss Dior Parfum (2024) Dior.png' },
        { name: 'فالايا إكسكلوسيف - بارفومز دي مارلي', url: 'Valaya Exclusif.html', image: 'images/perfumes/female/Valaya Exclusif Parfums de Marly.png' },
        { name: 'جود جيرل - كارولينا هيريرا', url: 'Good Girl.html', image: 'images/perfumes/female/Good Girl Carolina Herrera.png' },
        { name: 'ليبر إنتنس - إيف سان لوران', url: 'Libre Intense Yves Saint Laurent.html', image: 'images/perfumes/female/Libre Intense Yves Saint Laurent.png' },
        { name: 'جادور لور - ديور', url: 'Jadore Lor.html', image: "images/perfumes/female/J'adore L'Or Dior.png" },
        { name: 'ديفوشن إنتنس - دولتشي آند غابانا', url: 'Devotion Intense.html', image: 'images/perfumes/female/Devotion Intense Dolce&Gabbana.png' },
        { name: 'بيانكو لاتيه - جيارديني دي توسكانا', url: 'Bianco Latte.html', image: 'images/perfumes/unisex/Bianco Latte Giardini Di Toscana.png' },
        { name: 'عود رويال - جورجيو أرماني', url: 'Oud Royal.html', image: 'images/perfumes/unisex/Armani Privé Oud Royal Giorgio Armani.png' },
        { name: 'إربا بورا - زيرجوف', url: 'Erba Pura.html', image: 'images/perfumes/unisex/Erba Pura Xerjoff.png' },
        { name: 'سايد إيفكت - إينيشيو', url: 'Side Effect.html', image: 'images/perfumes/unisex/Side Effect Initio Parfums Prives.png' },
        { name: 'أوجان - بارفوم دي مارلي', url: 'Oajan.html', image: 'images/perfumes/unisex/Oajan Parfums de Marly.png' },
        { name: 'سوليل بلانك - توم فورد', url: 'Soleil Blanc.html', image: 'images/perfumes/unisex/Soleil Blanc Tom Ford.png' },
        { name: 'عود زاريان - كريد', url: 'Oud Zarian.html', image: 'images/perfumes/unisex/Oud Zarian Creed.png' },
        { name: 'بيربوس 50 - أمواج', url: 'Purpose 50.html', image: 'images/perfumes/unisex/Purpose 50 Amouage.png' },
        { name: 'ليكويد بيرن - فرنش أفينيو', url: 'Liquid Brun.html', image: 'images/perfumes/maleDupes/Liquid Brun French Avenue.png' },
        { name: 'مروة - عربيّات بريستيج', url: 'Marwa.html', image: 'images/perfumes/maleDupes/Marwa Arabiyat Prestige.png' },
        { name: 'أسد - لطافة', url: 'Asad.html', image: 'images/perfumes/maleDupes/Asad Lattafa Perfumes.png' },
        { name: 'ريفيري أكوا - زيميا', url: 'Reverie Aqua.html', image: 'images/perfumes/maleDupes/Reverie Aqua Zimaya.png' },
        { name: 'جولد - أرماف', url: 'Gold.html', image: 'images/perfumes/femaleDupes/Gold Armaf.png' },
        { name: 'أميرة العرب - أصداف', url: 'Ameerat Al Arab.html', image: 'images/perfumes/femaleDupes/Ameerat Al Arab Asdaaf.png' },
        { name: 'ميس أروجيت - عساف', url: 'Miss Arrogate.html', image: 'images/perfumes/femaleDupes/Miss Arrogate Assaf.png' },
        { name: 'ميستيك بوكيت - أفنان', url: 'Mystique Bouquet.html', image: 'images/perfumes/femaleDupes/Mystique Bouquet Afnan.png' },
        { name: 'إكلير - لطافة', url: 'Eclaire.html', image: 'images/perfumes/unisexDupes/Eclair Lattafa.png' },
        { name: 'خمرة - لطافة', url: 'Khamrah.html', image: 'images/perfumes/unisexDupes/Khamrah Lattafa Perfumes.png' },
        { name: 'أنا أبيض - لطافة', url: 'Ana Abiyedh.html', image: 'images/perfumes/unisexDupes/Ana Abiyedh Lattafa Perfumes.png' },
        { name: 'أفتر إفكت - فرنش أفينيو', url: 'After Effect.html', image: 'images/perfumes/unisexDupes/After Effect French Avenue.png' }
    ];


    /* =====================================================
       2. DOM ELEMENT SELECTORS
       ===================================================== */

    const searchInput = document.getElementById('global-search-input');
    const resultsDropdown = document.getElementById('search-results');

    // Fail fast if required elements are missing
    if (!searchInput || !resultsDropdown) {
        console.error(
            'Global Search Error: Required DOM elements not found.'
        );
        return;
    }


    /* =====================================================
       3. SEARCH & RENDER LOGIC
       Filters fragrance data and renders matching results
       ===================================================== */

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Hide dropdown when input is empty
        if (searchTerm === '') {
            resultsDropdown.classList.remove('show');
            return;
        }

        // Find all fragrances that match the search term
        const matchingFragrances = allFragrances.filter(fragrance =>
            fragrance.name.toLowerCase().includes(searchTerm)
        );

        // Clear previous search results
        resultsDropdown.innerHTML = '';

        if (matchingFragrances.length > 0) {

            // Render each matching fragrance
            matchingFragrances.forEach(fragrance => {
                const link = document.createElement('a');
                link.href = fragrance.url;
                link.className = 'result-item';

                // Build result item markup (image + name)
                link.innerHTML = `
                    <img 
                        src="${fragrance.image}" 
                        alt="${fragrance.name}" 
                        class="result-image"
                    >
                    <span class="result-name">${fragrance.name}</span>
                `;

                resultsDropdown.appendChild(link);
            });

        } else {
            // Display a message when no matches are found
            resultsDropdown.innerHTML = `
                <div class="no-results-item">
                    لا توجد نتائج مطابقة
                </div>
            `;
        }

        // Show the dropdown after rendering results
        resultsDropdown.classList.add('show');
    });


    /* =====================================================
       4. OUTSIDE CLICK HANDLING
       Closes the dropdown when clicking outside the input
       ===================================================== */

    window.addEventListener('click', (event) => {
        if (event.target !== searchInput) {
            resultsDropdown.classList.remove('show');
        }
    });

})();
