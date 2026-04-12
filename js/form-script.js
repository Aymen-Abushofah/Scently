/* =========================================================
   OPTION CARD SELECTION LOGIC
   Makes option cards behave like radio buttons (one selected per group)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Element Selectors ---
    const form = document.getElementById('selection-form');           // The main form container
    const optionCards = document.querySelectorAll('.option-card');    // All selectable option cards


    /* ---------------------------------------------------------
       Option Card Click Handling
       --------------------------------------------------------- */
    optionCards.forEach(card => {
        card.addEventListener('click', () => {

            // Get the group name from the clicked card's data-name attribute
            const groupName = card.dataset.name;

            // Select all cards in the same group
            const cardsInGroup = document.querySelectorAll(`.option-card[data-name="${groupName}"]`);

            // Deselect all cards in this group
            cardsInGroup.forEach(c => c.classList.remove('selected'));

            // Mark the clicked card as selected
            card.classList.add('selected');
        });
    });
});
