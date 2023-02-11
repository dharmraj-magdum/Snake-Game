const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
//game borad canvas related
const ctx = gameBoard.getContext("2d");
const unitSize = 25;
const gameWidth = Math.floor(gameBoard.width / unitSize) * unitSize;
const gameHeight = Math.floor(gameBoard.height / unitSize) * unitSize;

//theme variables
const boardBackground = "#425462";
const snakeColor = "#88FF55";
const snakeBorder = "#333333";
const foodColor = "#F17475";
const textColor = "#F8F8F8";
//game variables
var running = false;
var xVelocity = 0;
var yVelocity = 0;
var foodX;
var foodY;
var score = 0;
var snake = [];

//add listener on window for keypess to change
window.addEventListener("keydown", changeDirection);
//on restart buton to restart
resetBtn.addEventListener("click", resetGame);

function gameStart() {
	createFood();
	drawFood();
	nextTick();
}

function nextTick() {
	if (running) {
		//here delay is actual frame rate like
		//ie after specified milsec update happens
		setTimeout(() => {
			clearBoard();
			moveSnake();
			drawSnake();
			drawFood();
			checkGameOver();
			//resursive ticks
			nextTick();
		}, 130);
	} else {
		drawSnake();
		displayGameOver();
	}
}
function clearBoard() {
	ctx.fillStyle = boardBackground;
	ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
	function randomFood(max) {
		const randNum = Math.round((Math.random() * max) / unitSize) * unitSize;
		// first dividing then multiply gives round off whole co-ords
		return randNum;
	}
	foodX = randomFood(gameWidth - unitSize);
	foodY = randomFood(gameHeight - unitSize);
}
function drawFood() {
	ctx.fillStyle = foodColor;
	ctx.fillRect(foodX, foodY, unitSize, unitSize);
	// ctx.fillStyle = foodColor;
	// ctx.arc(foodX, foodY, unitSize, 0, 2 * Math.PI);
	// ctx.fill();
}
function moveSnake() {
	const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

	//move head to new place
	//by adding new head to start of snake
	snake.unshift(head);
	//if food is eaten
	if (snake[0].x == foodX && snake[0].y == foodY) {
		score += 1;
		scoreText.textContent = score;
		createFood();
	} else {
		//remove last node/part of snake
		snake.pop();
	}
}
function drawSnake() {
	//this to show where the player mistake
	if (!running) {
		//head color is diff
		ctx.fillStyle = "#F15050";
		ctx.strokeStyle = snakeBorder;
		ctx.fillRect(
			snake[0].x - xVelocity,
			snake[0].y - yVelocity,
			unitSize,
			unitSize
		);
		ctx.strokeRect(
			snake[0].x - xVelocity,
			snake[0].y - yVelocity,
			unitSize,
			unitSize
		);
	} else {
		//normaly moving
		//head color is diff
		ctx.fillStyle = "#858243";
		ctx.strokeStyle = snakeBorder;
		ctx.fillRect(snake[0].x, snake[0].y, unitSize, unitSize);
		ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);
		ctx.fillStyle = snakeColor;
		for (let i = 1; i < snake.length; i++) {
			ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
			ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);
		}
	}
}
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
function changeDirection(event) {
	const keyPressed = event.keyCode;
	switch (true) {
		case keyPressed == LEFT && !xVelocity:
			xVelocity = -unitSize;
			yVelocity = 0;
			break;
		case keyPressed == RIGHT && !xVelocity:
			xVelocity = unitSize;
			yVelocity = 0;
			break;
		case keyPressed == UP && !yVelocity:
			xVelocity = 0;
			yVelocity = -unitSize;
			break;
		case keyPressed == DOWN && !yVelocity:
			xVelocity = 0;
			yVelocity = unitSize;
			break;
	}
}
function checkGameOver() {
	//crash with wall
	switch (true) {
		case snake[0].x < 0:
			running = false;
			break;
		case snake[0].x >= gameWidth:
			running = false;
			break;
		case snake[0].y < 0:
			running = false;
			break;
		case snake[0].y >= gameHeight:
			running = false;
			break;
	}
	//collied with body
	//if any body part match with head meaning head is collieded
	for (let i = 1; i < snake.length; i += 1) {
		if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
			running = false;
		}
	}
}
function displayGameOver() {
	resetBtn.style.visibility = "visible";
	ctx.font = `${unitSize * 2}px MV Boli`;
	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
	running = false;
}
function resetGame() {
	running = true;
	score = 0;
	scoreText.textContent = score;

	snake = [
		{ x: unitSize * 4, y: 0 },
		{ x: unitSize * 3, y: 0 },
		{ x: unitSize * 2, y: 0 },
		{ x: unitSize, y: 0 },
		{ x: 0, y: 0 },
	];
	//initialy start from top-left corner moving right side
	xVelocity = unitSize;
	yVelocity = 0;
	resetBtn.textContent = "Restart";
	resetBtn.style.visibility = "hidden";
	gameStart();
}
