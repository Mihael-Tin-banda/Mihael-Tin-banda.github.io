import { updateUserCoins } from "../../js/data.js";

document.addEventListener("DOMContentLoaded", (event) => {
  let coins = getCoins();

  function getCoins() {
    var storedCoins = localStorage.getItem("coins");
    return !isNaN(parseFloat(storedCoins)) && storedCoins !== null
      ? parseFloat(storedCoins)
      : 0;
  }

  function updateCoins(newCoins) {
    coins = newCoins;
    localStorage.setItem("coins", coins);
    updateUserCoins(coins);
  }

  let selectedNumbers = [];
  let bet = 0;

  for (let i = 1; i <= 36; i++) {
    let button = document.createElement("div");
    button.textContent = i;
    button.className =
      "number h-16 w-16 border-2 border-dashed border-color hover:bg-red-800 m-0.5";
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.fontSize = "1.3rem";
    button.style.fontWeight = "bold";
    button.addEventListener("click", function () {
      let index = selectedNumbers.indexOf(i);
      if (index > -1) {
        // Number is already selected, so unselect it
        selectedNumbers.splice(index, 1);
        button.style.backgroundColor = ""; // Add this line to change the color back when a number is unselected
      } else if (selectedNumbers.length < 5) {
        // Number is not selected and we have less than 5 numbers, so select it
        selectedNumbers.push(i);
        button.style.backgroundColor = "#ef4444d9";
      }
    });
    document.getElementById("grid").appendChild(button);
  }

  document
    .getElementById("placeBetButton")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (selectedNumbers.length < 5) {
        alert("Please select all 5 numbers before placing a bet.");
        return;
      }
      bet = parseFloat(document.getElementById("betInput").value);
      if (bet < 0) {
        return;
      }
      if (bet > getCoins()) {
        alert("You don't have enough coins to place this bet.");
        return;
      }
      updateCoins(getCoins() - bet);
      let winnings = playGame();
      updateCoins(getCoins() + winnings);

      // Delay the clearing of the selected numbers and the button styles
      setTimeout(function () {
        let numberButtons = document.getElementsByClassName("number");
        for (let button of numberButtons) {
          if (selectedNumbers.includes(parseInt(button.textContent))) {
            button.classList.add("fade-out");
          }
        }
      }, clen * increment * speed + 1000); // Adjust the delay as needed

      setTimeout(function () {
        selectedNumbers = [];
        bet = 0;
        let numberButtons = document.getElementsByClassName("number");
        for (let button of numberButtons) {
          button.disabled = false;
          button.style.backgroundColor = "";
          button.classList.remove("fade-out");
        }
      }, clen * increment * speed + 2000); // Adjust the delay as needed
    });

  var speed = 30; // ms per frame
  var increment = 8; // frames per step. Must be >2

  var clen = 0;
  var si = 0;
  var stri = 0;
  var block = "";
  var fixed = "";
  var ctnt = "";

  //Call self x times, whole function wrapped in setTimeout
  function rustle(i) {
    setTimeout(function () {
      if (--i) {
        rustle(i);
      }
      nextFrame(i);
      si = si + 1;
    }, speed);
  }

  function nextFrame(pos) {
    for (var i = 0; i < clen - stri; i++) {
      //Random number
      var num = Math.floor(36 * Math.random()) + 1;
      block = block + num;
    }
    if (si == increment - 1) {
      stri++;
    }
    if (si == increment) {
      // Add a number;
      // every speed*10 ms
      fixed = fixed + ctnt.charAt(stri - 1);
      si = 0;
    }
    document.getElementById("randomNumbers").textContent =
      "Random numbers: " + fixed + block;
    block = "";
  }

  function playGame() {
    let randomNumbers = [];
    for (let i = 0; i < 5; i++) {
      let randomNumber;
      do {
        randomNumber = Math.floor(Math.random() * 36) + 1;
      } while (randomNumbers.includes(randomNumber));
      randomNumbers.push(randomNumber);
    }

    // Start the random number effect
    ctnt = randomNumbers.join(" ");
    clen = ctnt.length;
    rustle(clen * increment + 1);

    let correctGuesses = selectedNumbers.filter((n) =>
      randomNumbers.includes(n)
    ).length;
    let multiplier = [0, 0.5, 1.5, 5, 10, 100][correctGuesses];

    // Delay the display of the "You got" and "You won" messages
    setTimeout(function () {
      document.getElementById("correctGuesses").textContent =
        " You got " + correctGuesses + " correct";
      document.getElementById("result").textContent =
        "You won: " + bet * multiplier;
    }, clen * increment * speed + 450); // Adjust the delay as needed

    return bet * multiplier;
  }
});
