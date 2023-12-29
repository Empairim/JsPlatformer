const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.width = 50;
    this.height = 50;
  }
  //draws the rectangle  takes 4 args x,y,with,height
  draw() {
    ctx.fillStyle = "aqua";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const hero = new Player();
hero.draw();
