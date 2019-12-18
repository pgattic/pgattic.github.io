var
	canvas = document.getElementById("flappy")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")

const
	startX = canvas.width / 5
	startY = 100
	jumpVelocity = -1.9
	floorHeight = canvas.height / 6
	floorColor = "#8B4513"
	pipeColor = "green"
	fallAcceleration = 0.025
	playerRadius = 20
	playerInnerScale = 0.75
	gameVelocity = 0.75
	pipeRate = 320
	pipeWidth = 80
	pipeGap = 150
	pipeYMin = canvas.height / 8
	pipeYMax = canvas.height * (7/8) - floorHeight - pipeGap
	numOfPlayers = 8
	playersAlive = numOfPlayers

var
	player = [{
		color : "blue",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "1",
	}, {
		color : "red",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "2",
	}, {
		color : "green",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "3",
	}, {
		color : "yellow",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "4",
	}, {
		color : "purple",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "5",
	}, {
		color : "cyan",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "6",
	}, {
		color : "orange",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "7",
	}, {
		color : "pink",
		x : startX,
		y : startY,
		dx : 0,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "8",
	}]
	
	pipeX = [NaN]
	pipeY = [NaN]
	pipePassed = [NaN]
	numOfPipes = 0
	gameScore = 0
	isPaused = false
	gameX = 0
	pipeWait = 0


document.addEventListener("keydown", getKeys, false);
document.addEventListener("keyup", unGetKeys, false);

function getKeys(e) {
	if (e.key == "q" || e.key == "Enter") {
		isPaused = !isPaused;
	}
	for (let i = 0; i < numOfPlayers; i++) {
		if (e.key == player[i].jumpButton && !isPaused && !player[i].jumping && player[i].alive) {
			jump(i);
		}
	}
}

function unGetKeys(e) {
	for (let i = 0; i < numOfPlayers; i++) {
		if (e.key == player[i].jumpButton && !isPaused && player[i].alive) {
			player[i].jumping = false;
		}
	}
}

function jump(n) {
	player[n].dy = jumpVelocity;
	player[n].jumping = true;
}

function drawBG() {
	ctx.beginPath();
	ctx.rect(0, canvas.height - floorHeight, canvas.width, floorHeight)
	ctx.fillStyle = floorColor;
	ctx.fill();
	ctx.closePath();
}

function movePlayer(n) {
	player[n].x += player[n].dx;
	player[n].y += player[n].dy;
	if (player[n].y < playerRadius * playerInnerScale) {
		player[n].y = playerRadius * playerInnerScale;
		player[n].dy = 0;
	}
	if (player[n].y + playerRadius * playerInnerScale >= canvas.height - floorHeight) {
		if (!player[n].hitFloor) {
			playersAlive--;
			player[n].alive = false;
			player[n].hitFloor = true;
		}
		player[n].dy = 0;
		player[n].dx = -gameVelocity;
		player[n].y = canvas.height - floorHeight - playerRadius * playerInnerScale;
	}
	else {
		player[n].dy += fallAcceleration;
	}
}

function createPipe() {
	pipeX[numOfPipes] = canvas.width + gameX;
	pipeY[numOfPipes] = Math.floor(Math.random() * (pipeYMax - pipeYMin)) + pipeYMin;
	pipePassed[numOfPipes] = false;
	numOfPipes++;
}

function kill(n) {
	for (var i = 0; i <= numOfPipes; i++) {
		if (player[n].x + playerRadius * playerInnerScale > pipeX[i] && player[n].x - playerRadius * playerInnerScale < pipeX[i] + pipeWidth && (player[n].y - playerRadius * playerInnerScale < pipeY[i] || player[n].y + playerRadius * playerInnerScale > pipeY[i] + pipeGap)) {
			player[n].dx = -gameVelocity;
			player[n].alive = false;
		}
	}
}

function givePoints(n) {
	for (var i = 0; i <= numOfPipes; i++) {
		if (!pipePassed[i] && gameX + startX > pipeX[i] + pipeWidth / 2 && playersAlive > 0) {
			gameScore++;
			pipePassed[i] = true;
		}
	}
}

function drawPlayer(n) {
	ctx.beginPath();
	ctx.arc(player[n].x - gameX, player[n].y, playerRadius, Math.PI * 2, false)
	ctx.fillStyle = player[n].color;
	ctx.fill();
	ctx.closePath();
}

function despawnPipes() {
	for (var i = 0; i <= numOfPipes; i++) {
		pipeX[i] -= gameVelocity;
	}
	if (pipeX[0] + pipeWidth < 0) {
		for (var i = 0; i <= numOfPipes; i++) {
			pipeX[i] = pipeX[i + 1];
			pipeY[i] = pipeY[i + 1];
			pipePassed[i] = pipePassed[i + 1];
		}
		numOfPipes--;
	}
}

function drawPipes() {
	for (var i = 0; i <= numOfPipes; i++) {
		ctx.beginPath();
		ctx.rect(pipeX[i] - gameX, 0, pipeWidth, pipeY[i]);
		ctx.rect(pipeX[i] - gameX, pipeY[i] + pipeGap, pipeWidth, canvas.height - floorHeight - pipeY[i] - pipeGap + 1);
		ctx.fillStyle = pipeColor;
		ctx.fill();
		ctx.closePath();
	}
}

function drawScore() {
	ctx.font = "36px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + gameScore, 20, canvas.height - floorHeight + 50);
	ctx.fillText("Players Alive: " + playersAlive, 20, canvas.height - floorHeight + 90);
}

function draw() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	if (!isPaused) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		despawnPipes();
		if (pipeWait % pipeRate == 0) {
			createPipe();
		}
		drawPipes();
		for (let i = numOfPlayers - 1; i >= 0; i--) {
			movePlayer(i);
			kill(i);
			givePoints(i);
			drawPlayer(i);
		}
		drawBG();
		drawScore();
		pipeWait++;
	}
}

var interval = setInterval(draw, 1);
