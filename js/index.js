//get each canvas element, width and height are same as in style.css container
// when using canvas, pass context
// it could be done with only one canvas but multiple canvas works better for only redraw and clear canvas that have animation happen, to don't have to delete/redraw static things

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const canvas4 = document.getElementById("canvas4");
const ctx4 = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const canvas5 = document.getElementById("canvas5");
const ctx5 = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

// global variables: array with keyboards, game speed each time an animal cross, initial score, collision counter

const grid = 100; // grid puts a limit, so the animal doesn't go infinitely to any side
let keys = []; // arrow keys
let score = 0;
let collisionCount = 0;
let frame = 0; //to control what will happen easily 
let gameSpeed = 1; //speed increases each time the animal crosses

const bikesArr = [];
const boatsArr = [];

//animals

class Animal {
  constructor() {
    this.width = 60;
    this.height = 60;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 40;
    // this.x = canvas.width - this.width - 680; => to start on the left side
    // this.y = canvas.height / 2 - this.height / 2;
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
      }
    }

    if (keys["ArrowDown"]) {
      if (this.moving === false && this.y < canvas.height - this.height * 2) {
        this.y += grid;
        this.moving = true;
      }
    }

    if (keys["ArrowLeft"]) {
      if (this.moving === false && this.x > this.width) {
        this.x -= grid;
        this.moving = true;
      }
    }

    if (keys["ArrowRight"]) {
      if (this.moving === false && this.x < canvas.width - this.width * 2) {
        this.x += grid;
        this.moving = true;
      }
    }

    if (this.y < 0) addScore();
  }

  create() {
    ctx3.fillStyle = "purple";
    ctx3.fillRect(this.x, this.y, this.width, this.height);
  }

  walk() {
    console.log("walk");
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
  }

  create() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.velocity * gameSpeed; // multiplication because the cars are in moving in different directions, so the value of velocity can be negative
  }
}

function createObstacles() {
  for (let i = 0; i < 2; i++) { // creates 3 bikes per street
    let x = i * 350; // each time generates a new bike with different position
    bikesArr.push(new Obstacle(x, canvas.height - grid * 2 - 35, grid, grid, 1, "bike"));
  }
}

createObstacles();

function handleObstacles() {
  for (let i = 0; i < bikesArr.length; i++) {
    bikesArr[i].create();
    bikesArr[i].update();
  }
}

// utilities - animate (call) animal function

function animation() {
  ctx3.clearRect(0, 0, canvas.width, canvas.height);
  animal.create();
  animal.update();
  handleObstacles();
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
});

function addScore() {
  score++; // every time the animal crosses the top, it scores a point
  gameSpeed += 0.05; // and increases the game speed
  animal.x = canvas.width / 2 - animal.width / 2; // same as declared in class 
  animal.y = canvas.height - animal.height - 40; // Animal
}
