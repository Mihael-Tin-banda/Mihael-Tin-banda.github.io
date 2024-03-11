let score = 1.0;
let scoreIncrement = 0.2;

function updateScore() {
    document.getElementById("score").textContent = "Score: " + score.toFixed(1);
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
            if (mines[i]) {
                alert("Game Over");
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

initGame();