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
        { name: 'الثائر - بارفومز دي مارلي', url: 'fragrance.html?id=althair', image: 'images/perfumes/male/lthaïr Parfums de Marly.png' },
        { name: 'إماجينيشن - لوي فيتون', url: 'fragrance.html?id=imagination', image: 'images/perfumes/male/Imagination Louis Vuitton.png' },
        { name: 'سوفاج إليكسير - ديور', url: 'fragrance.html?id=sauvage-elixir', image: 'images/perfumes/male/Sauvage Elixir Dior.png' },
        { name: 'أومو بورن إن روما إنتنس - فالنتينو', url: 'fragrance.html?id=valentino', image: 'images/perfumes/male/Valentino Uomo Born In Roma Intense Valentino.png' },
        { name: 'وانتد أو دو بارفان - أزارو', url: 'fragrance.html?id=wanted', image: 'images/perfumes/male/Wanted Eau de Parfum Azzaro.png' },
        { name: 'برادا لوهم - برادا', url: 'fragrance.html?id=prada-lhomme', image: "images/perfumes/male/Prada L'Homme Prada.png" },
        { name: 'باد بوي كوبالت إليكسير - كارولينا هيريرا', url: 'fragrance.html?id=bad-boy-cobalt', image: 'images/perfumes/male/Bad Boy Cobalt Elixir Carolina Herrera.png' },
        { name: 'سبايسبوم دارك ليذر - فيكتور آند رولف', url: 'fragrance.html?id=spicebomb-dark-leather', image: 'images/perfumes/male/Spicebomb Dark Leather Viktor&Rolf.png' },
        { name: 'مليون جولد فور هير - رابيان', url: 'fragrance.html?id=million-gold-for-her', image: 'images/perfumes/female/Million Gold For Her Rabanne.png' },
        { name: 'ماي واي - جورجيو أرماني', url: 'fragrance.html?id=my-way', image: 'images/perfumes/female/My Way Giorgio Armani.png' },
        { name: 'ميس ديور بارفان - ديور', url: 'fragrance.html?id=miss-dior', image: 'images/perfumes/female/Miss Dior Parfum (2024) Dior.png' },
        { name: 'فالايا إكسكلوسيف - بارفومز دي مارلي', url: 'fragrance.html?id=valaya-exclusif', image: 'images/perfumes/female/Valaya Exclusif Parfums de Marly.png' },
        { name: 'جود جيرل - كارولينا هيريرا', url: 'fragrance.html?id=good-girl', image: 'images/perfumes/female/Good Girl Carolina Herrera.png' },
        { name: 'ليبر إنتنس - إيف سان لوران', url: 'fragrance.html?id=libre-intense-yves-saint-laurent', image: 'images/perfumes/female/Libre Intense Yves Saint Laurent.png' },
        { name: 'جادور لور - ديور', url: 'fragrance.html?id=jadore-lor', image: "images/perfumes/female/J'adore L'Or Dior.png" },
        { name: 'ديفوشن إنتنس - دولتشي آند غابانا', url: 'fragrance.html?id=devotion-intense', image: 'images/perfumes/female/Devotion Intense Dolce&Gabbana.png' },
        { name: 'بيانكو لاتيه - جيارديني دي توسكانا', url: 'fragrance.html?id=bianco-latte', image: 'images/perfumes/unisex/Bianco Latte Giardini Di Toscana.png' },
        { name: 'عود رويال - جورجيو أرماني', url: 'fragrance.html?id=oud-royal', image: 'images/perfumes/unisex/Armani Privé Oud Royal Giorgio Armani.png' },
        { name: 'إربا بورا - زيرجوف', url: 'fragrance.html?id=erba-pura', image: 'images/perfumes/unisex/Erba Pura Xerjoff.png' },
        { name: 'سايد إيفكت - إينيشيو', url: 'fragrance.html?id=side-effect', image: 'images/perfumes/unisex/Side Effect Initio Parfums Prives.png' },
        { name: 'أوجان - بارفوم دي مارلي', url: 'fragrance.html?id=oajan', image: 'images/perfumes/unisex/Oajan Parfums de Marly.png' },
        { name: 'سوليل بلانك - توم فورد', url: 'fragrance.html?id=soleil-blanc', image: 'images/perfumes/unisex/Soleil Blanc Tom Ford.png' },
        { name: 'عود زاريان - كريد', url: 'fragrance.html?id=oud-zarian', image: 'images/perfumes/unisex/Oud Zarian Creed.png' },
        { name: 'بيربوس 50 - أمواج', url: 'fragrance.html?id=purpose-50', image: 'images/perfumes/unisex/Purpose 50 Amouage.png' },
        { name: 'ليكويد بيرن - فرنش أفينيو', url: 'fragrance.html?id=liquid-brun', image: 'images/perfumes/maleDupes/Liquid Brun French Avenue.png' },
        { name: 'مروة - عربيّات بريستيج', url: 'fragrance.html?id=marwa', image: 'images/perfumes/maleDupes/Marwa Arabiyat Prestige.png' },
        { name: 'أسد - لطافة', url: 'fragrance.html?id=asad', image: 'images/perfumes/maleDupes/Asad Lattafa Perfumes.png' },
        { name: 'ريفيري أكوا - زيميا', url: 'fragrance.html?id=reverie-aqua', image: 'images/perfumes/maleDupes/Reverie Aqua Zimaya.png' },
        { name: 'جولد - أرماف', url: 'fragrance.html?id=gold', image: 'images/perfumes/femaleDupes/Gold Armaf.png' },
        { name: 'أميرة العرب - أصداف', url: 'fragrance.html?id=ameerat-al-arab', image: 'images/perfumes/femaleDupes/Ameerat Al Arab Asdaaf.png' },
        { name: 'ميس أروجيت - عساف', url: 'fragrance.html?id=miss-arrogate', image: 'images/perfumes/femaleDupes/Miss Arrogate Assaf.png' },
        { name: 'ميستيك بوكيت - أفنان', url: 'fragrance.html?id=mystique-bouquet', image: 'images/perfumes/femaleDupes/Mystique Bouquet Afnan.png' },
        { name: 'إكلير - لطافة', url: 'fragrance.html?id=eclaire', image: 'images/perfumes/unisexDupes/Eclair Lattafa.png' },
        { name: 'خمرة - لطافة', url: 'fragrance.html?id=khamrah', image: 'images/perfumes/unisexDupes/Khamrah Lattafa Perfumes.png' },
        { name: 'أنا أبيض - لطافة', url: 'fragrance.html?id=ana-abiyedh', image: 'images/perfumes/unisexDupes/Ana Abiyedh Lattafa Perfumes.png' },
        { name: 'أفتر إفكت - فرنش أفينيو', url: 'fragrance.html?id=after-effect', image: 'images/perfumes/unisexDupes/After Effect French Avenue.png' }
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

