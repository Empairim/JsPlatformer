const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0, //this will push player down
    };
    this.width = 50;
    this.height = 50;
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

    //checks if y height and y axis velocity is less than height it will allow player to fall
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    //else it will stop signifiy player is on ground
    else this.velocity.y = 0;
  }
}

const hero = new Player();
// this loop is pretty much how tvs works just keep flickering a still image so fast it looks like its actually moving
function animate() {
  requestAnimationFrame(animate); //recursive loop so the game will keep looping like how we'd do a while loop in pygame
  // console.log("test");

  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 4 args x,y,w,h
  hero.update();
}

animate();
