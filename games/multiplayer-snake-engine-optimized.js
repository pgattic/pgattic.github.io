const // internal constants
	up = 1
	left = 2
	down = 3
	right = 4

// user-friendly vars
	gameSpeed = 75 // Milliseconds per frame. Therefore, a higher number is a slower game.
	unit = 24 // The unit used for calculating the width of the player's body and the size of the food. It is recommended to be a factor of 600.
	foodColor = "#c0c"
	foodLineColor = "#f0f"
	growthRate = 5 // How much you grow from getting food.
	scoreColor = "black"
	initialPlayerLength = 5
	
	pauseKey1 = " "
	pauseKey2 = "Enter"

var
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")

	player1 = {
		inGame : false,
		startX : -unit / 2,
		startY : unit / 2,
		direction : [right],
		dirTemp : right,
		startDirection : right,
		size : initialPlayerLength,
		bodyX : [-unit],
		bodyY : [0],
		color : "#00c",
		lineColor : "#22f",
		upKey1 : "w",
		upKey2 : "W",
		downKey1 : "s",
		downKey2 : "S",
		leftKey1 : "a",
		leftKey2 : "A",
		rightKey1 : "d",
		rightKey2 : "D",
		spawnKey : "1",
	}

	player2 = {
		inGame : false,
		startX : canvas.width + unit / 2,
		startY : unit / 2,
		direction : [left],
		dirTemp : left,
		startDirection : left,
		size : initialPlayerLength,
		bodyX : [canvas.width],
		bodyY : [0],
		color : "#c00",
		lineColor : "#f22",
		upKey1 : "t",
		upKey2 : "T",
		downKey1 : "g",
		downKey2 : "G",
		leftKey1 : "f",
		leftKey2 : "F",
		rightKey1 : "h",
		rightKey2 : "H",
		spawnKey : "2",
	}

	player3 = {
		inGame : false,
		startX : -unit / 2,
		startY : canvas.height - unit / 2,
		direction : [right],
		dirTemp : left,
		startDirection : right,
		size : initialPlayerLength,
		bodyX : [-unit],
		bodyY : [canvas.height - unit],
		color : "#0c0",
		lineColor : "#2f2",
		upKey1 : "i",
		upKey2 : "I",
		downKey1 : "j",
		downKey2 : "J",
		leftKey1 : "k",
		leftKey2 : "K",
		rightKey1 : "l",
		rightKey2 : "L",
		spawnKey : "3",
	}

	player4 = {
		inGame : false,
		startX : canvas.width + unit / 2,
		startY : canvas.height - unit / 2,
		direction : [left],
		dirTemp : left,
		startDirection : left,
		size : initialPlayerLength,
		bodyX : [canvas.width],
		bodyY : [canvas.height - unit],
		color : "#ee0",
		lineColor : "#ff2",
		upKey1 : "Up",
		upKey2 : "ArrowUp",
		downKey1 : "Down",
		downKey2 : "ArrowDown",
		leftKey1 : "Left",
		leftKey2 : "ArrowLeft",
		rightKey1 : "Right",
		rightKey2 : "ArrowRight",
		spawnKey : "4",
	}

	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	isPaused = false

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

//INPUT
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	doKeys(player1, e);
	doKeys(player2, e);
	doKeys(player3, e);
	doKeys(player4, e);
	if (e.key == pauseKey1 || e.key == pauseKey2) {
		isPaused = !isPaused;
	}
}

function doKeys(playerN, e) {
	if (playerN.inGame || !isPaused) {
		if (e.key == playerN.upKey1 || e.key == playerN.upKey2) {
			playerN.dirTemp = up;
		}
		if (e.key == playerN.downKey1 || e.key == playerN.downKey2) {
			playerN.dirTemp = down;
		}
		if (e.key == playerN.leftKey1 || e.key == playerN.leftKey2) {
			playerN.dirTemp = left;
		}
		if (e.key == playerN.rightKey1 || e.key == playerN.rightKey2) {
			playerN.dirTemp = right;
		}
		if (Math.abs(playerN.direction[playerN.direction.length - 1] - playerN.dirTemp) !== 2 && playerN.direction[playerN.direction.length - 1] !== playerN.dirTemp) {
			playerN.direction.push(playerN.dirTemp);
		}
	}
	if (e.key == playerN.spawnKey) {
		playerN.inGame = !playerN.inGame;
		gameOver(playerN);
	}
}


//GAME ENGINE
function calculate1(playerN) {
	if (playerN.inGame) {
		playerLocation(playerN);
		boundsCheck(playerN);
		foodCheck(playerN);
	}
}

function playerLocation(playerN) {
	if (playerN.direction.length > 1) {
		playerN.direction.shift();
	}
	if (playerN.direction[0] == up) {
		playerN.bodyX.unshift(playerN.bodyX[0]);
		playerN.bodyY.unshift(playerN.bodyY[0] - unit);
	} else if (playerN.direction[0] == down) {
		playerN.bodyX.unshift(playerN.bodyX[0]);
		playerN.bodyY.unshift(playerN.bodyY[0] + unit);
	} else if (playerN.direction[0] == left) {
		playerN.bodyX.unshift(playerN.bodyX[0] - unit);
		playerN.bodyY.unshift(playerN.bodyY[0]);
	} else {
		playerN.bodyX.unshift(playerN.bodyX[0] + unit);
		playerN.bodyY.unshift(playerN.bodyY[0]);
	}
	while (playerN.bodyX.length > playerN.size) {
		playerN.bodyX.pop();
	}
	while (playerN.bodyY.length > playerN.size) {
		playerN.bodyY.pop();
	}
}

function boundsCheck(playerN) {
	if (playerN.bodyX[0] >= canvas.width || playerN.bodyX[0] < 0 || playerN.bodyY[0] >= canvas.height || playerN.bodyY[0] < 0) {
		gameOver(playerN);
	}
}

function gameOver(playerN) {
	var i;
	var n = playerN.size;
	for (i = 0; i < n; i++) {
		playerN.bodyX[i] = NaN;
		playerN.bodyY[i] = NaN;
	}
	for (i = 0; i < initialPlayerLength; i++) {
		playerN.bodyX[i] = playerN.startX;
		playerN.bodyY[i] = playerN.startY;
	}
	playerN.direction = [playerN.startDirection];
	playerN.dirTemp = playerN.startDirection;
	playerN.size = initialPlayerLength;
}

function foodCheck(playerN) {
	if (playerN.bodyX[0] == foodX && playerN.bodyY[0] == foodY) {
		playerN.size += growthRate;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	}
	drawFood();
}

function calculate2(playerN) {
	suicideCheck(playerN, player1);
	suicideCheck(playerN, player2);
	suicideCheck(playerN, player3);
	suicideCheck(playerN, player4);
}

function suicideCheck(playerN, playerQ) {
	if (playerN !== playerQ && playerN.bodyX[0] == playerQ.bodyX[0] && playerN.bodyY[0] == playerQ.bodyY[0]) {
		gameOver(playerN);
		gameOver(playerQ);
	}
	var i;
	var n = playerN.size;
	for (i = 1; i < n; i++) {
		if (playerN.bodyX[i] == playerQ.bodyX[0] && playerN.bodyY[i] == playerQ.bodyY[0]) {
			playerN.size += 5 * (Math.ceil(playerQ.size / 10));
			gameOver(playerQ);
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
}

function drawFood() {
	ctx.beginPath();
	ctx.arc(foodX, foodY, (unit / 2) - 1, 0, Math.PI * 2, false);
	ctx.fillStyle = foodColor;
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(foodX, foodY, unit / 6, 0, Math.PI * 2, false);
	ctx.fillStyle = foodLineColor;
	ctx.fill();
	ctx.closePath();
}

function display(playerN) {
	if (playerN.inGame) {
		drawLine(playerN);
		drawScore(playerN);
	}
}

function drawLine(playerN) {
	var i;
	var n = playerN.size;

	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = unit - 2;
	ctx.strokeStyle = playerN.color;
	ctx.moveTo(playerN.bodyX[0], playerN.bodyY[0]);
	for (i = 1; i < n; i++) {
		if ((playerN.bodyX[i-1] !== playerN.bodyX[i+1] | playerN.bodyX[i]) && (playerN.bodyY[i-1] !== playerN.bodyY[i+1] | playerN.bodyY[i])) {
			ctx.lineTo(playerN.bodyX[i], playerN.bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(playerN.bodyX[i], playerN.bodyY[i]);
		}
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = unit / 3;
	ctx.strokeStyle = playerN.lineColor;
	ctx.moveTo(playerN.bodyX[0], playerN.bodyY[0]);
	for (i = 1; i < n; i++) {
		if ((playerN.bodyX[i-1] !== playerN.bodyX[i+1] || playerN.bodyX[i]) && (playerN.bodyY[i-1] !== playerN.bodyY[i+1] || playerN.bodyY[i])) {
			ctx.lineTo(playerN.bodyX[i], playerN.bodyY[i]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(playerN.bodyX[i], playerN.bodyY[i]);
		}
	}
	ctx.stroke();
	ctx.closePath();
}

function drawScore(playerN) {
	ctx.font = "bolder "+((unit / 2) + 4)+"px Arial";
	ctx.fillStyle = scoreColor;
	ctx.textAlign = "center";
	ctx.fillText(playerN.size, playerN.bodyX[0], playerN.bodyY[0] + (unit / 12));
}

function draw() {
	if (!isPaused) {
		calculate1(player1);
		calculate1(player2);
		calculate1(player3);
		calculate1(player4);
		calculate2(player1);
		calculate2(player2);
		calculate2(player3);
		calculate2(player4);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
		drawFood();
		display(player1);
		display(player2);
		display(player3);
		display(player4);
	}
}

var interval = setInterval(draw, gameSpeed);
