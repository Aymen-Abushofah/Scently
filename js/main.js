/* =========================================================
   CARD FLIP INTERACTION
   Toggles a "flipped" state on the card container
   ========================================================= */

// Select all buttons that should trigger the card flip
const flipButtons = document.querySelectorAll('.flip-btn');

// Select the main card container that will be flipped
const cardContainer = document.querySelector('.card-container');

// Attach a click listener to each flip button
flipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggle the "flipped" class to switch between front and back
    cardContainer.classList.toggle('flipped');
  });
});


/* =========================================================
   MOBILE NAVIGATION (HAMBURGER MENU)
   Handles opening and closing the mobile menu
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Select the hamburger icon
    const hamburger = document.querySelector('.hamburger');

    // Select the mobile navigation menu
    const mobileMenu = document.querySelector('.nav-mobile-menu');

    // Ensure both elements exist before attaching listeners
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            // Animate the hamburger icon (e.g., into an "X")
            hamburger.classList.toggle('active');

            // Show or hide the mobile navigation menu
            mobileMenu.classList.toggle('active');
        });
    }
});
