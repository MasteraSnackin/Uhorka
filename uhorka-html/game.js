const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Textures
const backgroundTexture = new Image();
backgroundTexture.src = 'assets/dlhyy_level.png'; // Replace with your image path

const playerTexture = new Image();
playerTexture.src = 'assets/uhorka_leti2.png'; // Replace with your image path

const obstacleTexture = new Image();
obstacleTexture.src = 'assets/Preview_107.png'; // Replace with your image path


let playerY = canvas.height / 4; // Start position for the player
const playerWidth = 20;
const playerHeight = 20;
const speed = 2; // Speed of the obstacles moving towards the player
let obstacles = []; // Array to hold the obstacles
let score = 0;

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // Teleport the player to the bottom or top line
    playerY = (playerY === canvas.height - 80) ? canvas.height - 250 : canvas.height - 80;
  }
});

let lastObstacleFromTop = false; // Initial state for the first obstacle

function createObstacle() {
  let height = Math.random() * (canvas.height / 3);
  //let xDistance = Math.random() * 50 + 50; // Random distance between 50 and 100

  let obstacle = {
    x: canvas.width, //(obstacles.length > 0 ? obstacles[obstacles.length - 1].x : canvas.width) + xDistance, // Position based on the last obstacle plus random distance
    y: lastObstacleFromTop ? canvas.height - height : 0, // Alternate based on the last obstacle's position
    width: 10,
    height: height
  };

  lastObstacleFromTop = !lastObstacleFromTop; // Toggle the position for the next obstacle
  obstacles.push(obstacle);
}

let lastObstacleTime = Date.now();
const obstacleCreationInterval = 2000; // Time in milliseconds between each new obstacle

// Define the background position and speed
let backgroundX = 0;
const backgroundSpeed = -2; // Change this value to control the speed of the background movement


function updateGame() {
  // Calculate the new position of the background
  backgroundX -= backgroundSpeed;

  // If the background has moved past its width, reset the backgroundX to 0
  if (backgroundX >= backgroundTexture.width) {
    backgroundX = 0;
  }

   // Clear the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);
 
   // Draw the background texture twice for the looping effect
   ctx.drawImage(backgroundTexture, -backgroundX, 0, 3455, canvas.height);
   // Draw the second image when the first one gets to the end
   if (backgroundX > 0) {
     ctx.drawImage(backgroundTexture, backgroundTexture.width - backgroundX, 0, 3455, canvas.height);
   }

 // Draw the player with texture
ctx.drawImage(playerTexture, canvas.width / 2 - playerWidth * 6.5, playerY - playerHeight * 0.72, 145, 50);

  // Draw the obstacles
  ctx.fillStyle = 'red';
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= speed;
    ctx.drawImage(obstacleTexture, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

    // Check for collision
    if (obstacles[i].x < canvas.width / 2 + playerWidth / 2 &&
        obstacles[i].x + obstacles[i].width > canvas.width / 2 - playerWidth / 2 &&
        playerY - playerHeight / 2 < obstacles[i].y + obstacles[i].height &&
        playerY + playerHeight / 2 > obstacles[i].y) {
      // Collision detected, end the game or reduce life
      //alert('Game Over! Score: ' + score);
      document.location.reload();
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  // Increase score
  score++;

  // Draw the score
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 8, 20);

  // Check if it's time to create a new obstacle
  if (Date.now() - lastObstacleTime > obstacleCreationInterval) {
    createObstacle();
    lastObstacleTime = Date.now(); // Update the last obstacle creation time
  }

  requestAnimationFrame(updateGame);
}

// Start the game
//createObstacle();
updateGame();