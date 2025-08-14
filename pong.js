const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// Paddle settings
const paddleWidth = 10, paddleHeight = 80, paddleMargin = 10;
let playerY = height / 2 - paddleHeight / 2;
let computerY = height / 2 - paddleHeight / 2;
const paddleSpeed = 6;

// Ball settings
let ballX = width / 2, ballY = height / 2;
let ballRadius = 8;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);

// Score
let playerScore = 0, computerScore = 0;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function draw() {
  // Clear field
  drawRect(0, 0, width, height, '#111');
  drawNet();

  // Left paddle (player)
  drawRect(paddleMargin, playerY, paddleWidth, paddleHeight, '#fff');
  // Right paddle (computer)
  drawRect(width - paddleMargin - paddleWidth, computerY, paddleWidth, paddleHeight, '#fff');

  // Ball
  drawCircle(ballX, ballY, ballRadius, '#fff');
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY - ballRadius < 0) {
    ballY = ballRadius;
    ballSpeedY = -ballSpeedY;
  }
  if (ballY + ballRadius > height) {
    ballY = height - ballRadius;
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (
    ballX - ballRadius < paddleMargin + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballX = paddleMargin + paddleWidth + ballRadius;
    ballSpeedX = -ballSpeedX;
    // Add effect based on hit position
    let hitPos = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Right paddle collision (computer)
  if (
    ballX + ballRadius > width - paddleMargin - paddleWidth &&
    ballY > computerY &&
    ballY < computerY + paddleHeight
  ) {
    ballX = width - paddleMargin - paddleWidth - ballRadius;
    ballSpeedX = -ballSpeedX;
    let hitPos = (ballY - (computerY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Left wall (computer scores)
  if (ballX - ballRadius < 0) {
    computerScore++;
    updateScore();
    resetBall();
  }
  // Right wall (player scores)
  if (ballX + ballRadius > width) {
    playerScore++;
    updateScore();
    resetBall();
  }
}

function moveComputer() {
  // Simple AI: move towards ball
  let target = ballY - paddleHeight / 2;
  if (computerY < target) computerY += paddleSpeed;
  else if (computerY > target) computerY -= paddleSpeed;

  // Boundaries
  computerY = Math.max(0, Math.min(height - paddleHeight, computerY));
}

function updateScore() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);
}

function gameLoop() {
  moveBall();
  moveComputer();
  draw();
  requestAnimationFrame(gameLoop);
}
draw(); // Initial draw

// Mouse controls
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  playerY = Math.max(0, Math.min(height - paddleHeight, playerY));
});

// Keyboard controls
window.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') {
    playerY -= paddleSpeed * 2;
    playerY = Math.max(0, playerY);
  }
  if (e.key === 'ArrowDown') {
    playerY += paddleSpeed * 2;
    playerY = Math.min(height - paddleHeight, playerY);
  }
});

updateScore();
gameLoop();
