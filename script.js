// Select canvas and get context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Set up game variables
const box = 20; // Size of each grid square
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let gameInterval;
let isPaused = false;

// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = Math.min(window.innerHeight * 0.7, 400);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Handle keypress events
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Button controls
upButton.addEventListener("click", () => { if (direction !== "DOWN") direction = "UP"; });
downButton.addEventListener("click", () => { if (direction !== "UP") direction = "DOWN"; });
leftButton.addEventListener("click", () => { if (direction !== "RIGHT") direction = "LEFT"; });
rightButton.addEventListener("click", () => { if (direction !== "LEFT") direction = "RIGHT"; });

playButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
stopButton.addEventListener("click", stopGame);

function startGame() {
    if (!gameInterval) {
        gameInterval = setInterval(drawGame, 150);
    }
}

function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(drawGame, 150);
    } else {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    isPaused = !isPaused;
}

function stopGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    drawGame();
}

// Game loop function
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let newHead = { ...snake[0] };
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    // Check collision with food
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }

    // Check collision with walls or itself
    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height || snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        alert("Game Over! Your Score: " + score);
        stopGame();
    }

    snake.unshift(newHead);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Start the game
startGame();
