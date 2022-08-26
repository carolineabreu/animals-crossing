//get canvas element, width and height are same as in style.css container
// when using canvas, pass context
const canvas = document.getElementsByTagName("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

// global variables: array with keyboards, game speed each time an animal cross, initial score, collision counter

const grid = 80; // grid puts a limit, so the animal doesn't go infinitely to any side
let keys = []; // arrow keys
let frame = 0; //to control what will happen easily 
let score = 0;
let collisionCount = 0;
let gameSpeed = 1; //speed increases each time the animal crosses
let animalSafe = false; // animals are only safe if they're on top of boat or log, otherwise they felt in water 

const bikesArr = [];
const boatsArr = [];


// images
const background1 = new Image();
background1.src = "../img/pixil-frame.png";

const boat = new Image();
boat.src = "../img/boat.png";

const log = new Image();
log.src = "../img/log.png";

const bike = new Image();
bike.src = "../img/bikes.png";
let numberBikes = 4;

const rabbit = new Image();
rabbit.src = "../img/animal.png";

//animals

class Animal {
  constructor() {
    this.width = 60;
    this.height = 60;
    this.imageWidth = 250;
    this.imageHeight = 250;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 40;
    this.moving = false;
    this.frameX = 0; // coordinates of animal image on screen
    this.frameY = 0;
  }

  update() {
    //console.log("update")
    if (keys["ArrowUp"]) {
      if (this.moving === false) {
        this.y -= grid;
        this.moving = true;
        this.frameX = 1;
        this.frameY = 0;
      }
    }

    if (keys["ArrowDown"]) {
      if (this.moving === false && this.y < canvas.height - this.height * 2) {
        this.y += grid;
        this.moving = true;
        this.frameY = 3;
      }
    }

    if (keys["ArrowLeft"]) {
      if (this.moving === false && this.x > this.width) {
        this.x -= grid;
        this.moving = true;
        this.frameY = 2;
      }
    }

    if (keys["ArrowRight"]) {
      if (this.moving === false && this.x < canvas.width - this.width * 2) {
        this.x += grid;
        this.moving = true;
        this.frameY = 1;
      }
    }

    if (this.y < 0) addScore();
  }

  create() {
    ctx.drawImage(rabbit, this.frameX * this.imageWidth, this.frameY * this.imageHeight, this.imageWidth, this.imageHeight, this.x - 25, this.y - 25, this.width * 2, this.height * 2);
  }

  walk() {
    if (this.moving === false) {
      this.frameX = 1;
    } else if (this.frameX === 1) {
      this.frameX = 0;
    }
  }
}

const animal = new Animal();

// obstacles => cars (to not crash in) and boats (to use to reach land)

class Obstacle {
  constructor(x, y, width, height, velocity, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.type = type;
    this.frameX = 0;
    this.frameY = 0;
    this.randomBikes = Math.floor(Math.random() * numberBikes);
  }

  create() {
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.type === "boat") {
      ctx.drawImage(boat, 0, 0, 160, 50, this.x, this.y, this.width, this.height);
    } else if (this.type === "log") {
      ctx.drawImage(log, 0, 0, 160, 50, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(bike, this.frameX * this.width, this.randomBikes * this.height, grid, grid, this.x, this.y, this.height, this.width);
    }
  }

  // multiplication because the cars are in moving in different directions, so the value of velocity can be negative
  // if() the bike has pass through the edge of canvas and it's hidden, restart from left
  update() {
    this.x += this.velocity * gameSpeed;
    if (this.velocity > 0) {
      if (this.x > canvas.width + this.width) {
        this.x = 0 - this.width;
        this.randomBikes = Math.floor(Math.random() * numberBikes);
      }
    } else {
      this.frameX = 1;
      if (this.x < 0 - this.width) {
        this.x = canvas.width + this.width;
        this.randomBikes = Math.floor(Math.random() * numberBikes);
      }
    }
  }
}

function createObstacles() {
  // first street
  for (let i = 0; i < 2; i++) { // creates 2 bikes per street
    let x = i * 350; // each time generates a new bike with different position
    bikesArr.push(new Obstacle(x, canvas.height - grid * 2 - 35, grid, grid, 1, "bike"));
  }
  // second street
  for (let i = 0; i < 3; i++) {
    let x = i * 300;
    bikesArr.push(new Obstacle(x, canvas.height - grid * 3 - 35, grid, grid, 2, "bike"));
  }
  // third street
  for (let i = 0; i < 2; i++) {
    let x = i * 400;
    bikesArr.push(new Obstacle(x, canvas.height - grid * 4 - 35, grid, grid, -2, "bike"));
  }
  // first street - canal
  for (let i = 0; i < 2; i++) {
    let x = i * 400;
    boatsArr.push(new Obstacle(x, canvas.height - grid * 5 - 35, grid * 2, grid, 2, "boat"));
  }
  // second street - canal
  for (let i = 0; i < 3; i++) {
    let x = i * 200;
    boatsArr.push(new Obstacle(x, canvas.height - grid * 6 - 35, grid * 2, grid, -1, "log"));
  }
}

createObstacles();

function handleObstacles() {
  for (let i = 0; i < bikesArr.length; i++) {
    bikesArr[i].update();
    bikesArr[i].create();
  }
  // collision
  for (let i = 0; i < bikesArr.length; i++) {
    if (collision(animal, bikesArr[i])) {
      startOver();
    }
  }

}

function handleBoats() {
  for (let i = 0; i < boatsArr.length; i++) {
    boatsArr[i].create();
    boatsArr[i].update();
  }

  // collision with boats or logs
  if (animal.y < 350 && animal.y > 132) {
    animalSafe = false;

    for (let i = 0; i < boatsArr.length; i++) {
      if (collision(animal, boatsArr[i])) {
        animal.x += boatsArr[i].velocity;
        animalSafe = true;
      }
    }
    if (!animalSafe) {
      startOver();
    }
  }
}

// utilities - animate (call) animal function

function animation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);
  handleBoats();
  animal.create();
  animal.update();
  handleObstacles();
  handleMenu(); // add and update values of score, speed and collisions
  requestAnimationFrame(animation);
}

animation();

// event listener to make move, with arrow keys
window.addEventListener("keydown", function (event) {
  keys = [];
  keys[event.key] = true;
  if (keys["ArrowLeft"] || keys["ArrowUp"] || keys["ArrowRight"] || keys["ArrowDown"]) {
    animal.walk();
  }
});

window.addEventListener("keyup", function (event) {
  delete keys[event.key];
  animal.moving = false; // when keyup, the animal stops walking, so it cannot walk by maintaining keydown
  animal.frameX = 0;
});

function addScore() {
  score++; // every time the animal crosses the top, it scores a point
  gameSpeed += 0.25; // and increases the game speed
  animal.x = canvas.width / 2 - animal.width / 2; // same as declared in class 
  animal.y = canvas.height - animal.height - 40; // Animal
}

// collision
// this way it's a reusable function, instead of collision(animals, bike)
function collision(first, second) {
  // if one of this statements are true, didn't have a collision, function will be true so this => ! make returns false, because didn't have a collision. function Collision === false. If all 4 statements are false the rectangles are overlapping, otherwise one of statements would be true, so the => ! makes return true, function collision it's true, there was a collision.
  return !(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y);
}

function startOver() {
  animal.x = canvas.width / 2 - animal.width / 2;
  animal.y = canvas.height - animal.height - 40;
  score = 0;
  collisionCount++;
  gameSpeed = 1;
}

// draw on canvas score, collisions and speed
function handleMenu() {
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.font = "18px Time New Roman";
  ctx.fillText("Collisions: " + collisionCount, 79, 37);
  ctx.font = "24px Time New Roman";
  ctx.fillText("Score: " + score, 293, 37);
  ctx.font = "18px Time New Roman";
  ctx.fillText("Speed: " + gameSpeed.toFixed(2), 497, 37);
}
