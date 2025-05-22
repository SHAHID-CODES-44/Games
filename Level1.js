let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = { x: 15, y: 15 };
let gameInterval;
let score = 0;

// Game canvas and context
const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;  // Grid size for the snake and food
const canvasSize = 400; // Canvas size
canvas.width = canvasSize;
canvas.height = canvasSize;

// Initialize game
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    food = generateFood();
    score = 0;
    document.querySelector('.game-points').textContent = `Score: ${score}`;

    if (gameInterval) clearInterval(gameInterval);  // Clear previous interval if it exists
    gameInterval = setInterval(gameLoop, 300);  // Game loop runs every 100ms
}

// Game loop to update the game state
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFoodCollision()) {
        score += 10;
        document.querySelector('.game-points').textContent = `Score: ${score}`;
        food = generateFood();
        growSnake();  // Grow the snake when it eats food
    }
    drawGame();
}

// Draw game elements (snake and food)
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = '#ffd700';  // Snake color
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
    
    ctx.fillStyle = 'red';  // Food color
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Move the snake based on current direction
function moveSnake() {
    let head = Object.assign({}, snake[0]);
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    // Add new head to snake
    snake.unshift(head);
    snake.pop();  // Remove tail
}

// Grow the snake when it eats food
function growSnake() {
    const newHead = Object.assign({}, snake[0]);
    snake.unshift(newHead);  // Add another segment at the head of the snake
}

// Check if snake collides with walls or itself
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        return true;  // Hit the wall
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;  // Hit itself
        }
    }
    return false;
}

// Check if snake eats the food
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Generate new food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// End game and display a restart option
function endGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score is ${score}`);
}

// Directional controls through buttons
document.querySelectorAll('.touch-controls button').forEach(button => {
    button.addEventListener('click', (event) => {
        const directionPressed = event.target.getAttribute('data-direction');
        changeDirection(directionPressed);
    });
});

// Change the direction of the snake based on button press
function changeDirection(newDirection) {
    if (newDirection === 'up' && direction !== 'down') {
        direction = 'up';
    } else if (newDirection === 'down' && direction !== 'up') {
        direction = 'down';
    } else if (newDirection === 'left' && direction !== 'right') {
        direction = 'left';
    } else if (newDirection === 'right' && direction !== 'left') {
        direction = 'right';
    }
}

// Keyboard controls for arrow keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

// Restart the game
function restartGame() {
    startGame();
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Start the game initially
startGame();