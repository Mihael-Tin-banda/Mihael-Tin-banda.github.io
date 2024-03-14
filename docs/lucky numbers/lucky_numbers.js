import { updateUserCoins } from '../../js/data.js';

document.addEventListener('DOMContentLoaded', (event) => {

    let coins = getCoins();

    function getCoins() {
        var storedCoins = localStorage.getItem('coins');
        return (!isNaN(parseFloat(storedCoins)) && storedCoins !== null) ? parseFloat(storedCoins) : 0;
    }

    function updateCoins(newCoins) {
        coins = newCoins;
        localStorage.setItem('coins', coins);
        updateUserCoins(coins);
    }

    let selectedNumbers = [];
    let bet = 0;

    for (let i = 1; i <= 36; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.className = 'number';
        button.addEventListener('click', function() {
            if (selectedNumbers.length < 5) {
                selectedNumbers.push(i);
                button.disabled = true;
                button.style.backgroundColor = "#9CA3AF";
            }
        });
        document.getElementById('grid').appendChild(button);
    }

    document.getElementById('placeBetButton').addEventListener('click', function(e) {
        e.preventDefault();
        bet = parseFloat(document.getElementById('betInput').value);
        if (bet > getCoins()) {
            alert("You don't have enough coins to place this bet.");
            return;
        }
        updateCoins(getCoins() - bet);
        let winnings = playGame();
        updateCoins(getCoins() + winnings);
        document.getElementById('result').textContent = 'You won: ' + winnings;

        selectedNumbers = [];
        bet = 0;
        let numberButtons = document.getElementsByClassName('number');
        for (let button of numberButtons) {
            button.disabled = false;
            button.style.backgroundColor = "";
        }
    });

    function playGame() {
        let randomNumbers = [];
        for (let i = 0; i < 5; i++) {
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 36) + 1;
            } while (randomNumbers.includes(randomNumber));
            randomNumbers.push(randomNumber);
        }
        document.getElementById('randomNumbers').textContent = 'Random numbers: ' + randomNumbers.join(', ');
    
        let correctGuesses = selectedNumbers.filter(n => randomNumbers.includes(n)).length;
        let multiplier = [0, 0.5, 1.5, 5, 10, 100][correctGuesses];
    
        document.getElementById('correctGuesses').textContent =' You got ' + correctGuesses + ' correct';
    
        return bet * multiplier;
    }
});