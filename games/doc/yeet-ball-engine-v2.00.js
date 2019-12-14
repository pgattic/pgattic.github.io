"use strict";

var
	canvas = document.getElementById("GWar"),
	ctx = canvas.getContext("2d"),
	dimension = [document.clientWidth, document.clientHeight];
	canvas.width = dimension[0],
	canvas.height = dimension[1];

const
	inMenu = 0,
	inGame = 1,

	screenWidth = 1200,
	screenHeight = 1200,

	playerRadius = 10,
	playerStartX = screenWidth / 2,
	playerStartY = screenHeight / 2,
	playerAccel = 0.1,
	playerSlowRate = 1.04,
	playerHitBoxRadius = playerRadius,

	bulletThickness = 10,
	bulletSpeed = 6,
	gapBetweenSuperBullets = 30,

	enemyRadius = 10,
	enemySpeed = 0.8,
	enemyHitBoxRadius = enemyRadius * 1.5,
	enemySpawnConstant = 300,
	enemyPtValue = 100,
	enemyWaitLimit = 50,

	kToPowerUp = 65,
	powerUpSize = 20,

	bulletDelay = 20,
	spawnGradient = 5,

	menuPlayButtonRadius = canvas.height / 4,
	menuPlayButtonX = canvas.width / 2,
	menuPlayButtonY = canvas.height * (3 / 5);


var
	highScore = localStorage.getItem('record') || 0,
	mouseX = canvas.width / 2,
	mouseY = canvas.height / 2,
	upPressed = false,
	downPressed = false,
	leftPressed = false,
	rightPressed = false,

	bulletTimer = 0,

	player = {
		x : playerStartX,
		y : playerStartY,
		xVel : 0,
		yVel : 0,
		state : 0
	},

	powerUp = {
		x : [0],
		y : [0],
		alive : [false],
		numSpawned : 0,
		wait : 0
	},

	bullets = [
		[/*
			x,
			y,
			dx,
			dy,
			super (boolean)
		*/]
	],

	enemies = [
		[/*
			x, 
			y
		*/]
	],
	enemiesKilled = 0,
	superBulletSpeed = 20,
	superTimer = -1,

	enemySpawnRate = 0,
	enemyWait = 500,

	isPaused = false,
	playerLives = 3,
	powerUpsLeft = 3,
	playerPoints = 0,		
	clicking = false,
	spacing = false,

	gameState = 1,
	playerState = 0;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	window.location.href = 'https://pgattic.github.io/games/yeet-ball-mobile';
}

document.onmousemove = function() {
	mouseX = event.clientX - canvas.offsetLeft + player.x;
	mouseY = event.clientY - canvas.offsetTop + player.y;
}
document.onmousedown = function() {clicking = true}
document.onmouseup = function() {clicking = false}
document.onkeydown = function() {
	switch (event.key) {
		case "Up":
		case "ArrowUp":
		case "w":
			upPressed = true;
			break;
		case "Down":
		case "ArrowDown":
		case "s":
			downPressed = true;
			break;
		case "Left":
		case "ArrowLeft":
		case "a":
			leftPressed = true;
			break;
		case "Right":
		case "ArrowRight":
		case "d":
			rightPressed = true;
			break;
		case "q":
			isPaused = !isPaused;
			break;
		case " ":
			spacing = true;
			break;
	}
}
document.onkeyup = function() {
	switch (event.key) {
		case "Up":
		case "ArrowUp":
		case "w":
			upPressed = false;
			break;
		case "Down":
		case "ArrowDown":
		case "s":
			downPressed = false;
			break;
		case "Left":
		case "ArrowLeft":
		case "a":
			leftPressed = false;
			break;
		case "Right":
		case "ArrowRight":
		case "d":
			rightPressed = false;
			break;
		case "e":
			doSuper();
			break;
		case " ":
			spacing = false;
			break;
	}
}

function doSuper() {
	if (!isPaused) {
		if (powerUpsLeft > 0) {
			superTimer = 250;
			powerUpsLeft--;
			for (let i = 1; i < Math.floor(screenWidth / gapBetweenSuperBullets); i++) {
				bullets.push([10, (gapBetweenSuperBullets * i) - 10, superBulletSpeed, 0, true])
			}
		}
	}
}

function doMenu() {
}

function doGame() {
	ctx.shadowColor = shadowColor;
	if (!isPaused) {
		ctx.translate(-player.x + canvas.width / 2 - player.xVel, -player.y + canvas.height / 2 - player.yVel);
		makeCrosshair();
		calcPlayerCoord();
		acceleratePlayer();
		doBoundary();
		ctx.shadowBlur = 0;
		drawBG();
		ctx.shadowBlur = 4;
		animateBullet();
		enemyKill();
		drawBadGuy();
		drawBorder();
		playerKill();
		drawPowerUp();
		ctx.shadowBlur = 0;
		drawMapBorder();
		ctx.shadowBlur = 4;
		drawLine();
		drawPlayer();
		drawMiniMap();
		superTimer--;
		if (superTimer < 0 && (clicking || spacing)) {
			bulletTimer++;
			if (bulletTimer >= bulletDelay) {
				let bulletRise = mouseY - player.y;
				let bulletRun = mouseX - player.x;
				let bulletDZ = Math.sqrt(Math.pow(bulletRun, 2) + Math.pow(bulletRise, 2));
				bullets.push([player.x, player.y, (bulletRun / bulletDZ) * bulletSpeed, (bulletRise / bulletDZ) * bulletSpeed, false])
				bulletTimer = 0;
			}
		}
	}
	else {
		ctx.translate(-player.x + canvas.width / 2, -player.y + canvas.height / 2);
		makeCursor();
		ctx.shadowBlur = 0;
		drawBG();
		ctx.shadowBlur = 4;
		drawBorder();
		ctx.shadowBlur = 0;
		drawMapBorder();
		ctx.shadowBlur = 4;
		drawPlayer();
		drawMiniMap();
		ctx.font = "bolder 72px Arial";
		ctx.fillStyle = lineColor;
		ctx.textAlign = "center"
		ctx.fillText("PAUSED", player.x, player.y + 25);
	}
	ctx.font = "16px Arial";
	ctx.textAlign = "left"
	ctx.fillStyle = lineColor;
	ctx.fillText("Score: " + playerPoints, 20 + player.x - canvas.width / 2, 30 + player.y - canvas.height / 2);
	ctx.fillText("Lives: " + playerLives, 20 + player.x - canvas.width / 2, 54 + player.y - canvas.height / 2);
	ctx.fillText("Super: " + powerUpsLeft, 20 + player.x - canvas.width / 2, 78 + player.y - canvas.height / 2);
	ctx.fillText("Highscore: " + highScore, 20 + player.x - canvas.width / 2, -20 + player.y + canvas.height / 2);
	ctx.font = "12px Arial";
	ctx.textAlign = "right";
	ctx.fillText("v2.0.0", -10 + player.x + canvas.width / 2, -10 + player.y + canvas.height / 2);
//	ctx.fillText("Enemies/sec: " + (1000/(((enemySpawnConstant - (enemySpawnRate * spawnGradient)) < enemyWaitLimit)? enemyWaitLimit : (enemySpawnConstant - (enemySpawnRate * spawnGradient)))).toFixed(2), 20 + player.x - canvas.width / 2, 126 + player.y - canvas.height / 2);
}

function makeCrosshair() {
	document.getElementById("GWar").style.cursor = "crosshair";
}

function makeCursor() {
	document.getElementById("GWar").style.cursor = "default";
}

function acceleratePlayer() {
	if (upPressed) {
		player.yVel = player.yVel - playerAccel;
	}
	if (downPressed) {
		player.yVel = player.yVel + playerAccel;
	}
	if (leftPressed) {
		player.xVel = player.xVel - playerAccel;
	}
	if (rightPressed) {
		player.xVel = player.xVel + playerAccel;
	}
	player.yVel = player.yVel / playerSlowRate;
	player.xVel = player.xVel / playerSlowRate;
}

function calcPlayerCoord() {
	player.x = player.x + player.xVel;
	player.y = player.y + player.yVel;
	mouseX = mouseX + player.xVel;
	mouseY = mouseY + player.yVel;
}

function doBoundary() {
	if (player.x + playerRadius > screenWidth) { 
		player.xVel = 0;
		player.x--;
	}
	if (player.x - playerRadius < 0) { 
		player.xVel = 0;
		player.x++;
	}
	if (player.y + playerRadius > screenHeight) { 
		player.yVel = 0;
		player.y--;
	}
	if (player.y - playerRadius < 0) { 
		player.yVel = 0;
		player.y++;
	}
}

function drawBG() {
	ctx.beginPath();
	ctx.rect(0, 0, screenWidth, screenHeight);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.closePath();
	for (let i = 1; i < 8; i++) {
		ctx.beginPath();
		ctx.moveTo((screenWidth / 8) * i, 0);
		ctx.lineTo((screenWidth / 8) * i, screenHeight);
		ctx.lineWidth = 3;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, (screenHeight / 8) * i);
		ctx.lineTo(screenHeight, (screenHeight / 8) * i);
		ctx.lineWidth = 3;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}
}

function animateBullet() {
	for (let i = 0; i < bullets.length; i++) {
		if (bullets[i][0] < 0 || bullets[i][0] > screenWidth || bullets[i][1] < 0 || bullets[i][1] > screenHeight) {
			bullets.splice(i, 1);
			i--;
			continue;
		}
		ctx.beginPath();
		ctx.moveTo(bullets[i][0], bullets[i][1]);
		ctx.lineTo(bullets[i][0] + bullets[i][2] * (30 / bulletSpeed), bullets[i][1] + bullets[i][3] * (30 / bulletSpeed));
		ctx.lineWidth = bulletThickness;
		ctx.lineCap = "round";
		ctx.strokeStyle = bulletColor;
		ctx.stroke();
		bullets[i][0] += bullets[i][2];
		bullets[i][1] += bullets[i][3];
	}
}

function drawBadGuy() {
	enemyWait--;
	if (enemyWait <= 0) {
		enemyWait = ((enemySpawnConstant - (enemySpawnRate * spawnGradient)) < enemyWaitLimit)? enemyWaitLimit : (enemySpawnConstant - (enemySpawnRate * spawnGradient));
		switch (Math.floor(Math.random() * 4)) {
			case 0:
				enemies.push([0, screenHeight * Math.random()]);
				break;
			case 1:
				enemies.push([screenWidth, screenHeight * Math.random()]);
				break;
			case 2:
				enemies.push([screenWidth * Math.random(), 0]);
				break;
			case 3:
				enemies.push([screenWidth * Math.random(), screenHeight]);
				break;
		}
	}
	for (let i = 0; i < enemies.length; i++) {
		let enemyRun = player.x - enemies[i][0];
		let enemyRise = player.y - enemies[i][1];
		let enemyDZ = Math.sqrt(Math.pow(enemyRun, 2) + Math.pow(enemyRise, 2));
		enemies[i][0] += (enemyRun / enemyDZ) * enemySpeed;
		enemies[i][1] += (enemyRise / enemyDZ) * enemySpeed;

		ctx.beginPath();
		ctx.arc(enemies[i][0], enemies[i][1], enemyRadius + 3, 0, Math.PI * 2, false);
		ctx.fillStyle = enemyOutlineColor;
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(enemies[i][0], enemies[i][1], enemyRadius, 0, Math.PI * 2, false);
		ctx.fillStyle = enemyColor;
		ctx.fill();
		ctx.closePath();
	}
}

function enemyKill() {
	for (let e = bullets.length - 1; e >= 0; e--) {
		for (let i = enemies.length - 1; i >= 0; i--) {
			if (i >= enemies.length || e >= bullets.length) {
				continue;
			}
			if (Math.abs(bullets[e][0] - enemies[i][0]) < enemyHitBoxRadius && Math.abs(bullets[e][1] - enemies[i][1]) < enemyHitBoxRadius) {
				enemiesKilled++;
				enemySpawnRate++;
				powerUp.wait++;
				playerPoints += enemyPtValue;
				if (powerUp.wait >= kToPowerUp) {
					powerUp.wait = 0;
					powerUp.alive[powerUp.numSpawned] = true;
					powerUp.x[powerUp.numSpawned] = enemies[i][0] - powerUpSize / 2;
					powerUp.y[powerUp.numSpawned] = enemies[i][1] - powerUpSize / 2;
					powerUp.numSpawned++;
				}
				enemies.splice(i, 1);
				if (!bullets[e][4]) {
					bullets.splice(e, 1);
				}
			}
		}
	}
}

function drawLine() {
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(mouseX, mouseY);
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.stroke();
}

function drawBorder() {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, screenHeight);
	ctx.lineTo(screenWidth, screenHeight);
	ctx.lineTo(screenWidth, 0);
	ctx.lineTo(0, 0);
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.stroke();
}

function playerKill() {
	for (let i = 0; i < enemies.length; i++) {
		if (Math.abs(enemies[i][0] - player.x) < playerHitBoxRadius && Math.abs(enemies[i][1] - player.y) < playerHitBoxRadius) {
			mouseX = mouseX - (player.x - screenWidth / 2)
			mouseY = mouseY - (player.y - screenHeight / 2)
			playerLives--;
			player.x = playerStartX;
			player.y = playerStartY;
			player.xVel = 0;
			player.yVel = 0;
			enemyWait = 500;
			bullets = [];
			enemySpawnRate = Math.round(enemySpawnRate / 10) * 5;
			enemies = []
			if (playerLives == 0) {
				if (playerPoints > highScore) {
					localStorage.setItem('record', playerPoints);
				}
				alert("Game Over!\nYou killed " + (enemiesKilled - 1) + " enemies.");
				document.location.reload();
				clearInterval(interval);
			}
		}
	}
}

function drawPlayer() {
	ctx.beginPath();
	ctx.arc(player.x, player.y, playerRadius + 3, 0, Math.PI * 2, false);
	ctx.fillStyle = playerOutlineColor;
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = playerColor;
	ctx.fill();
	ctx.closePath();
	}

function drawPowerUp() {
	for (let i = 0; i < powerUp.numSpawned; i++) {
		if (powerUp.alive[i]) {
			ctx.beginPath();
			ctx.fillStyle = powerUpOutlineColor;
			ctx.fillRect(powerUp.x[i] - 3, powerUp.y[i] - 3, powerUpSize + 6, powerUpSize + 6);
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = powerUpColor;
			ctx.fillRect(powerUp.x[i], powerUp.y[i], powerUpSize, powerUpSize);
			ctx.closePath();
		}
		if (Math.abs((powerUp.x[i] + (powerUpSize / 2)) - player.x) < powerUpSize && Math.abs((powerUp.y[i] + (powerUpSize / 2)) - player.y) < powerUpSize && powerUp.alive[i]) {
			if (Math.random() >= 0.5) {
				playerLives++;
			}
			else {
				powerUpsLeft++;
			}
			powerUp.alive[i] = false;
		}
	}
}

function drawMapBorder() {
	ctx.beginPath();
	ctx.rect(-30, -30, screenWidth + 60, screenHeight + 60);
	ctx.lineWidth = 59;
	ctx.strokeStyle = bgBorder;
	ctx.stroke();
	ctx.closePath();
}

function drawMiniMap() {
	ctx.beginPath();
	ctx.rect(((canvas.width / 2) - screenWidth / 8) + player.x, ((canvas.height / 2) - screenHeight / 8) + player.y, screenWidth / 10, screenHeight / 10);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.closePath();
	ctx.shadowBlur = 0;
	for (let i = 1; i < 8; i++) {
		ctx.beginPath();
		ctx.moveTo(((canvas.width / 2) - screenWidth / 8) + player.x + (screenWidth / 80) * i, ((canvas.height / 2) - screenHeight / 8) + player.y);
		ctx.lineTo(((canvas.width / 2) - screenWidth / 8) + player.x + (screenWidth / 80) * i, ((canvas.height / 2) - screenHeight / 8) + player.y + (screenWidth / 10));
		ctx.lineWidth = 1;
		ctx.strokeStyle = gridColor;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(((canvas.width / 2) - screenWidth / 8) + player.x, ((canvas.height / 2) - screenHeight / 8) + player.y + (screenHeight / 80) * i);
		ctx.lineTo(((canvas.width / 2) - screenWidth / 8) + player.x + (screenWidth / 10), ((canvas.height / 2) - screenHeight / 8) + player.y + (screenHeight / 80) * i);
		ctx.lineWidth = 1;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.rect(((canvas.width / 2) - screenWidth / 8) + player.x, ((canvas.height / 2) - screenHeight / 8) + player.y, screenWidth / 10, screenHeight / 10);
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath()
	ctx.rect(((((canvas.width / 2) - screenWidth / 8) + player.x * 1.1) - canvas.width / 20), ((((canvas.height / 2) - screenHeight / 8) + player.y * 1.1) - canvas.height / 20), canvas.width / 10, canvas.height / 10);
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc((((canvas.width / 2) - screenWidth / 8) + player.x * 1.1), (((canvas.height / 2) - screenHeight / 8) + player.y * 1.1), playerRadius / 5, 0, Math.PI * 2, false);
	ctx.fillStyle = playerOutlineColor;
	ctx.fill();
	ctx.closePath();

	for (let i = 0; i < enemies.length; i++) {
		ctx.beginPath();
		ctx.arc((((canvas.width / 2) - screenWidth / 8) + player.x + enemies[i][0] / 10), (((canvas.height / 2) - screenHeight / 8) + player.y + enemies[i][1] / 10), enemyRadius / 5, 0, Math.PI * 2, false);
		ctx.fillStyle = enemyOutlineColor;
		ctx.fill();
		ctx.closePath();
	}
	for (let i = 0; i < bullets.length; i++) {
		ctx.beginPath();
		ctx.arc((((canvas.width / 2) - screenWidth / 8) + player.x + bullets[i][0] / 10), (((canvas.height / 2) - screenHeight / 8) + player.y + bullets[i][1] / 10), bulletThickness / 10, 0, Math.PI * 2, false);
		ctx.fillStyle = bulletColor;
		ctx.fill();
		ctx.closePath();
	}
}

function main() {
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	clearCanvas();
	switch (gameState) {
		case inMenu:
			doMenu();
			break;
		case inGame:
			doGame();
			break;
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

setInterval(main, 1);
