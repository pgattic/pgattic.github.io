const // internal constants
	up = 1
	down = 2
	left = 3
	right = 4

var
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")
	x = 0
	y = 0
	playerDirection = right
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	score = 0
	playerLength = initialPlayerLength
	bodyX = [x]
	bodyY = [y]
	isPaused = true

//PLAYER SETTINGS
function goThroughWallToggle() {
	var checkBox = document.getElementById("gTWall");
	goThroughWall = checkBox.checked;
}

function goThroughBodyToggle() {
	var checkBox = document.getElementById("gTBody");
	goThroughBody = checkBox.checked;
}

//INPUT
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	let playerDirectionTemp = 0;
	if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
		playerDirectionTemp = up;
	}
	if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
		playerDirectionTemp = down;
	}
	if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
		playerDirectionTemp = left;
	}
	if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
		playerDirectionTemp = right;
	}
	if ((playerDirectionTemp == up && playerDirection !== down) || (playerDirectionTemp == down && playerDirection !== up) || (playerDirectionTemp == left && playerDirection !== right) || (playerDirectionTemp == right && playerDirection !== left)) {
		playerDirection = playerDirectionTemp;
	}
	if (e.key == "e" || e.key == "Enter") {
		isPaused = !isPaused;
	}
}


//GAME ENGINE
function drawHead() {
	ctx.beginPath();
	ctx.rect(x, y, unit, unit);
	ctx.fillStyle = playerHeadColor;
	ctx.fill();
	ctx.closePath();
	
}

function drawBody() {
	for (let i = 1; i < playerLength; i++) {
		ctx.beginPath();
		ctx.rect(bodyX[i], bodyY[i], unit, unit);
		ctx.fillStyle = playerBodyColor;
		ctx.fill();
		ctx.closePath();
	}
}

function boundsCheck() {
	if (x >= canvas.width || x < 0 || y >= canvas.height || y < 0) {
		if (!goThroughWall) {
			gameOver();
		} else {
			if (x >= canvas.width) {
				x = 0;
			}
			if (x < 0) {
				x = canvas.width - unit;
			}
			if (y >= canvas.height) {
				y = 0;
			}
			if (y < 0) {
				y = canvas.height - unit;
			}
		}
	}
}

function gameOver() {
	alert("Game Over!\nFood Eaten: " + score + "\nLength: " + playerLength);
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")
	x = 0
	y = 0
	playerDirection = right
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	score = 0
	playerLength = initialPlayerLength
	bodyX = [x]
	bodyY = [y]
	isPaused = false
}

function suicideCheck() {
	if (!goThroughBody) {
		for (let i = 1; i < playerLength; i++) {
			if (bodyX[i] == x && bodyY[i] == y) {
				gameOver();
			}
		}
	}
}

function foodCheck() {
	if (x + unit / 2 == foodX && y + unit / 2 == foodY) {
		score++;
		playerLength = playerLength + growthRate;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
		for (let i = 1; i < playerLength; i++) {
			if (bodyX[i] == foodX && bodyY[i] == foodY) {
				foodFix();
			}
		}
	}
	drawFood();
}

function foodFix() {
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	for (let i = 1; i < playerLength; i++) {
		if (bodyX[i] == foodX && bodyY[i] == foodY) {
			foodFix();
		}
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

function drawScore() {
ctx.font = "bolder "+((unit / 2) + 4)+"px Arial";
ctx.fillStyle = scoreColor;
ctx.fillText(playerLength, x + (unit / 12), y + (unit / 2) + (unit / 12));
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!isPaused) {
		bodyX[0] = x;
		bodyY[0] = y;
		for (let i = playerLength - 1; i > 0; i--) {
			bodyX[i] = bodyX[i - 1];
			bodyY[i] = bodyY[i - 1];
		}
		if (playerDirection == up) {
			y = y - unit;
		} else if (playerDirection == down) {
			y = y + unit;
		} else if (playerDirection == left) {
			x = x - unit;
		} else {
			x = x + unit;
		}
		drawHead();
		drawBody();
		drawFood();
		suicideCheck();
		boundsCheck();
		foodCheck();
		drawScore();
	}
	else {
		drawHead();
		drawBody();
	}
}
var interval = setInterval(draw, gameSpeed);
