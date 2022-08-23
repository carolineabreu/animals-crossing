//get each canvas element, width and height are same as in style.css container

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

// global variables: array with keyboards, game speed each time an animal cross

const grid = 80;
let keys = [];
let score = 0;
let collisionCount = 0;
let frame = 0;
let gameSpeed = 1;

const bikesArr = [];
const boatsArr = [];

//animals

class Animal {
  constructor() {
    this.width = 80;
    this.height = 80;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 40;
    this.moving = false;
    this.frameX = 0;
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

    if (this.y < 0) score();
  }

  draw() {
    ctx3.fillStyle = "purple";
    ctx3.fillRect(this.x, this.y, this.width, this.height);
  }

  walk() {
    console.log("walk");
  }
}

const animal = new Animal();

// utilities - animate (call) animal function

function animation() {
  ctx3.clearRect(0, 0, canvas.width, canvas.height);
  animal.draw();
  animal.update();
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
  animal.moving = false;
});
