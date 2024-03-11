document.getElementById('increaseCost').addEventListener('click', function() {
    var ballCost = document.getElementById('ballCost');
    ballCost.value = parseFloat(ballCost.value) + 1.0;
});

document.getElementById('increaseDecost').addEventListener('click', function() {
    var ballCost = document.getElementById('ballCost');
    var currentCost = parseFloat(ballCost.value);
    if (currentCost > 1) {
        ballCost.value = currentCost - 1.0;
    }
});
// alias for matter.js namespace
const { Engine, Render, Runner, Bodies, Body, Events } = Matter;

// get the game content element
const gameContent = document.getElementById("gameContent");

// create an engine
const engine = Engine.create({
  gravity: {
    x: 0,
    y: 0.5,
  },
});

// create a renderer
const render = Render.create({
  element: gameContent, // set the element to the game content element
  engine: engine,
  options: {
    width: Math.min(window.innerWidth, 1024), // set the width
    height: Math.min(window.innerHeight, 768), // set the height
    wireframes: false,
  },
});

document.body.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault(); // prevent the default behavior
        launchBall();
    }
});

document.body.addEventListener("touchstart", function (event) {
    event.preventDefault(); // prevent the default behavior
    launchBall();
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  let now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// adjust the size of the render when the window is resized
window.addEventListener("resize", function () {
  render.canvas.width = Math.min(window.innerWidth, 800);
  render.canvas.height = Math.min(window.innerHeight, 600);
  Render.run(render);
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
    { x: (render.canvas.width / 2) - 25, y: 100 }, // left point
    { x: render.canvas.width / 2, y: 90 }, // top point
    { x: (render.canvas.width / 2) + 25, y: 100 } // right point
  ];
  
  // create the launcher
  const launcher = Bodies.fromVertices(render.canvas.width / 2, 50, vertices, {
    // center the launcher
    isStatic: true,
    render: {
      fillStyle: "#00000000",
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
const pinRadius = 15; // smaller radius for a game like Pachinko
const spacing = 100; // spacing between pins
const rows = 8; // number of rows in the grid

// calculate the start coordinates
const startY = launcher.position.y + launcher.bounds.max.y + spacing * 0.6; // start the pins below the launcher

// calculate the width of the pyramid
const pyramidWidth = (rows * 2 - 1) * spacing;

// calculate the start x-coordinate
const startX = launcher.position.x + launcher.bounds.max.x / 1.08 - pyramidWidth / 2;

for (let i = 0; i < rows; i++) {
    // number of pins in the current row
    const cols = rows - i;

    for (let j = 0; j < cols * 1 - 2; j++) {
        // adjust x position to center the pyramid
        const x = startX + j * spacing + i * spacing / 2;
        const y = startY + i * spacing;
        const pin = Bodies.circle(x, y, pinRadius, {
            isStatic: true,
            restitution: 1.2, // higher value to make the pins more bouncy
            render: {
                fillStyle: "#fff",
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
const borderThickness = 2; // thickness of the borders
const sections = [];
const sectionStartY = render.canvas.height - sectionHeight / 2; // start the sections at the bottom of the canvas
for (let i = 0; i < numSections; i++) {
    let score;
    if (i === Math.floor(numSections / 2)) {
      score = 13; // middle section
    } else if (
      i === Math.floor(numSections / 2) - 1 ||
      i === Math.floor(numSections / 2) + 1
    ) {
      score = 1.2; // sections around the middle one
    } else if (
      i === Math.floor(numSections / 2) - 2 ||
      i === Math.floor(numSections / 2) + 2
    ) {
      score = 0.8; // sections around the previous ones
    } else if (
      i === Math.floor(numSections / 2) - 3 ||
      i === Math.floor(numSections / 2) + 3
    ) {
      score = 0.4; // sections around the previous ones
    } else {
      score = 0.2; // the rest of the sections
    }
  const section = Bodies.rectangle(
    i * sectionWidth + sectionWidth / 2,
    sectionStartY,
    sectionWidth - borderThickness,
    sectionHeight,
    {
      isStatic: true,
      label: "section" + (i + 1), // give each section a unique label
      score: score, // assign a unique score to each section
      render: {
        fillStyle: "#777", // set a fill style to make the sections visible
      },
    }
  );
  sections.push(section);
  if (i < numSections - 1) {
    // don't create a border after the last section
    const border = Bodies.rectangle(
      (i + 1) * sectionWidth - borderThickness / 2,
      sectionStartY,
      borderThickness,
      sectionHeight,
      {
        isStatic: true,
        render: {
          fillStyle: "black", // set a fill style to make the border visible
        },
      }
    );
    sections.push(border);
  }
}
Matter.World.add(engine.world, sections);

// create an array to store all the balls

balls = [];


window.launchBall = function () {
    console.log("launchBall function called");

    let ballCost = parseFloat(document.getElementById('ballCost').value); 

    let ballsToLaunch = Math.floor(score / 50);
    if (ballsToLaunch < 1) ballsToLaunch = 1;
  
    for (let i = 0; i < ballsToLaunch; i++) {
      if (score > ballCost) { // check if the score is greater than the cost of a ball
        score -= ballCost; // subtract the cost of a ball from the score
        document.getElementById("score").textContent =
          "Score: " + score.toFixed(1);
  
        // create a new ball at the current position of the launcher
        let newBall = Bodies.circle(
          launcher.position.x,
          launcher.position.y,
        12,
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
          // add to the score based on the section
          score += section.score * ballCost;
          console.log("Added score: " + section.score); // display the added score in the console
          document.getElementById("score").textContent = "Score: " + score.toFixed(1);
        }
      }
    }
  });

// create a variable to keep track of the score
let score = 50;

// handle collisions
Events.on(engine, "collisionStart", function (event) {
  var pairs = event.pairs;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];

    if (pair.bodyA === ball) {
      console.log("ball collided with " + pair.bodyB.label);
      // update the score based on the section the ball collided with
      if (pair.bodyB.label.startsWith("section")) {
        score += pair.bodyB.score; // use the score assigned to the section
        document.getElementById("score").textContent =
          "Score: " + score.toFixed(1); // update the score display
        Matter.World.remove(engine.world, ball); // remove the ball from the world
        ball = null; // set the ball to null
      }
    } else if (pair.bodyB === ball) {
      console.log("ball collided with " + pair.bodyA.label);
      // update the score based on the section the ball collided with
      if (pair.bodyA.label.startsWith("section")) {
        score += pair.bodyA.score; // use the score assigned to the section
        document.getElementById("score").textContent =
          "Score: " + score.toFixed(1); // update the score display
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
      // update the score based on the section the ball collided with
      if (pair.bodyB.label.startsWith("section")) {
        console.log("Score: " + pair.bodyB.label.slice(7));
      }
    } else if (pair.bodyB === ball) {
      console.log("ball collided with " + pair.bodyA.label);
      // update the score based on the section the ball collided with
      if (pair.bodyA.label.startsWith("section")) {
        console.log("Score: " + pair.bodyA.label.slice(7));
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
