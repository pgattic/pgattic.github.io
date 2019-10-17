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

var
	canvas = document.getElementById("Snake")
	ctx = canvas.getContext("2d")

	player1 = {
		inGame : false,
		startX : -unit / 2,
		startY : unit / 2,
		direction : right,
		dirTemp : right,
		startDirection : right,
		length : initialPlayerLength,
		bodyX : [-unit],
		bodyY : [0],
		color : "#00c",
		lineColor : "#22f",
	}

	player2 = {
		inGame : false,
		startX : canvas.width + unit / 2,
		startY : unit / 2,
		direction : left,
		dirTemp : left,
		startDirection : left,
		length : initialPlayerLength,
		bodyX : [canvas.width],
		bodyY : [0],
		color : "#c00",
		lineColor : "#f22",
	}

	player3 = {
		inGame : false,
		startX : -unit / 2,
		startY : canvas.height - unit / 2,
		direction : right,
		dirTemp : left,
		startDirection : right,
		length : initialPlayerLength,
		bodyX : [-unit],
		bodyY : [canvas.height - unit],
		color : "#0c0",
		lineColor : "#2f2",
	}

	player4 = {
		inGame : false,
		startX : canvas.width + unit / 2,
		startY : canvas.height - unit / 2,
		direction : left,
		dirTemp : left,
		startDirection : left,
		length : initialPlayerLength,
		bodyX : [canvas.width],
		bodyY : [canvas.height - unit],
		color : "#ee0",
		lineColor : "#ff2",
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
	if (player1.inGame) {
		if (e.key == "w" || e.key == "W") {
			player1.dirTemp = up;
		}
		if (e.key == "s" || e.key == "S") {
			player1.dirTemp = down;
		}
		if (e.key == "a" || e.key == "A") {
			player1.dirTemp = left;
		}
		if (e.key == "d" || e.key == "D") {
			player1.dirTemp = right;
		}
		if (Math.abs(player1.direction - player1.dirTemp) !== 2) {
			player1.direction = player1.dirTemp;
		}
	}
	if (player2.inGame) {
		if (e.key == "t" || e.key == "T") {
			player2.dirTemp = up;
		}
		if (e.key == "g" || e.key == "G") {
			player2.dirTemp = down;
		}
		if (e.key == "f" || e.key == "F") {
			player2.dirTemp = left;
		}
		if (e.key == "h" || e.key == "H") {
			player2.dirTemp = right;
		}
		if (Math.abs(player2.direction - player2.dirTemp) !== 2) {
			player2.direction = player2.dirTemp;
		}
	}
	if (player3.inGame) {
		if (e.key == "i" || e.key == "I") {
			player3.dirTemp = up;
		}
		if (e.key == "k" || e.key == "K") {
			player3.dirTemp = down;
		}
		if (e.key == "j" || e.key == "J") {
			player3.dirTemp = left;
		}
		if (e.key == "l" || e.key == "L") {
			player3.dirTemp = right;
		}
		if (Math.abs(player3.direction - player3.dirTemp) !== 2) {
			player3.direction = player3.dirTemp;
		}
	}
	if (player4.inGame) {
		if (e.key == "Up" || e.key == "ArrowUp") {
			player4.dirTemp = up;
		}
		if (e.key == "Down" || e.key == "ArrowDown") {
			player4.dirTemp = down;
		}
		if (e.key == "Left" || e.key == "ArrowLeft") {
			player4.dirTemp = left;
		}
		if (e.key == "Right" || e.key == "ArrowRight") {
			player4.dirTemp = right;
		}
		if (Math.abs(player4.direction - player4.dirTemp) !== 2) {
			player4.direction = player4.dirTemp;
		}
	}
	if (e.key == "1") {
		player1.inGame = !player1.inGame;
		gameOver(player1);
	}
	if (e.key == "2") {
		player2.inGame = !player2.inGame;
		gameOver(player2);
	}
	if (e.key == "3") {
		player3.inGame = !player3.inGame;
		gameOver(player3);
	}
	if (e.key == "4") {
		player4.inGame = !player4.inGame;
		gameOver(player4);
	}
	if (e.key == " " || e.key == "Enter") {
		isPaused = !isPaused;
	}
}


//GAME ENGINE
function calculate(playerN) {
	if (playerN.inGame) {
		playerLocation(playerN);
		boundsCheck(playerN);
		foodCheck(playerN);
	}
	suicideCheck(playerN, player1);
	suicideCheck(playerN, player2);
	suicideCheck(playerN, player3);
	suicideCheck(playerN, player4);
}

function playerLocation(playerN) {
	var i = playerN.length;
	for (i; i > 0; i--) {
		playerN.bodyX[i] = playerN.bodyX[i - 1];
		playerN.bodyY[i] = playerN.bodyY[i - 1];
	}
	if (playerN.direction == up) {
		playerN.bodyY[0] -=  unit;
	} else if (playerN.direction == down) {
		playerN.bodyY[0] += unit;
	} else if (playerN.direction == left) {
		playerN.bodyX[0] -= unit;
	} else {
		playerN.bodyX[0] += unit;
	}
}

function boundsCheck(playerN) {
	if (playerN.bodyX[0] >= canvas.width || playerN.bodyX[0] < 0 || playerN.bodyY[0] >= canvas.height || playerN.bodyY[0] < 0) {
		gameOver(playerN);
	}
}

function gameOver(playerN) {
	var i;
	var n = playerN.length;
	for (i = 0; i < n; i++) {
		playerN.bodyX[i] = NaN;
		playerN.bodyY[i] = NaN;
	}
	for (i = 0; i < initialPlayerLength; i++) {
		playerN.bodyX[i] = playerN.startX;
		playerN.bodyY[i] = playerN.startY;
	}
	playerN.direction = playerN.startDirection;
	playerN.dirTemp = playerN.startDirection;
	playerN.length = initialPlayerLength;
}

function foodCheck(playerN) {
	if (playerN.bodyX[0] == foodX && playerN.bodyY[0] == foodY) {
		playerN.length += growthRate;
		foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
		foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	}
	drawFood();
}

function suicideCheck(playerN, playerQ) {
	if (playerN !== playerQ && playerN.bodyX[0] == playerQ.bodyX[0] && playerN.bodyY[0] == playerQ.bodyY[0]) {
		gameOver(playerN);
		gameOver(playerQ);
	}
	var i;
	var n = playerN.length;
	for (i = 1; i < n; i++) {
		if (playerN.bodyX[i] == playerQ.bodyX[0] && playerN.bodyY[i] == playerQ.bodyY[0]) {
			playerN.length += 5 * (Math.ceil(playerQ.length / 10));
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
	var n = playerN.length;

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
	ctx.fillText(playerN.length, playerN.bodyX[0], playerN.bodyY[0] + (unit / 12));
}

function draw() {
	if (!isPaused) {
		calculate(player1);
		calculate(player2);
		calculate(player3);
		calculate(player4);

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
