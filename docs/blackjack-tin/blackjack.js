// Initialize player's coins
let playerCoins = 1000;

// Initialize player's bet
let playerBet = 0;

// Get the bet button
let betButton = document.getElementById('btn-bet');

// Add event listener to the bet button
betButton.addEventListener('click', function() {
    // Get the bet amount from the user
    let betAmount = parseInt(prompt('Enter your bet amount:'));
    
    // Check if the bet amount is valid
    if (betAmount > 0 && betAmount <= playerCoins) {
        // Update the player's bet and coins
        playerBet = betAmount;
        playerCoins -= betAmount;
        
        // Update the bet and coins display
        document.getElementById('player-bet').textContent = 'Bet: ' + playerBet;
        document.getElementById('player-coins').textContent = 'Coins: ' + playerCoins;
    } else {
        alert('Invalid bet amount');
    }
});

// Create a deck of cards
let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

for (let suit of suits) {
    for (let rank of ranks) {
        deck.push({
            suit: suit,
            rank: rank,
            // Assuming you have images named like "hearts-2.png", "diamonds-K.png", etc.
            imageUrl: `assets/${suit}-${rank}.jpg`
        });
    }
}

// Shuffle the deck
for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
}

// Function to draw a card
function drawCard() {
    return deck.pop();
}

// Function to calculate the value of a hand
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.rank === 'A') {
            aces += 1;
            value += 11;
        } else if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
            value += 10;
        } else {
            value += parseInt(card.rank);
        }
    }

    // Handle aces (they can be 1 or 11)
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

function determineWinner(playerHand, dealerHand) {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
        return 'Dealer';
    } else if (dealerValue > 21) {
        return 'Player';
    } else if (playerValue > dealerValue) {
        return 'Player';
    } else if (dealerValue > playerValue) {
        return 'Dealer';
    } else {
        return 'Draw';
    }
}
