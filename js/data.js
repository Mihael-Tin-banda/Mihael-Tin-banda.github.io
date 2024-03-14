// Initialize the coin count
var coins = 0;

// Function to update the coin display
function updateCoinDisplay() {
    document.getElementById('coinDisplay').textContent = `Balance: ${coins.toFixed(1)} KK`;
    location.reload();
}

// Function to update the coin count
export function updateUserCoins(change) {
    console.log("updateUserCoins called with: ", change); // Add this line

    // coins = 10;
    // localStorage.setItem('coins', coins);

    if (typeof change === 'number') {
        console.log("Change value: ", change);
        coins = change;
        localStorage.setItem('coins', coins.toFixed(1)); // Save the updated coin count to localStorage
        updateCoinDisplay(); // Update the coin display
    }
    return coins;
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Retrieve the coin count from localStorage
    let storedCoins = localStorage.getItem('coins');
    if (storedCoins !== null && !isNaN(storedCoins)) {
        coins = parseFloat(storedCoins);
    } else {
        coins = 0;
    }

    // Log the coin count
    console.log("Current coin count: " + coins);

    // Display the coin count
    updateCoinDisplay();
});