const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const character = document.getElementById("character");
let characterTop = 0;
const gravity = 0.5;
//PLAYER
let player = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
};
//GRAVITY

function applyGravity() {
  characterTop += gravity;
  character.style.top = characterTop + "px";

  //   console.log("Character Top:", characterTop);
  // Check if the character has reached the bottom of the webpage
  const windowHeight = window.innerHeight;
  const characterHeight = character.offsetHeight;
  if (characterTop + characterHeight >= windowHeight) {
    // Stop the character from falling further
    characterTop = windowHeight - characterHeight;
    character.style.top = characterTop + "px";
  }

  requestAnimationFrame(applyGravity);
}

//MOVEMENT HANDLE
document.addEventListener("keydown", handlePlayerMovement);

function handlePlayerMovement(event) {
  if (!event) return;
  switch (event.keyCode) {
    case 65: //A Key LEFT
      break;
    case 68: //D Key RIGHT
      break;
    case 32: // Spacebar Key JUMP
      break;
    default: //Ignore any other guess and return nothing
      return;
  }
  // prevents default behavior of key presses
  event.preventDefault();
}

let gameState = {};
function update() {
  // Update the game state here

  // Handle user input
  handlePlayerMovement();

  // Update game objects
  // Example: Move enemies, update their behavior, check for collisions, etc.

  // Perform physics calculations
  // Example: Apply gravity, handle collisions with platforms or walls, etc.
  applyGravity();

  // Update game logic
  // Example: Check for win/lose conditions, update scores, etc.

  // Call the render function to draw the game on the canvas
  render();

  // Call the update function again on the next frame
  requestAnimationFrame(update);
}
// RENDERS WHATS ON THE SCREEN
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   ctx.fillRect(player.x, player.y, 50, 50);
}

//will start out game loop
update();
