// Canvas setup
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;

// Score and Timer
let leftScore = 0;
let rightScore = 0;
let timer = 180; // 3 minutes in seconds
let gameRunning = true;

// Key handling
document.addEventListener("keydown", (e) => {
    if (e.key === "z") leftPaddleSpeed = -6;
    if (e.key === "s") leftPaddleSpeed = 6;
    if (e.key === "ArrowUp") rightPaddleSpeed = -6;
    if (e.key === "ArrowDown") rightPaddleSpeed = 6;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") leftPaddleSpeed = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") rightPaddleSpeed = 0;
});

// Draw elements
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Draw text
function drawText(text, x, y, color, size = 24) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

// Reset ball
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move paddles
    leftPaddleY += leftPaddleSpeed;
    rightPaddleY += rightPaddleSpeed;

    // Prevent paddles from going out of bounds
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ballX <= paddleWidth &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }
    if (
        ballX >= canvas.width - paddleWidth - ballSize &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Scoring
    if (ballX <= 0) {
        rightScore++;
        resetBall();
    }
    if (ballX >= canvas.width) {
        leftScore++;
        resetBall();
    }

    // Draw paddles
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "white");

    // Draw ball
    drawCircle(ballX, ballY, ballSize / 2, "white");

    // Draw scores
    drawText(leftScore, canvas.width / 4, 30, "white", 36);
    drawText(rightScore, (3 * canvas.width) / 4, 30, "white", 36);

    // Draw timer
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    drawText(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`, canvas.width / 2 - 30, 30, "white", 24);

    // Check for game over
    if (leftScore === 21 || rightScore === 21 || timer <= 0) {
        gameRunning = false;
        const winner =
            leftScore === 21
                ? "Left Player"
                : rightScore === 21
                ? "Right Player"
                : leftScore > rightScore
                ? "Left Player"
                : rightScore > leftScore
                ? "Right Player"
                : "Nobody";
        drawText(`${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2, "yellow", 36);
        return;
    }

    // Loop
    requestAnimationFrame(gameLoop);
}

// Timer countdown
function startTimer() {
    const interval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(interval);
            return;
        }
        timer--;
    }, 1000);
}

// Start game
startTimer();
gameLoop();
