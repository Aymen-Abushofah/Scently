/* =========================================================
   LEADERBOARD FILTERING LOGIC
   Switches between leaderboards based on selected category
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Select all filter buttons (e.g. Men / Women / Unisex)
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Select all leaderboard containers
    const leaderboards = document.querySelectorAll('.leaderboard');


    /* ---------------------------------------------------------
       Show a specific leaderboard based on filter value
       --------------------------------------------------------- */
    const showLeaderboard = (filter) => {

        // Hide all leaderboards first
        leaderboards.forEach(board => {
            board.classList.remove('active');
        });

        // Find the leaderboard matching the selected filter
        const boardToShow = document.getElementById(`${filter}-leaderboard`);

        // Activate the matched leaderboard if it exists
        if (boardToShow) {
            boardToShow.classList.add('active');
        }
    };


    /* ---------------------------------------------------------
       Button Click Handling
       --------------------------------------------------------- */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Display the corresponding leaderboard
            showLeaderboard(filter);
        });
    });


    /* ---------------------------------------------------------
       Default State
       --------------------------------------------------------- */

    // Show the "men" leaderboard when the page loads
    showLeaderboard('men');

});
