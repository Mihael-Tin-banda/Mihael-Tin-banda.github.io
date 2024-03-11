let score = 1.0;
let scoreIncrement = 0.2;
let totalCoins = 100.0; // User's total coins
let currentBet = 0.0; // User's current bet
let gameActive = false; // Whether the game is currently active

function updateScore() {
    document.getElementById("score").textContent = "Score: " + score.toFixed(1);
    document.getElementById("coins").textContent = "Coins: " + totalCoins.toFixed(1); // Display total coins
}

document.getElementById("placeBetButton").addEventListener("click", function() {
    let bet = parseFloat(document.getElementById("betInput").value);
    placeBet(bet);
});

document.getElementById("withdrawButton").addEventListener("click", function() {
    totalCoins += currentBet * score; // Multiply the bet by the score and add it to the total coins
    initGame();
});

let gameDuration = 60; // Duration of the game in seconds

function startTimer() {
    let timeRemaining = gameDuration;
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
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function placeBet(bet) {
    if (bet <= 0) {
        alert("You must place a bet greater than 0.");
        return;
    }
    if (bet > totalCoins) {
        alert("You don't have enough coins to place this bet.");
        return;
    }
    currentBet = bet;
    totalCoins -= bet;
    updateScore();
    gameActive = true; // Start the game when the bet is placed
    initGame();
    startTimer();
}

function initGame() {
    // Clear the minefield
    let minefield = document.getElementById("minefield");
    while (minefield.firstChild) {
        minefield.firstChild.remove();
    }

    // Reset the score and score increment
    score = 1.0;
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
        square.className = "h-16 w-16 bg-gray-200 border border-gray-300 hover:bg-gray-400 m-0.5";
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
                initGame();
            } else {
                score += scoreIncrement;
                scoreIncrement += 0.2;
                updateScore();
                // Change the color of the square
                square.style.backgroundColor = "green";
            }
        });
        minefield.appendChild(square);
    }
}

document.getElementById("withdrawButton").addEventListener("click", function() {
    if (score === 1.0) {
        totalCoins += currentBet; // Return the current bet
    } else {
        totalCoins += currentBet * score; // Multiply the bet by the score and add it to the total coins
    }
    stopTimer(); // Stop the timer when the user withdraws
    gameActive = false; // Lock the game when the user withdraws
});

// Initialize the game on page load
initGame();