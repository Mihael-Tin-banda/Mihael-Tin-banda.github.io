import { updateUserCoins } from '../../js/data.js';

// Whenever you update the coins, also update it in localStorage
function updateCoins(newCoins) {
    coins = newCoins;
    localStorage.setItem('coins', coins);
    updateUserCoins(coins);
  }

// Whenever you need to get the value of coins, get it from localStorage
function getCoins() {
    var storedCoins = localStorage.getItem('coins');
    return (!isNaN(parseFloat(storedCoins)) && storedCoins !== null) ? parseFloat(storedCoins) : 0;
  }

let multiply = 1.0;
let scoreIncrement = 0.2;
let coins = getCoins(); // User's total coins
let currentBet = 0.0; // User's current bet
let gameActive = false; // Whether the game is currently active
let timerId = null; // Add this line

function updateScore() {
    document.getElementById("multiply").textContent = "Multiply: " + multiply.toFixed(1);
}

document.getElementById("placeBetButton").addEventListener("click", function() {
    let bet = parseFloat(document.getElementById("betInput").value);
    
    if (bet < 0) {
        return;
    }

    if (bet > 0){
        placeBet(bet);
        this.style.display = 'none'; // Hide the placeBetButton
        document.getElementById("withdrawButton").style.display = 'block'; // Show the withdrawButton
    }
});

document.getElementById("withdrawButton").addEventListener("click", function() {
    updateCoins(getCoins() + currentBet * multiply); // Multiply the bet by the multiply and add it to the total coins
    initGame();
}); 

let gameDuration = 30; // Duration of the game in seconds

function startTimer() {
    let timeRemaining = gameDuration;
    document.getElementById("timer").style.display = 'block';
    document.getElementById("timer").textContent = "Time remaining: " + timeRemaining + "s";
    timerId = setInterval(function() {
        timeRemaining--;
        document.getElementById("timer").textContent = "Time remaining: " + timeRemaining + "s";
        if (timeRemaining <= 0) {
            // Time's up
            alert("Time's up!");
            stopTimer(); // Stop the timer
            initGame(); // Reset the game
        }
    }, 1000);
}

function stopTimer() {
    document.getElementById("timer").style.display = 'none';

    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function placeBet(bet) {
    if (bet > getCoins()) {
        alert("You don't have enough coins to place this bet.");
        return;
    }
    currentBet = bet;
    updateCoins(getCoins() - bet);
    updateScore();
    gameActive = true; // Start the game when the bet is placed
    initGame(); // Reset the game
    startTimer(); // Start the timer
}

function initGame() {
    // Clear the minefield
    let minefield = document.getElementById("minefield");
    while (minefield.firstChild) {
        minefield.firstChild.remove();
    }

    // Reset the score and score increment
    multiply = 1.0;
    scoreIncrement = 0.1;
    updateScore();

    // Create an array to store the mine locations
    let mines = Array(36).fill(false);
    for (let i = 0; i < 10; i++) {
        let index;
        do {
            index = Math.floor(Math.random() * 36);
        } while (mines[index]);
        mines[index] = true;
    }

    for (let i = 0; i < 36; i++) {
        let square = document.createElement("div");
        square.id = `square${i}`;
        square.className = "h-16 w-16 border-2 border-dashed border-color hover:bg-red-800 m-0.5";
        square.addEventListener("click", function() {
            if (!gameActive) {
                // If the game is not active, ignore the click
                return;
            }
            if (mines[i]) {
                // User clicked on a mine
                alert("Game Over");
                currentBet = 0; // Reset the current bet
                updateScore();
                stopTimer(); // Stop the timer when the game is over
                gameActive = false; // Lock the game when the user loses
                document.getElementById("withdrawButton").style.display = 'none'; // Hide the withdrawButton
                document.getElementById("placeBetButton").style.display = 'block'; // Show the placeBetButton
                initGame();
            } else {
                multiply += scoreIncrement;
                scoreIncrement += 0.2;
                updateScore();
                // Change the color of the square
                square.style.backgroundColor = "#ef4444d9"; ;
                // Do not reinitialize the game here
            }
        });
        minefield.appendChild(square);
    }
}

document.getElementById("withdrawButton").addEventListener("click", function() {
    if (multiply === 1.0) {
        updateCoins(getCoins()); // Return the current bet
    } else {
        updateCoins(getCoins() + currentBet * multiply); // Multiply the bet by the multiply and add it to the total coins
    }
    stopTimer(); // Stop the timer when the user withdraws
    gameActive = false; // Lock the game when the user withdraws
    currentBet = 0; // Reset the current bet
    initGame(); // Reset the game state
    this.style.display = 'none'; // Hide the withdrawButton
    document.getElementById("placeBetButton").style.display = 'block'; // Show the placeBetButton
});

// Initialize the game on page load
initGame();