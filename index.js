const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//          CANVAS SIZE
canvas.width = 800;
canvas.height = 470;
const platFromPath = ".Assets/Tiles/";
//         IMAGES

// so I dont have to repeat new Image() everytime I need one.
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
const heroImage = createImage("./Assets/Player/p1_front.png");
const platformImage = createImage(
  "./Platform Game Assets/Tiles/png/128x128/Dirt.png"
);
const box = createImage("./Assets/Tiles/box.png");
const dirt = createImage("./Assets/Tiles/dirt.png");
const grass = createImage("./Platform Game Assets/Tiles/png/128x128/Grass.png");
const stone = createImage("./Assets/Tiles/stone.png");
const snow = createImage("./Assets/Tiles/snow.png");
const backgroundImage = createImage(
  "./Platform Game Assets/Background/png/1920x1080/Background/Background.png"
);
const treeImage = createImage(
  "./Legacy-Fantasy - High Forest 2.3/Trees/Background.png"
);

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
    this.width = heroImage.width / 2;
    this.height = heroImage.height / 2;
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
  constructor({ x, y, image, width, height }) {
    this.position = {
      x, // 200, was hard coded at first to test
      y, // 200,
    };
    this.width = width || platformImage.width * 2;
    this.height = height || platformImage.height * 2;
    this.image = image || platformImage;
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

// GENERIC OBJECTS/ SCENE
//new class so scene wont have collision
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
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
  new Platform({ x: -1, y: 420, image: grass, width: 500, height: 50 }), // thats why set it as object above
  // new Platform({ x: 100, y: 420 }),
  // new Platform({ x: 200, y: 420 }),
  // new Platform({ x: 700, y: 420 }),
  new Platform({ x: 100, y: 100, image: dirt, width: 500, height: 100 }),
];
const playerController = new PlayerController(hero, platforms, heroSpeed);

const genericObjects = [
  new GenericObject({ x: 0, y: -80, image: backgroundImage }),
  // new GenericObject({ x: 0, y: 0, image: treeImage }),
];

//        GAME LOGIC
let scrollOffSet = 0; // WIN SCENARIO
//            GAME RUN FUNCTION

// this loop is pretty much how tvs works just keep flickering a still image so fast it looks like its actually moving
function animate() {
  requestAnimationFrame(animate); //recursive loop so the game will keep looping like how we'd do a while loop in pygame

  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 4 args x,y,w,h
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

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
