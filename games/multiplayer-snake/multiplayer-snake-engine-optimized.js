const // internal constants
	up = 1
	left = 2
	down = 3
	right = 4

// user-friendly vars
	gameSpeed = 30 // Milliseconds per frame. Therefore, a higher number is a slower game.
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
	ctx = canvas.getContext("2d")

	player1 = {
		inGame : false,
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
		upKey2 : "W",
		downKey1 : "s",
		downKey2 : "S",
		leftKey1 : "a",
		leftKey2 : "A",
		rightKey1 : "d",
		rightKey2 : "D",
		spawnKey : "1",
		foodX : [NaN],
		foodY : [NaN],
		foodSize : [0],
		amtOfFood : 0,
		timer : 0
	}

	player2 = {
		inGame : false,
		startX : canvas.width - unit / 2,
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
		foodX : [NaN],
		foodY : [NaN],
		foodSize : [0],
		amtOfFood : 0,
		timer : 0
	}

	player3 = {
		inGame : false,
		startX : unit / 2,
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
		downKey1 : "k",
		downKey2 : "K",
		leftKey1 : "j",
		leftKey2 : "J",
		rightKey1 : "l",
		rightKey2 : "L",
		spawnKey : "3",
		foodX : [NaN],
		foodY : [NaN],
		foodSize : [0],
		amtOfFood : 0,
		timer : 0
	}

	player4 = {
		inGame : false,
		startX : canvas.width - unit / 2,
		startY : canvas.height - unit / 2,
		direction : [left],
		dirTemp : left,
		startDirection : left,
		size : initialPlayerLength,
		bodyX : [canvas.width],
		bodyY : [canvas.height - unit],
		color : "#dd0",
		lineColor : "#ff3",
		upKey1 : "Up",
		upKey2 : "ArrowUp",
		downKey1 : "Down",
		downKey2 : "ArrowDown",
		leftKey1 : "Left",
		leftKey2 : "ArrowLeft",
		rightKey1 : "Right",
		rightKey2 : "ArrowRight",
		spawnKey : "4",
		foodX : [NaN],
		foodY : [NaN],
		foodSize : [0],
		amtOfFood : 0,
		timer : 0
	}

	dimension = [Math.floor(document.documentElement.clientWidth / unit) * unit, Math.floor(document.documentElement.clientHeight / unit) * unit];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	foodX = ((Math.floor(Math.random() * (canvas.width/unit))) * unit) + unit / 2
	foodY = ((Math.floor(Math.random() * (canvas.height/unit))) * unit) + unit / 2
	foodFailure = false
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
		if (playerN.inGame) {
			generateFood(playerN);
		}
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
	playerN.timer++;
	if(playerN.timer>=(playerN.size>100?100:playerN.size)/20+1){
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
		playerN.timer=0;
	}
}

function boundsCheck(playerN) {
	if (playerN.bodyX[0] >= canvas.width || playerN.bodyX[0] < 0 || playerN.bodyY[0] >= canvas.height || playerN.bodyY[0] < 0) {
		generateFood(playerN);
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
		foodCheck2(player1);
		foodCheck2(player2);
		foodCheck2(player3);
		foodCheck2(player4);
	}
}

function foodCheck2(playerN) {
	if (playerN.inGame) {
		var i;
		var s = playerN.size;
		for (i = 0; i < s; i++) {
			if (playerN.bodyX[i] == foodX && playerN.bodyY[i] == foodY) {
				foodFailure = true;
			}
		}
	}
}

function calculate2(playerN) {
	suicideCheck(playerN, player1);
	suicideCheck(playerN, player2);
	suicideCheck(playerN, player3);
	suicideCheck(playerN, player4);
}

function suicideCheck(playerN, playerQ) {
	if (playerN !== playerQ && ((playerN.bodyX[0] == playerQ.bodyX[0] && playerN.bodyY[0] == playerQ.bodyY[0]) || (playerN.bodyX[0] == playerQ.bodyX[1] && playerN.bodyY[0] == playerQ.bodyY[1]))) {
		generateFood(playerN);
		gameOver(playerN);
		generateFood(playerQ);
		gameOver(playerQ);
	}
	var i;
	var n = playerN.size;
	for (i = 1; i < n; i++) {
		if (playerN.bodyX[i] == playerQ.bodyX[0] && playerN.bodyY[i] == playerQ.bodyY[0]) {
			generateFood(playerQ);
			gameOver(playerQ);
		}
	}
	n = playerQ.amtOfFood;
	for (i = 1; i <= n; i++) {
		if (playerN.bodyX[0] == playerQ.foodX[i] && playerN.bodyY[0] == playerQ.foodY[i]) {
			playerN.size += playerQ.foodSize[i];
			playerQ.foodSize.splice(i, 1);
			playerQ.foodX.splice(i, 1);
			playerQ.foodY.splice(i, 1);
		}
	}
}

function generateFood(playerN) {
	if (playerN.size > initialPlayerLength) { var i = 1// if singularity food
//	for (i = 1; i < playerN.size - initialPlayerLength + 1; i++) {
		playerN.foodX.push(playerN.bodyX[i]);
		playerN.foodY.push(playerN.bodyY[i]);
		playerN.foodSize.push(5 * (Math.ceil(playerN.size / 10))); // 5 * (Math.ceil(playerN.size / 10)) if singularity food
		playerN.amtOfFood++;
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

function display(playerN) {
	if (playerN.inGame) {
		drawLine(playerN);
		drawScore(playerN);
	}
	drawPlayerFood(playerN);
}

function drawLine(playerN) {
	var i;
	var n = playerN.size;

	if (playerN.size > (canvas.width / unit) * (canvas.height / unit)) {
		playerN.size = (canvas.width / unit) * (canvas.height / unit);
	}
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = unit - 2;
	ctx.strokeStyle = playerN.color;
	ctx.moveTo(playerN.bodyX[0], playerN.bodyY[0]);
	for (i = 1; i < n; i++) {
		if (playerN.bodyX[i-1] !== playerN.bodyX[i+1] && playerN.bodyY[i-1] !== playerN.bodyY[i+1]) {
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
	ctx.lineWidth = unit / 2;
	ctx.strokeStyle = playerN.lineColor;
	ctx.moveTo(playerN.bodyX[0], playerN.bodyY[0]);
	for (i = 1; i < n; i++) {
		if (playerN.bodyX[i-1] !== playerN.bodyX[i+1] && playerN.bodyY[i-1] !== playerN.bodyY[i+1]) {
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

function drawPlayerFood(playerN) {
	var n = playerN.amtOfFood;
	for (var i = 1; i <= n; i++) {
		ctx.beginPath();
		ctx.arc(playerN.foodX[i], playerN.foodY[i], (unit / 2) - 1, 0, Math.PI * 2, false);
		ctx.fillStyle = playerN.color;
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(playerN.foodX[i], playerN.foodY[i], unit / 4, 0, Math.PI * 2, false);
		ctx.fillStyle = playerN.lineColor;
		ctx.fill();
		ctx.closePath();
	}
}

function draw() {
	if (canvas.width != Math.floor(document.documentElement.clientWidth / unit) * unit || canvas.height != Math.floor(document.documentElement.clientHeight / unit) * unit) {
		dimension = [Math.floor(document.documentElement.clientWidth / unit) * unit, Math.floor(document.documentElement.clientHeight / unit) * unit];
		canvas.width = dimension[0];
		canvas.height = dimension[1];
		player2.startX = canvas.width - unit / 2;
		player3.startY = canvas.height - unit / 2;
		player4.startX = canvas.width - unit / 2;
		player4.startY = canvas.height - unit / 2;
		if (foodX > canvas.width || foodY > canvas.height) {
			foodFailure = true;
			redoFood();
		}
	}
	if (!isPaused) {
		calculate1(player1);
		calculate1(player2);
		calculate1(player3);
		calculate1(player4);
		calculate2(player1);
		calculate2(player2);
		calculate2(player3);
		calculate2(player4);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	drawFood();
	display(player1);
	display(player2);
	display(player3);
	display(player4);
}

var interval = setInterval(draw, gameSpeed);
