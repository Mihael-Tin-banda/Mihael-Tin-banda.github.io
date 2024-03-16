import { updateUserCoins } from '../../js/data.js';

// alias for matter.js namespace
const { Engine, Render, Runner, Bodies, Body, Events } = Matter;

// get the game content element
const gameContent = document.getElementById("gameContent");

// create an engine
const engine = Engine.create({
  gravity: {
    x: 0,
    y: 0.2,
  },
});

// create a renderer
const render = Render.create({
  element: gameContent, // set the element to the game content element
  engine: engine,
  options: {
    width: Math.min(window.innerWidth, 800), // set the width
    height: Math.min(window.innerHeight, 600), // set the height
    wireframes: false,
  },
});

// Launch the ball control

let launchInterval;

document.getElementById('launchBall').addEventListener('click', function() {
  let numBalls = parseInt(document.getElementById('ballCost').value);
  if (numBalls < 0) {
      return;
  }
  launchBall(numBalls);  // start launching balls when the button is clicked
});

document.getElementById('launchBall').addEventListener('mousedown', function() {
  let numBalls = parseInt(document.getElementById('ballCost').value);
  if (numBalls < 0) {
      return;
  }
  // start launching balls when the button is held down
  launchInterval = setInterval(launchBall, 115); // adjust the interval as needed
});

document.getElementById('launchBall').addEventListener('mouseup', function() {
  let numBalls = parseInt(document.getElementById('ballCost').value);
  if (numBalls < 0) {
      return;
  }
  // stop launching balls when the button is released
  clearInterval(launchInterval);
});

// create a runner to run the engine
const runner = Runner.create();
Runner.run(runner, engine);

// create the walls
const wallOptions = { isStatic: true, restitution: 1.2 };
const wallTop = Bodies.rectangle(
  render.canvas.width / 2,
  0,
  render.canvas.width,
  1,
  wallOptions
);
const wallBottom = Bodies.rectangle(
  render.canvas.width / 2,
  render.canvas.height,
  render.canvas.width,
  1,
  wallOptions
);
const wallLeft = Bodies.rectangle(
  0,
  render.canvas.height / 2,
  1,
  render.canvas.height,
  wallOptions
);
const wallRight = Bodies.rectangle(
  render.canvas.width,
  render.canvas.height / 2,
  1,
  render.canvas.height,
  wallOptions
);
Matter.World.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight]);

wallBottom.restitution = 0;

// calculate the total width of the pins
const totalPinWidth = 9 * 80; // 9 is the number of gaps between the pins, 80 is the distance between the pins

// calculate the pin offset
const pinOffset = (render.canvas.width - totalPinWidth) / 2;

// create vertices for the pyramid
const vertices = [
  { x: (render.canvas.width / 2) - 25, y: 95 }, // left point
  { x: render.canvas.width / 2, y: 85 }, // top point
  { x: (render.canvas.width / 2) + 25, y: 95 } // right point
];
  
  // create the launcher
  const launcher = Bodies.fromVertices(render.canvas.width / 2, 50, vertices, {
    // center the launcher
    isStatic: true,
    render: {
      fillStyle: "transparent",
    },
  });
Matter.World.add(engine.world, launcher);

window.onload = function () {
  let gameScreenWidth = window.innerWidth;
  let pins = document.querySelectorAll(".pin");

  pins.forEach((pin) => {
    pin.style.width = gameScreenWidth / pins.length + "px";
  });
};

// create the pins
let pins = [];
const pinRadius = 10; // smaller radius for a game like Pachinko
const spacing = 100; // spacing between pins
const rows = 8; // number of rows in the grid

// calculate the start coordinates
const startY = launcher.position.y + launcher.bounds.max.y + spacing * 0.2; // start the pins below the launcher

// calculate the width of the pyramid
const pyramidWidth = (rows * 2 - 1) * spacing;

for (let i = 0; i < rows; i++) {
  // number of pins in the current row
  const cols = rows - i;

  // calculate the width of the current row
  const rowWidth = cols * spacing;

  // calculate the start x-coordinate for the current row
  const startX = (render.canvas.width - rowWidth) / 2 + spacing / 2; // center the row

  for (let j = 0; j < cols; j++) {
      // adjust x position to center the pyramid
      const x = startX + j * spacing;
      const y = startY + i * spacing;
      const pin = Bodies.circle(x, y, pinRadius, {
          isStatic: true,
          restitution: 1.2, // higher value to make the pins more bouncy
          render: {
            fillStyle: 'transparent', // make the pin not filled
            strokeStyle: '#f7fff7', // add a border
            lineWidth: 4 // set the border width
          },
      });
      pins.push(pin);
      Matter.World.add(engine.world, pin);
  }
}

// Remove the last pin from the pins array
const lastPin = pins.pop();

// Remove the last pin from the engine.world
Matter.World.remove(engine.world, lastPin);

// apply a force to the pins
Events.on(engine, "afterUpdate", function () {
  for (let pin of pins) {
    Body.applyForce(pin, { x: 0, y: 0 }, { x: 0.005, y: 0 });
  }
});

// create the ball
let ball = null;

// create the sections
const numSections = 9; // number of sections
const sectionWidth = render.canvas.width / numSections; // divide the width by the number of sections
const sectionHeight = 20; // set the height of the sections
const borderThickness = 4; // thickness of the borders
const sections = [];
const sectionStartY = render.canvas.height - sectionHeight / 2; // start the sections at the bottom of the canvas
for (let i = 0; i < numSections; i++) {
  let coins;
  if (i === Math.floor(numSections / 2)) {
    coins = 15; // middle section
  } else if (
    i === Math.floor(numSections / 2) - 1 ||
    i === Math.floor(numSections / 2) + 1
  ) {
    coins = 1.2; // sections around the middle one
  } else if (
    i === Math.floor(numSections / 2) - 2 ||
    i === Math.floor(numSections / 2) + 2
  ) {
    coins = 0.7; // sections around the previous ones
  } else if (
    i === Math.floor(numSections / 2) - 3 ||
    i === Math.floor(numSections / 2) + 3
  ) {
    coins = 0.3; // sections around the previous ones
  } else {
    coins = 0.1; // the rest of the sections
  }
  const section = Bodies.rectangle(
    i * sectionWidth + sectionWidth / 2,
    sectionStartY,
    sectionWidth - borderThickness,
    sectionHeight,
    {
      isStatic: true,
      label: "section" + (i + 1) + " - multiplier: " + coins, // give each section a unique label
      coins: coins, // assign a unique coins to each section
      render: {
        fillStyle: 'transparent', // make the section not filled
      },
    }
  );
  sections.push(section);
    // create the left border
    if (i > 0) { // don't create a left border for the first section
        const leftBorder = Bodies.rectangle(
            i * sectionWidth - borderThickness / 2,
            sectionStartY,
            borderThickness,
            sectionHeight * 1.3, // make the border tall
            {
                isStatic: true,
                restitution: 1.0, // make the borders bouncy
                label: 'border', // label the borders so we can identify them in the collision event
                render: {
                    fillStyle: '#f55' // change the color
                }
            }
        );
        sections.push(leftBorder);
    }

    // create the right border
    if (i < numSections - 1) { // don't create a right border for the last section
        const rightBorder = Bodies.rectangle(
            (i + 1) * sectionWidth - borderThickness / 2,
            sectionStartY,
            borderThickness,
            sectionHeight * 1.3, // make the border tall
            {
                isStatic: true,
                restitution: 1.0, // make the borders bouncy
                label: 'border', // label the borders so we can identify them in the collision event
                render: {
                    fillStyle: '#f55' // change the color
                }
            }
        );
        sections.push(rightBorder);
    }
}
Matter.World.add(engine.world, sections);

// create an array to store all the balls

var balls = [];

window.launchBall = function () {
    console.log("launchBall function called");

    let ballCost = parseFloat(document.getElementById('ballCost').value); 

    let ballsToLaunch = 1; // set the number of balls to launch
  
    for (let i = 0; i < ballsToLaunch; i++) {
      if (coins > ballCost) { // check if the coins is greater than the cost of a ball
        coins -= ballCost; // subtract the cost of a ball from the coins
        updateUserCoins(coins); // update the display of the coins

        let variation = 100; // replace with the amount of variation you want
        let randomX = launcher.position.x - variation / 1.2 + Math.random() * variation;

        let newBall = Bodies.circle(
          randomX,
          launcher.position.y,
          10, // Change this value to adjust the size of the ball
          {
            restitution: 0.9,
            render: {
              fillStyle: "#f55",
            },
          }
        );

      // add the new ball to the world
      Matter.World.add(engine.world, newBall);

      // add the new ball to the balls array
      balls.push(newBall);

      // apply a force to the new ball to launch it
      Body.applyForce(newBall, newBall.position, { x: 0, y: -0.01 });
    }
  }
};

// listen for collision events
Events.on(engine, "collisionStart", function (event) {
    var pairs = event.pairs;
  
    // iterate over the pairs to find the collisions
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
  
      // iterate over all balls
      for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
  
        // check if the ball collided with a section
        if (
          (pair.bodyA === ball && sections.includes(pair.bodyB)) ||
          (pair.bodyB === ball && sections.includes(pair.bodyA))
        ) {
          console.log("A ball reached a section");
  
          // get the section that the ball reached
          var section = sections.includes(pair.bodyB) ? pair.bodyB : pair.bodyA;
  
          // remove the ball from the world
          Matter.World.remove(engine.world, ball);
  
          // remove the ball from the balls array
          balls.splice(i, 1);

        let ballCost = parseFloat(document.getElementById('ballCost').value);
          // add to the coins based on the section
          if (section.coins !== undefined) {
            coins += section.coins * ballCost;
            console.log("Added coins: " + section.coins); // display the added coins in the console
            updateUserCoins(coins); // update the display of the coins
        } else {
            console.log("Error: section.coins is undefined");
        }
        }
      }
    }
  });

// create a variable to keep track of the coins
var storedCoins = localStorage.getItem('coins');
var coins = (!isNaN(parseFloat(storedCoins)) && storedCoins !== null) ? parseFloat(storedCoins) : 0;

// Give the user 10 coins for starting the game
if (localStorage.getItem('coins') === null) {
  // This is the first time the game is being started
  coins = 10;
  localStorage.setItem('coins', coins);
} else {
  // This is not the first time the game is being started
  // Retrieve the coin count from local storage
  coins = parseFloat(localStorage.getItem('coins'));
}

// When the user wins or loses coins...
let coinChange = coins;

coins = coinChange;
localStorage.setItem('coins', coins);

updateUserCoins(coinChange);

// handle collisions
Events.on(engine, "collisionStart", function (event) {
  var pairs = event.pairs;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];

    if (pair.bodyA === ball) {
      console.log("ball collided with " + pair.bodyB.label);
      // update the coins based on the section the ball collided with
      if (pair.bodyB.label.startsWith("section")) {
        if (typeof pair.bodyB.coins === 'number') {
          coins += pair.bodyB.coins; // use the coins assigned to the section
        Matter.World.remove(engine.world, ball); // remove the ball from the world
        ball = null; // set the ball to null
      } else {
        console.log('Error: pair.bodyB.coins is not a number');
      }
    }
    } else if (pair.bodyB === ball) {
      console.log("ball collided with " + pair.bodyA.label);
      // update the coins based on the section the ball collided with
      if (pair.bodyA.label.startsWith("section")) {
        coins += pair.bodyA.coins; // use the coins assigned to the section
        Matter.World.remove(engine.world, ball); // remove the ball from the world
        ball = null; // set the ball to null
      }
    }
  }
});

// detect collisions
Events.on(engine, "collisionStart", function (event) {
  const pairs = event.pairs;

  for (let i = 0, j = pairs.length; i != j; ++i) {
    const pair = pairs[i];

    if (pair.bodyA === ball) {
      console.log("ball collided with " + pair.bodyB.label);
      // update the coins based on the section the ball collided with
      if (pair.bodyB.label.startsWith("section")) {
        console.log("Coins: " + pair.bodyB.label.slice(7));
      }
    } else if (pair.bodyB === ball) {
      console.log("ball collided with " + pair.bodyA.label);
      // update the coins based on the section the ball collided with
      if (pair.bodyA.label.startsWith("section")) {
        console.log("Coins: " + pair.bodyA.label.slice(7));
      }
    }
  }
});


// detect when the ball reaches the bottom of the screen
Events.on(engine, "afterUpdate", function () {
  if (ball !== null && ball.position.y > render.canvas.height) {
    console.log("The ball has reached the bottom of the screen");
  }
});


// run the renderer
Render.run(render);
