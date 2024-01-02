const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//          CANVAS SIZE
canvas.width = 800;
canvas.height = 470;

const heroImage = new Image();
heroImage.src = "Assets/Player/p1_front.png";

const platformImage = new Image();
platformImage.src = "./Assets/Tiles/stone.png";

// heroImage.onload = () => {
//   // Code to execute after the hero image has loaded
//   console.log("Hero image loaded");
// };

// platformImage.onload = () => {
//   // Code to execute after the platform image has loaded
//   console.log("Platform image loaded");
// };

// Rest of your game logic goes here

//        CONSTANTS
const gravity = 0.5;
const heroSpeed = 5;

//                            CLASSES
//          PLAYER LOGIC
class Player {
  constructor() {
    this.position = {
      x: 100, //just starting hori position
      y: 100, //just starting verti position
    };
    this.velocity = {
      x: 0, //will pull player left right
      y: 0, //this will push player down
    };
    this.width = heroImage.width - 25;
    this.height = heroImage.height - 45;
    this.image = heroImage;
  }
  //draws the rectangle  takes 4 args x,y,width,height
  draw() {
    // ctx.fillStyle = "aqua";
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
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

//      PLATOFRM LOGIC

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x, // 200, was hard coded at first to test
      y, // 200,
    };
    this.width = platformImage.width * 3;
    this.height = platformImage.height * 3;
    this.image = platformImage;
  }
  draw() {
    // ctx.fillStyle = "red";
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
//    COLLISION LOGIC

class CollisionManager {
  static handleCollisions(player, platforms) {
    platforms.forEach((platform) => {
      if (
        //❕1:check if bottom of hero object is same level as top of platform object position.y starts at end using .height to find the feet/bottom of hero.
        player.position.y + player.height <= platform.position.y &&
        //❕2:checks if hero velocity is below or at same level as top of platform.pretty much checking if in near future will direction hero is moving in will match platforms position to check for collision.
        player.position.y + player.height + player.velocity.y >=
          platform.position.y &&
        //❕3:checks if right edge of hero is to right or at same position as left edge of platform.Same as with height but for the x axis
        player.position.x + player.width >= platform.position.x &&
        //❕4:checks if left edge of hero is to left or at same position as right edge of platform.
        player.position.x <= platform.position.x + platform.width
      ) {
        //5: stops vertical veclocity if conditons are met
        player.velocity.y = 0;
      }
    });
  }
}

//    PLAYER CONTROLLER LOGIC
class PlayerController {
  constructor() {
    this.hero = hero;
    this.platforms = platforms;
    this.heroSpeed = heroSpeed;
    this.keys = {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
    };
  }
  handleKeyInputs() {
    if (this.keys.right.pressed && hero.position.x < 400) {
      hero.velocity.x = heroSpeed;
    } else if (this.keys.left.pressed && hero.position.x > 100) {
      hero.velocity.x = -heroSpeed;
    } else {
      hero.velocity.x = 0;
      // gives the illusion of movement
      if (this.keys.right.pressed) {
        scrollOffSet += heroSpeed;
        platforms.forEach((platform) => {
          platform.position.x -= heroSpeed;
        });
      } else if (this.keys.left.pressed) {
        scrollOffSet -= heroSpeed;
        platforms.forEach((platform) => {
          platform.position.x += heroSpeed;
        });
      }
    }
  }
}

//                         CLASS INSTANCES
const hero = new Player();
const platforms = [
  new Platform({ x: -1, y: 400 }), // thats why set it as object above
  new Platform({ x: 210, y: 400 }),
];
const playerController = new PlayerController(hero, platforms, heroSpeed);

let scrollOffSet = 0; // WIN SCENARIO
//            GAME RUN FUNCTION

// this loop is pretty much how tvs works just keep flickering a still image so fast it looks like its actually moving
function animate() {
  requestAnimationFrame(animate); //recursive loop so the game will keep looping like how we'd do a while loop in pygame

  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 4 args x,y,w,h

  platforms.forEach((platform) => {
    platform.draw();
  });
  hero.update();
  playerController.handleKeyInputs();
  CollisionManager.handleCollisions(hero, platforms);
  if (scrollOffSet > 1800) {
    console.log("ya win nerd");
  }
}

//      RUNNING THE GAME
animate();

//      EVENT LISTENERS
let isJumpKeyPressed = false;
//                   destuctrue the event object
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65: // A key LEFT
      playerController.keys.left.pressed = true;
      break;
    case 83: // S key DOWN
      hero.velocity.y += 20;
      break;
    case 68: // D key RIGHT
      playerController.keys.right.pressed = true;
      break;
    case 87: // W key UP
      if (!isJumpKeyPressed && hero.velocity.y <= 1) {
        hero.velocity.y -= 20;
        isJumpKeyPressed = true; // Set the flag
        console.log("Jump");
      } else isJumpKeyPressed = false;
      break;
    default:
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65: // A key LEFT
      playerController.keys.left.pressed = false;
      break;
    case 83: // S key DOWN
      break;
    case 68: // D key RIGHT
      playerController.keys.right.pressed = false;
      break;
    case 87: // W key UP
      console.log("up");
      break;
    default:
      break;
  }
});
