const // internal constants
	up = 1
	down = 2
	left = 3
	right = 4

var
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")
	player1 = {
		startX : 0,
		startY : 0,
		x : 0,
		y : 0,
		direction : right,
		startDirection : right,
		length : initialPlayerLength,
		score : 0,
		bodyX : [-24],
		bodyY : [0],
		color : "blue",
	}

	player2 = {
		startX : 1176,
		startY : 0,
		x : 1276,
		y : 0,
		direction : left,
		startDirection : left,
		length : initialPlayerLength,
		score : 0,
		bodyX : [1200],
		bodyY : [0],
		color : "red",
	}

	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	isPaused = true

//INPUT
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	if (e.key == "w") {
		player1.direction = up;
	}
	if (e.key == "s") {
		player1.direction = down;
	}
	if (e.key == "a") {
		player1.direction = left;
	}
	if (e.key == "d") {
		player1.direction = right;
	}
	if (e.key == "Up" || e.key == "ArrowUp") {
		player2.direction = up;
	}
	if (e.key == "Down" || e.key == "ArrowDown") {
		player2.direction = down;
	}
	if (e.key == "Left" || e.key == "ArrowLeft") {
		player2.direction = left;
	}
	if (e.key == "Right" || e.key == "ArrowRight") {
		player2.direction = right;
	}
	if (e.key == " " || e.key == "Enter") {
		isPaused = !isPaused;
	}
}


//GAME ENGINE
function playerLocation(playerN) {
	playerN.bodyX[0] = playerN.x;
	playerN.bodyY[0] = playerN.y;
	for (let i = playerN.length - 1; i > 0; i--) {
		playerN.bodyX[i] = playerN.bodyX[i - 1];
		playerN.bodyY[i] = playerN.bodyY[i - 1];
	}
	if (playerN.direction == up) {
		playerN.y -=  unit;
	} else if (playerN.direction == down) {
		playerN.y += unit;
	} else if (playerN.direction == left) {
		playerN.x -= unit;
	} else {
		playerN.x += unit;
	}
}

function drawHead(playerN) {
	ctx.beginPath();
	ctx.rect(playerN.x, playerN.y, unit, unit);
	ctx.fillStyle = playerN.color;
	ctx.fill();
	ctx.closePath();
	
}

function drawBody(playerN) {
	for (let i = 1; i < playerN.length; i++) {
		ctx.beginPath();
		ctx.rect(playerN.bodyX[i], playerN.bodyY[i], unit, unit);
		ctx.fillStyle = playerN.color;
		ctx.fill();
		ctx.closePath();
	}
}

function boundsCheck(playerN) {
	if (playerN.x >= canvas.width || playerN.x < 0 || playerN.y >= canvas.height || playerN.y < 0) {
		gameOver(playerN);
	}
}

function gameOver(playerN) {
	playerN.x = playerN.startX;
	playerN.y = playerN.startY;
	playerN.direction = playerN.startDirection;
	playerN.score = 0;
	playerN.length = initialPlayerLength;
	playerN.bodyX = [playerN.x];
	playerN.bodyY = [playerN.y];
	isPaused = false;
}

function suicideCheck() {
	for (let i = 1; i < player1.length; i++) {
		if (player1.bodyX[i] == player1.x && player1.bodyY[i] == player1.y) {
			gameOver(player1);
		}
	}
	for (let i = 1; i < player2.length; i++) {
		if (player2.bodyX[i] == player2.x && player2.bodyY[i] == player2.y) {
			gameOver(player2);
		}
	}
	for (let i = 1; i < player1.length; i++) {
		if (player1.bodyX[i] == player2.x && player1.bodyY[i] == player2.y) {
			gameOver(player2);
			player1.length += 5;
		}
	}
	for (let i = 1; i < player2.length; i++) {
		if (player2.bodyX[i] == player1.x && player2.bodyY[i] == player1.y) {
			gameOver(player1);
			player2.length += 5;
		}
	}
}

function foodCheck(playerN) {
	if (playerN.x + unit / 2 == foodX && playerN.y + unit / 2 == foodY) {
		playerN.score++;
		playerN.length += growthRate;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	}
	drawFood();
}

function drawFood() {
	ctx.beginPath();
	ctx.arc(foodX, foodY, (unit / 2), 0, Math.PI * 2, false);
	ctx.fillStyle = foodColor;
	ctx.fill();
	ctx.closePath();
}

function drawScore(playerN) {
ctx.font = "bolder "+((unit / 2) + 4)+"px Arial";
ctx.fillStyle = scoreColor;
ctx.fillText(playerN.length, playerN.x + (unit / 12), playerN.y + (unit / 2) + (unit / 12));
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!isPaused) {
		drawFood();

		playerLocation(player1);
		boundsCheck(player1);
		foodCheck(player1);
		drawHead(player1);
		drawBody(player1);
		drawScore(player1);

		playerLocation(player2);
		suicideCheck();
		boundsCheck(player2);
		drawHead(player2);
		foodCheck(player2);
		drawBody(player2);
		drawScore(player2);
	}
	else {
		drawHead(player1);
		drawBody(player1);
		drawHead(player2);
		drawBody(player2);
	}
}
var interval = setInterval(draw, gameSpeed);
