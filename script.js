const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20; // Size of each grid box
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake = [
    { x: Math.floor(canvasWidth / (2 * boxSize)) * boxSize, 
      y: Math.floor(canvasHeight / (2 * boxSize)) * boxSize }
];

let direction = "RIGHT";
let food = generateFood();
let gameInterval;
let gameSpeed = 200; // Default speed

// Listen for difficulty change
document.getElementById("difficulty").addEventListener("change", function() {
    gameSpeed = parseInt(this.value); // Update speed
    resetGame(); // Restart game with new speed
});

// Start the game
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    alert("Game Over! Press Play to restart.");
    resetGame();
}

// Pause the game
function pauseGame() {
    clearInterval(gameInterval);
}

// Reset the game
function resetGame() {
    snake = [
        { x: Math.floor(canvasWidth / (2 * boxSize)) * boxSize, 
          y: Math.floor(canvasHeight / (2 * boxSize)) * boxSize }
    ];
    direction = "RIGHT";
    food = generateFood();
    startGame();
}

// Update game logic
function updateGame() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    // Check collisions with walls
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        stopGame();
        return;
    }

    // Check collision with itself
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            stopGame();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasWidth / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvasHeight / boxSize)) * boxSize
    };
}

// Draw the game
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw snake
    ctx.fillStyle = "lime";
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Button controls
document.getElementById("playButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("stopButton").addEventListener("click", stopGame);

document.getElementById("upButton").addEventListener("click", () => { if (direction !== "DOWN") direction = "UP"; });
document.getElementById("downButton").addEventListener("click", () => { if (direction !== "UP") direction = "DOWN"; });
document.getElementById("leftButton").addEventListener("click", () => { if (direction !== "RIGHT") direction = "LEFT"; });
document.getElementById("rightButton").addEventListener("click", () => { if (direction !== "LEFT") direction = "RIGHT"; });

drawGame();
