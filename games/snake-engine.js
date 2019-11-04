const // internal constants
	up = 1
	left = 2
	down = 3
	right = 4
	startX = unit / 2
	startY = unit / 2

var
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")
	playerDirection = right
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	score = 0
	playerLength = initialPlayerLength
	bodyX = [startX]
	bodyY = [startY]
	isPaused = true

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

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
	playerDirectionTemp = 5;
	if (!isPaused) {
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
		if (Math.abs(playerDirectionTemp - playerDirection) !== 2) {
			playerDirection = playerDirectionTemp;
		}
	}
	if (e.key == "e" || e.key == "Enter" || e.key == " ") {
		isPaused = !isPaused;
	}
}


//GAME ENGINE
function movePlayer() {
	for (let i = playerLength - 1; i > 0; i--) {
		bodyX[i] = bodyX[i - 1];
		bodyY[i] = bodyY[i - 1];
	}
	if (playerDirection == up) {
		bodyY[0] -= unit;
	} else if (playerDirection == down) {
		bodyY[0] += unit;
	} else if (playerDirection == left) {
		bodyX[0] -= unit;
	} else {
		bodyX[0] += unit;
	}
}

function gameOver() {
	alert("Game Over!\nFood Eaten: " + score + "\nLength: " + playerLength);
	playerDirection = right;
	score = 0;
	playerLength = initialPlayerLength;
	bodyX = [startX];
	bodyY = [startY];
}

function suicideCheck() {
	if (!goThroughBody) {
		for (let i = 1; i <= playerLength; i++) {
			if (bodyX[0] == bodyX[i] && bodyY[0] == bodyY[i]) {
				gameOver();
			}
		}
	}
}

function boundsCheck() {
	if (bodyX[0] >= canvas.width || bodyX[0] < 0 || bodyY[0] >= canvas.height || bodyY[0] < 0) {
		if (!goThroughWall) {
			gameOver();
		} else {
			if (bodyX[0] >= canvas.width) {
				bodyX[0] = unit / 2;
			}
			if (bodyX[0] < 0) {
				bodyX[0] = canvas.width - unit / 2;
			}
			if (bodyY[0] >= canvas.height) {
				bodyY[0] = unit / 2;
			}
			if (bodyY[0] < 0) {
				bodyY[0] = canvas.height - unit / 2;
			}
		}
	}
}

function foodCheck() {
	if (bodyX[0] == foodX && bodyY[0] == foodY) {
		score++;
		playerLength += growthRate;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	}
	drawFood();
}

function drawBody() {
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = unit - 2;
	ctx.strokeStyle = playerColor;
	ctx.moveTo(bodyX[0], bodyY[0]);
	for (let i = 1; i < playerLength; i++) {
		if ((bodyX[i-1] !== bodyX[i+1] | bodyX[i]) && (bodyY[i-1] !== bodyY[i+1] | bodyY[i])) {
			ctx.lineTo(bodyX[i], bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(bodyX[i], bodyY[i]);
		}
	}
	ctx.lineWidth = unit - 1;
	ctx.strokeStyle = playerColor;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.lineWidth = unit / 3;
	ctx.lineCap = "round";
	ctx.strokeStyle = playerLineColor;
	ctx.moveTo(bodyX[0], bodyY[0]);
	for (let i = 1; i < playerLength; i++) {
		if ((bodyX[i-1] !== bodyX[i+1] | bodyX[i]) && (bodyY[i-1] !== bodyY[i+1] | bodyY[i])) {
			ctx.lineTo(bodyX[i], bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(bodyX[i], bodyY[i]);
		}
	}
	ctx.lineWidth = unit - 1;
	ctx.strokeStyle = playerColor;
	ctx.stroke();
	ctx.closePath();
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
	ctx.textAlign = "center";
	ctx.fillText(playerLength, bodyX[0], bodyY[0] + (unit / 12));
}

function draw() {
	if (!isPaused) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		movePlayer();
		suicideCheck();
		boundsCheck();
		foodCheck();
		drawBody();
		drawFood();
		drawScore();
	}
}
var interval = setInterval(draw, gameSpeed);
