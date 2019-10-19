var
	canvas = document.getElementById("flappy")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")

const
	startX = canvas.width / 5
	startY = 100
	jumpVelocity = -2
	floorHeight = canvas.height / 4
	floorColor = "#8B4513"
	pipeColor = "green"
	fallAcceleration = 0.025
	playerRadius = 10
	gameVelocity = 0.5
	pipeRate = 175
	pipeWidth = 50
	pipeGap = 125
	pipeYMin = canvas.height / 8
	pipeYMax = canvas.height * (7/8) - floorHeight - pipeGap
	numOfPlayers = 8
	playersAlive = numOfPlayers

var
	player = [{
		color : "blue",
		x : startX,
		y : startY,
		dx : gameVelocity,
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
		dx : gameVelocity,
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
		dx : gameVelocity,
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
		dx : gameVelocity,
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
		dx : gameVelocity,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "5",
	}, {
		color : "pink",
		x : startX,
		y : startY,
		dx : gameVelocity,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "6",
	}, {
		color : "cyan",
		x : startX,
		y : startY,
		dx : gameVelocity,
		dy : 0,
		jumping : false,
		alive : true,
		hitFloor : false,
		score : 0,
		jumpButton : "7",
	}, {
		color : "orange",
		x : startX,
		y : startY,
		dx : gameVelocity,
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
	gameX += gameVelocity;
}

function movePlayer(n) {
	player[n].x += player[n].dx;
	player[n].y += player[n].dy;
	if (player[n].y < playerRadius) {
		player[n].y = playerRadius;
		player[n].dy = 0;
	}
	if (player[n].y + playerRadius >= canvas.height - floorHeight) {
		if (!player[n].hitFloor) {
			playersAlive--;
			player[n].alive = false;
			player[n].hitFloor = true;
		}
		player[n].dy = 0;
		player[n].dx = 0;
		player[n].y = canvas.height - floorHeight - playerRadius;
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
		if (player[n].x + playerRadius > pipeX[i] && player[n].x - playerRadius < pipeX[i] + pipeWidth && (player[n].y - playerRadius < pipeY[i] || player[n].y + playerRadius > pipeY[i] + pipeGap)) {
			player[n].dx = 0;
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
	if (pipeX[0] + pipeWidth - gameX < 0) {
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
		ctx.rect(pipeX[i] - gameX, pipeY[i] + pipeGap, pipeWidth, canvas.height - floorHeight - pipeY[i] - pipeGap);
		ctx.fillStyle = pipeColor;
		ctx.fill();
		ctx.closePath();
	}
}

function drawScore() {
	ctx.font = "36px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + gameScore, 50, canvas.height - floorHeight + 70);
	ctx.fillText("Players Alive: " + playersAlive, 50, canvas.height - floorHeight + 120);
}

function draw() {
	if (!isPaused) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBG();
		despawnPipes();
		if (gameX % pipeRate == 0) {
			createPipe();
		}
		drawPipes();
		for (let i = numOfPlayers - 1; i >= 0; i--) {
			movePlayer(i);
			kill(i);
			givePoints(i);
			drawPlayer(i);
		}
		drawScore();
	}
}

var interval = setInterval(draw, 1);
