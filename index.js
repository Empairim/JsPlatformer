const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//          CANVAS SIZE
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//        CONSTANTS
const gravity = 0.5;
const heroSpeed = 5;

//          PLAYER LOGIC
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0, //will pull player left right
      y: 0, //this will push player down
    };
    this.width = 30;
    this.height = 30;
  }
  //draws the rectangle  takes 4 args x,y,width,height
  draw() {
    ctx.fillStyle = "aqua";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  //to change player functions over time
  update() {
    this.draw();
    //this is going ot connect Player Y to velocity Y then add to it
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //checks if y height and y axis velocity is less than height it will allow player to fall
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    //else it will stop signifiy player is on ground
    else this.velocity.y = 0;
  }
}

//    PLAYER INSTANCE
const hero = new Player();
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

//            GAME RUN FUNCTION
// this loop is pretty much how tvs works just keep flickering a still image so fast it looks like its actually moving
function animate() {
  requestAnimationFrame(animate); //recursive loop so the game will keep looping like how we'd do a while loop in pygame
  // console.log("test");

  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 4 args x,y,w,h
  hero.update();
  if (keys.right.pressed) {
    hero.velocity.x = heroSpeed;
  } else if (keys.left.pressed) {
    hero.velocity.x = -heroSpeed;
  } else hero.velocity.x = 0;
}

//      RUNNING THE GAME
animate();

//      EVENT LISTENERS
//                   destuctrue the event object
addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 65: // A key LEFT
      keys.left.pressed = true;
      break;
    case 83: // S key DOWN
      hero.velocity.y += 20;
      break;
    case 68: // A key RIGHT
      keys.right.pressed = true;
      break;
    case 87: // A key UP
      hero.velocity.y -= 20;
      console.log("up");

      break;

    default:
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 65: // A key LEFT
      // hero.velocity.x = 0;
      keys.left.pressed = false;
      break;
    case 83: // S key DOWN
      break;
    case 68: // A key RIGHT
      // hero.velocity.x = 0;
      keys.right.pressed = false;
      break;
    case 87: // A key UP
      console.log("up");

      break;

    default:
      break;
  }
});
