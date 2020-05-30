const // internal constants
	up = 1
	left = 2
	down = 3
	right = 4

// user-friendly vars
	gameSpeed = 75 // Milliseconds per frame. Therefore, a higher number is a slower game.
	unit = 24 // The unit used for calculating the width of the player's body and the size of the food. It is recommended to be a factor of 600.
	foodColor = "#b0b"
	foodLineColor = "#f0f"
	growthRate = 5 // How much you grow from getting food.
	scoreColor = "black"
	initialPlayerLength = 5
	
	pauseKey1 = " "
	pauseKey2 = "Enter"

var
	canvas = document.getElementById("Snake")
	dimension = [Math.floor(document.documentElement.clientWidth / unit) * unit, Math.floor(document.documentElement.clientHeight / unit) * unit];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d");

	player1 = {
		inGame : true,
		startX : unit / 2,
		startY : unit / 2,
		direction : [right],
		dirTemp : right,
		startDirection : right,
		size : initialPlayerLength,
		bodyX : [-unit],
		bodyY : [0],
		color : "#00b",
		lineColor : "#33f",
		upKey1 : "w",
		upKey2 : "ArrowUp",
		downKey1 : "s",
		downKey2 : "ArrowDown",
		leftKey1 : "a",
		leftKey2 : "ArrowLeft",
		rightKey1 : "d",
		rightKey2 : "ArrowRight",
//		spawnKey : "1",
	}

	dimension = [Math.floor(document.documentElement.clientWidth / unit) * unit, Math.floor(document.documentElement.clientHeight / unit) * unit];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	foodFailure = false
	isPaused = false

gameOver();

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

//INPUT
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	doKeys(e);
	if (e.key == pauseKey1 || e.key == pauseKey2) {
		isPaused = !isPaused;
	}
}

function doKeys(e) {
	if (player1.inGame || !isPaused) {
		if (e.key == player1.upKey1 || e.key == player1.upKey2) {
			player1.dirTemp = up;
		}
		if (e.key == player1.downKey1 || e.key == player1.downKey2) {
			player1.dirTemp = down;
		}
		if (e.key == player1.leftKey1 || e.key == player1.leftKey2) {
			player1.dirTemp = left;
		}
		if (e.key == player1.rightKey1 || e.key == player1.rightKey2) {
			player1.dirTemp = right;
		}
		if (Math.abs(player1.direction[player1.direction.length - 1] - player1.dirTemp) !== 2 && player1.direction[player1.direction.length - 1] !== player1.dirTemp) {
			player1.direction.push(player1.dirTemp);
		}
	}
/*	if (e.key == player1.spawnKey) {
		player1.inGame = !player1.inGame;
		gameOver();
	}*/
}


//GAME ENGINE
function calculate1() {
	if (player1.inGame) {
		playerLocation();
		boundsCheck();
		foodCheck();
	}
}

function playerLocation() {
	if (player1.direction.length > 1) {
		player1.direction.shift();
	}
	if (player1.direction[0] == up) {
		player1.bodyX.unshift(player1.bodyX[0]);
		player1.bodyY.unshift(player1.bodyY[0] - unit);
	} else if (player1.direction[0] == down) {
		player1.bodyX.unshift(player1.bodyX[0]);
		player1.bodyY.unshift(player1.bodyY[0] + unit);
	} else if (player1.direction[0] == left) {
		player1.bodyX.unshift(player1.bodyX[0] - unit);
		player1.bodyY.unshift(player1.bodyY[0]);
	} else {
		player1.bodyX.unshift(player1.bodyX[0] + unit);
		player1.bodyY.unshift(player1.bodyY[0]);
	}
	while (player1.bodyX.length > player1.size) {
		player1.bodyX.pop();
	}
	while (player1.bodyY.length > player1.size) {
		player1.bodyY.pop();
	}
}

function boundsCheck() {
	if (player1.bodyX[0] >= canvas.width || player1.bodyX[0] < 0 || player1.bodyY[0] >= canvas.height || player1.bodyY[0] < 0) {
		gameOver();
	}
}

function gameOver() {
	var i;
	var n = player1.size;
	for (i = 0; i < n; i++) {
		player1.bodyX[i] = NaN;
		player1.bodyY[i] = NaN;
	}
	for (i = 0; i < initialPlayerLength; i++) {
		player1.bodyX[i] = player1.startX;
		player1.bodyY[i] = player1.startY;
	}
	player1.direction = [player1.startDirection];
	player1.dirTemp = player1.startDirection;
	player1.size = initialPlayerLength;
}

function foodCheck() {
	if (player1.bodyX[0] == foodX && player1.bodyY[0] == foodY) {
		player1.size += growthRate;
		foodFailure = true;
		redoFood();
	}
	drawFood();
}

function redoFood() {
	while (foodFailure) {
		foodFailure = false;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2;
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2;
		foodCheck2();
	}
}

function foodCheck2() {
	if (player1.inGame) {
		var i;
		var s = player1.size;
		for (i = 0; i < s; i++) {
			if (player1.bodyX[i] == foodX && player1.bodyY[i] == foodY) {
				foodFailure = true;
			}
		}
	}
}

function calculate2() {
	var i;
	var n = player1.size;
	for (i = 1; i < n; i++) {
		if (player1.bodyX[i] == player1.bodyX[0] && player1.bodyY[i] == player1.bodyY[0]) {
			gameOver();
		}
	}
}

function drawGrid() {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "lightgray";
	var i;
	var w = canvas.width / unit;
	var h = canvas.height / unit;
	for (i = 0; i <= w; i++) {
		ctx.beginPath();
		ctx.moveTo(i * unit, 0);
		ctx.lineTo(i * unit, canvas.height);
		ctx.stroke();
		ctx.closePath();
	}
	for (i = 0; i <= h; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * unit);
		ctx.lineTo(canvas.width, i * unit);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
}

function drawFood() {
	ctx.beginPath();
	ctx.arc(foodX, foodY, (unit / 2) - 1, 0, Math.PI * 2, false);
	ctx.fillStyle = foodColor;
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(foodX, foodY, unit / 4, 0, Math.PI * 2, false);
	ctx.fillStyle = foodLineColor;
	ctx.fill();
	ctx.closePath();
}

function display() {
	if (player1.inGame) {
		drawLine();
		drawScore();
	}
}

function drawLine() {
	var i;
	var n = player1.size;

	if (player1.size > (canvas.width / unit) * (canvas.height / unit)) {
		player1.size = (canvas.width / unit) * (canvas.height / unit);
	}
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = unit - 2;
	ctx.strokeStyle = player1.color;
	ctx.moveTo(player1.bodyX[0], player1.bodyY[0]);
	for (i = 1; i < n; i++) {
		if ((player1.bodyX[i-1] !== player1.bodyX[i+1] | player1.bodyX[i]) && (player1.bodyY[i-1] !== player1.bodyY[i+1] | player1.bodyY[i])) {
			ctx.lineTo(player1.bodyX[i], player1.bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(player1.bodyX[i], player1.bodyY[i]);
		}
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = unit / 2;
	ctx.strokeStyle = player1.lineColor;
	ctx.moveTo(player1.bodyX[0], player1.bodyY[0]);
	for (i = 1; i < n; i++) {
		if ((player1.bodyX[i-1] !== player1.bodyX[i+1] || player1.bodyX[i]) && (player1.bodyY[i-1] !== player1.bodyY[i+1] || player1.bodyY[i])) {
			ctx.lineTo(player1.bodyX[i], player1.bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(player1.bodyX[i], player1.bodyY[i]);
		}
	}
	ctx.stroke();
	ctx.closePath();
}

function drawScore() {
	ctx.font = "bolder "+((unit / 2) + 4)+"px Arial";
	ctx.fillStyle = scoreColor;
	ctx.textAlign = "center";
	ctx.fillText(player1.size, player1.bodyX[0], player1.bodyY[0] + (unit / 12));
}

function draw() {
	if (canvas.width != Math.floor(document.documentElement.clientWidth / unit) * unit || canvas.height != Math.floor(document.documentElement.clientHeight / unit) * unit) {
		dimension = [Math.floor(document.documentElement.clientWidth / unit) * unit, Math.floor(document.documentElement.clientHeight / unit) * unit];
		canvas.width = dimension[0];
		canvas.height = dimension[1];
		if (foodX > canvas.width || foodY > canvas.height) {
			foodFailure = true;
			redoFood();
		}
	}
	if (!isPaused) {
		calculate1();
		calculate2();
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	drawFood();
	display();
}

var interval = setInterval(draw, gameSpeed);
