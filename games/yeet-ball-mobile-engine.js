var
	canvas = document.getElementById("GWar")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")
	
const
	
	screenWidth = 1200
	screenHeight = 1200

	pauseWidth = 40
	pauseX = canvas.width - pauseWidth
	pauseY = 0

	superWidth = 40
	superX = canvas.width - superWidth - pauseWidth
	superY = 0

	dPadRadius = 75
	dPadX = dPadRadius + 30
	dPadY = canvas.height - dPadRadius - 30

	dPad2Radius = 75
	dPad2X = canvas.width - (dPad2Radius + 30)
	dPad2Y = canvas.height - dPad2Radius - 30

	playerRadius = 10
	playerStartX = screenWidth / 2
	playerStartY = screenHeight / 2
	playerAccel = 0.1
	playerSlowRate = 1.04
	playerHitBoxRadius = playerRadius

	bulletRadius = 10
	bulletSpeed = 5
	gapBetweenSuperBullets = 30

	enemyRadius = 10
	enemySpeed = 0.5
	enemyHitBoxRadius = enemyRadius * 1.5
	enemySpawnConstant = 300
	enemyPtValue = 100
	enemyWaitLimit = 80

	kToPowerUp = 40
	powerUpSize = 20
	
var
	mouseX = canvas.width / 2
	mouseY = canvas.height / 2
	mouseUIX = 0
	mouseUIY = 0
	upPressed = false
	downPressed = false
	leftPressed = false
	rightPressed = false
	dTouchX = dPadX
	dTouchY = dPadY

ctx.translate((canvas.width - screenWidth) / 2, (canvas.height - screenHeight) / 2);

	player = {
		x : playerStartX,
		y : playerStartY,
		xVel : 0,
		yVel : 0,
	}
	powerUp = {
		x : [0],
		y : [0],
		alive : [false],
		numSpawned : 0,
		wait : 0,
	}

	superBulletSpeed = 20
	
	bulletX = [0]
	bulletY = [0]
	bulletDX = [0]
	bulletDY = [0]
	bulletTimer = [0]
	bulletsLoaded = 0
	bulletAlive = [false]
	bulletSuper = [false]
	superTimer = -1
	
	enemyX = [5]
	enemyY = [5]
	enemysLoaded = 1
	enemysKilled = 1
	enemyAlive = [false]
	enemySpawnRate = 0
	enemyWait = 500
	
	isPaused = false
	playerLives = 3
	powerUpsLeft = 3
	playerPoints = 0		

document.addEventListener("touchmove", touchMoveHandler, false);
document.addEventListener("touchstart", touchHandler, false);
document.addEventListener("touchend", touchEndHandler, false);

function touchMoveHandler(e) {
	var touches = e.changedTouches;
	for(var i=0; i < e.changedTouches.length; i++) {
		var touchId = e.changedTouches[i].identifier;
		var touchX = e.changedTouches[i].pageX;
		var touchY = e.changedTouches[i].pageY;
		if (!isPaused) {
			if (Math.abs(touchX - dPadX) <= dPadRadius && Math.abs(touchY - dPadY) <= dPadRadius) {
				dTouchX = touchX + player.x - canvas.width / 2;
				dTouchY = touchY + player.y - canvas.height / 2;
				if (touchY - dPadY <= 25) {
					upPressed = true;
				} else {
					upPressed = false;
				}
				if (dPadY - touchY <= 25) {
					downPressed = true;
				} else {
					downPressed = false;
				}
				if (touchX - dPadX <= 25) {
					leftPressed = true;
				} else {
					leftPressed = false;
				}
				if (dPadX - touchX <= 25) {
					rightPressed = true;
				} else {
					rightPressed = false;
				}
			}
		}
	}
}

function touchHandler(e) {
	var touches = e.changedTouches;
	for(var i=0; i < e.changedTouches.length; i++) {
		var touchId = e.changedTouches[i].identifier;
		var touchX = e.changedTouches[i].pageX;
		var touchY = e.changedTouches[i].pageY;
		if (touchX >= pauseX && touchY >= 0 && touchY <= pauseWidth) {
			isPaused = !isPaused;
		}
		if (touchX >= superX && touchX <= superX + pauseWidth && touchY >= 0 && touchY <= pauseWidth) {
			if (!isPaused) {
				if (powerUpsLeft > 0) {
					superTimer = 250;
					powerUpsLeft--;
					for (let i = 1; i < Math.floor(screenWidth / gapBetweenSuperBullets); i++) {
						for (let i = bulletsLoaded + 1; i > 0; i--) {
							bulletX[i] = bulletX[i - 1];
							bulletY[i] = bulletY[i - 1];
							bulletDX[i] = bulletDX[i - 1];
							bulletDY[i] = bulletDY[i - 1];
							bulletTimer[i] = bulletTimer[i - 1];
							bulletAlive[i] = bulletAlive[i - 1];
							bulletSuper[i] = bulletSuper[i - 1];
						}
						bulletX[0] = 10;
						bulletY[0] = (gapBetweenSuperBullets * i) - 10;
						bulletDX[0] = superBulletSpeed;
						bulletDY[0] = 0;
						bulletTimer[0] = 1200;
						bulletAlive[0] = true;
						bulletSuper[0] = true;
						bulletsLoaded++;
					}
				}
			}
		}
		if (!isPaused) {
			if (Math.abs(touchX - dPad2X) <= dPad2Radius && Math.abs(touchY - dPad2Y) <= dPad2Radius && superTimer < 0) {
				bulletsLoaded++;
				for (let i = bulletsLoaded; i > 0; i--) {
					bulletX[i] = bulletX[i - 1];
					bulletY[i] = bulletY[i - 1];
					bulletDX[i] = bulletDX[i - 1];
					bulletDY[i] = bulletDY[i - 1];
					bulletTimer[i] = bulletTimer[i - 1];
					bulletAlive[i] = bulletAlive[i - 1];
					bulletSuper[i] = bulletSuper[i - 1];
				}
				bulletAlive[0] = true;
				bulletSuper[0] = false;
				let bulletRise = touchY - dPad2Y;
				let bulletRun = touchX - dPad2X;
				let bulletDZ = Math.sqrt(Math.pow(bulletRun, 2) + Math.pow(bulletRise, 2));
				bulletTimer[0] = ((screenWidth + screenHeight) / 2) * Math.sqrt(2);
				bulletDY[0] = (bulletRise / bulletDZ) * bulletSpeed;
				bulletDX[0] = (bulletRun / bulletDZ) * bulletSpeed;
				bulletX[0] = player.x;
				bulletY[0] = player.y;
			}
		}
	}
}

function touchEndHandler() {
	upPressed = false;
	downPressed = false;
	leftPressed = false;
	rightPressed = false;
}

function clearCanvas() {
	ctx.clearRect(-screenWidth / 2, -screenHeight / 2, screenWidth * 2.5, screenHeight * 2.5);
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
	ctx.translate(-player.xVel, -player.yVel)
	player.x = player.x + player.xVel;
	player.y = player.y + player.yVel;
	dTouchX += player.xVel
	dTouchY += player.yVel
	mouseX = mouseX + player.xVel;
	mouseY = mouseY + player.yVel;
}

function doBoundary() {
	if (player.x + playerRadius > screenWidth) { 
		player.xVel = 0;
		player.x--;
		ctx.translate(1, 0)
	}
	if (player.x - playerRadius < 0) { 
		player.xVel = 0;
		player.x++;
		ctx.translate(-1, 0)
	}
	if (player.y + playerRadius > screenHeight) { 
		player.yVel = 0;
		player.y--;
		ctx.translate(0, 1)
	}
	if (player.y - playerRadius < 0) { 
		player.yVel = 0;
		player.y++;
		ctx.translate(0, -1)
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
	for (let i = 0; i < bulletsLoaded; i++) {
		if (bulletX[i] < 0 || bulletX[i] > screenWidth || bulletY[i] < 0 || bulletY[i] > screenHeight) {
			bulletAlive[i] = false;
		}
		if (bulletAlive[i]) {
			ctx.beginPath();
			ctx.moveTo(bulletX[i], bulletY[i]);
			ctx.lineTo(bulletX[i] + bulletDX[i] * (30 / bulletSpeed), bulletY[i] + bulletDY[i] * (30 / bulletSpeed));
			ctx.lineWidth = 8;
			ctx.strokeStyle = bulletColor;
			ctx.stroke();
			bulletX[i] = bulletX[i] + bulletDX[i];
			bulletY[i] = bulletY[i] + bulletDY[i];
		}
		else {
			bulletX[i] = 4000;
		}
		bulletTimer[i]--;
		if (bulletTimer[i] <= 0) {
			bulletsLoaded--;
		}
	}
}

function drawBadGuy() {
	enemyWait--;
	if (enemyWait == 0) {
		enemysLoaded++;
		for (let i = enemysLoaded; i > 0; i--) {
			enemyX[i] = enemyX[i - 1];
			enemyY[i] = enemyY[i - 1];
			enemyAlive[i] = enemyAlive[i - 1];
		}
		let onTop = Math.floor(Math.random() * 4);
		if (onTop == 0) {
			enemyX[1] = enemyRadius;
			enemyY[1] = screenHeight * Math.random();
		}
		else if (onTop == 1) {
			enemyX[1] = screenWidth - enemyRadius;
			enemyY[1] = screenHeight * Math.random();
		}
		else if (onTop == 2) {
			enemyX[1] = screenWidth * Math.random();
			enemyY[1] = enemyRadius;
		}
		else if (onTop == 3) {
			enemyX[1] = screenWidth * Math.random();
			enemyY[1] = screenHeight - enemyRadius;
		}
		enemyAlive[1] = true;
		enemyWait = enemySpawnConstant - (enemySpawnRate * 5);
		if (enemyWait < enemyWaitLimit) {
			enemyWait = enemyWaitLimit;
		}
	}
	for (let i = 1; i < enemysLoaded + 1; i++) {
		if (enemyAlive[i]) {
			let enemyRise = player.y - enemyY[i];
			let enemyRun = player.x - enemyX[i];
			let enemyDZ = Math.sqrt(Math.pow(enemyRun, 2) + Math.pow(enemyRise, 2));
			let enemyDY = (enemyRise / enemyDZ) * enemySpeed;
			let enemyDX = (enemyRun / enemyDZ) * enemySpeed;
			enemyX[i] = enemyX[i] + enemyDX;
			enemyY[i] = enemyY[i] + enemyDY;
			ctx.beginPath();
			ctx.arc(enemyX[i], enemyY[i], enemyRadius + 3, 0, Math.PI * 2, false);
			ctx.fillStyle = enemyOutlineColor;
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(enemyX[i], enemyY[i], enemyRadius, 0, Math.PI * 2, false);
			ctx.fillStyle = enemyColor;
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc((((canvas.width / 2) - screenWidth / 8) + player.x + enemyX[i] / 10), (((canvas.height / 2) - screenHeight / 8) + player.y + enemyY[i] / 10), enemyRadius / 5, 0, Math.PI * 2, false);
			ctx.fillStyle = enemyOutlineColor;
			ctx.fill();
			ctx.closePath();
		}
		else {
			enemyX[i] = 5000;
		}
	}
}

function enemyKill() {
	for (let i = 1; i < enemysLoaded; i++) {
		for (let e = 0; e < bulletsLoaded; e++) {
			if ((Math.abs(bulletX[e] - enemyX[i]) < enemyHitBoxRadius && Math.abs(bulletY[e] - enemyY[i]) < enemyHitBoxRadius) && enemyAlive[i] && bulletAlive[e]) {
				enemyAlive[i] = false;
				if (!bulletSuper[e]) {
					bulletAlive[e] = false;
				}
				enemysKilled++;
				enemySpawnRate++;
				powerUp.wait++;
				playerPoints = playerPoints + enemyPtValue;
				if (powerUp.wait >= kToPowerUp) {
					powerUp.wait = 0;
					powerUp.alive[powerUp.numSpawned] = true;
					powerUp.x[powerUp.numSpawned] = enemyX[i] - powerUpSize / 2;
					powerUp.y[powerUp.numSpawned] = enemyY[i] - powerUpSize / 2;
					powerUp.numSpawned++;
				}
			}
		}
	}
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
	for (let i = 1; i < enemysLoaded + 1; i++) {
		if (Math.abs(enemyX[i] - player.x) < playerHitBoxRadius && Math.abs(enemyY[i] - player.y) < playerHitBoxRadius) {
			ctx.translate(player.x - screenWidth / 2, player.y - screenHeight / 2);
			mouseX = mouseX - (player.x - screenWidth / 2)
			mouseY = mouseY - (player.y - screenHeight / 2)
			playerLives--;
			player.x = playerStartX;
			player.y = playerStartY;
			player.xVel = 0;
			player.yVel = 0;
			enemyWait = 500;
			for (i = 0; i <= bulletsLoaded; i++) {
				bulletTimer[i] = 0;
			}
			enemySpawnRate = Math.round(enemySpawnRate / 2);
			for (let i = 1; i < enemysLoaded + 1; i++) {
				enemyAlive[i] = false;
			}
			if (playerLives == 0) {
				alert("Game Over!\nYou killed " + (enemysKilled - 1) + " enemies.");

				mouseX = canvas.width / 2
				mouseY = canvas.height / 2
				mouseUIX = 0
				mouseUIY = 0
				upPressed = false
				downPressed = false
				leftPressed = false
				rightPressed = false
				dTouchX = dPadX
				dTouchY = dPadY

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.translate((canvas.width - screenWidth) / 2, (canvas.height - screenHeight) / 2);

				player.x = playerStartX
				player.y = playerStartY
				player.xVel = 0
				player.yVel = 0

				powerUp.x = [0]
				powerUp.y = [0]
				powerUp.alive = [false]
				powerUp.numSpawned = 0
				powerUp.wait = 0
				
				superBulletSpeed = 20
				
				bulletX = [0]
				bulletY = [0]
				bulletDX = [0]
				bulletDY = [0]
				bulletTimer = [0]
				bulletsLoaded = 0
				bulletAlive = [false]
				bulletSuper = [false]
				superTimer = -1
				
				enemyX = [5]
				enemyY = [5]
				enemysLoaded = 1
				enemysKilled = 1
				enemyAlive = [false]
				enemySpawnRate = 0
				enemyWait = 500
				
				isPaused = false
				playerLives = 3
				powerUpsLeft = 3
				playerPoints = 0		

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

function drawMiniMap() {
	ctx.beginPath();
	ctx.rect(((canvas.width / 2) - screenWidth / 8) + player.x, ((canvas.height / 2) - screenHeight / 8) + player.y, screenWidth / 10, screenHeight / 10);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.stroke();
	ctx.closePath();
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
	
	for (let i = 1; i < enemysLoaded + 1; i++) {
		if (enemyAlive[i]) {
			ctx.beginPath();
			ctx.arc((((canvas.width / 2) - screenWidth / 8) + player.x + enemyX[i] / 10), (((canvas.height / 2) - screenHeight / 8) + player.y + enemyY[i] / 10), enemyRadius / 5, 0, Math.PI * 2, false);
			ctx.fillStyle = enemyOutlineColor;
			ctx.fill();
			ctx.closePath();
		}
	}
}

function drawPause() {
	ctx.beginPath();
	ctx.rect(pauseX + player.x - canvas.width / 2, pauseY + player.y - canvas.height / 2, pauseWidth, pauseWidth);
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.rect(superX + player.x - canvas.width / 2, superY + player.y - canvas.height / 2, pauseWidth, pauseWidth);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.stroke();
	ctx.closePath();
}

function drawDPad() {
	ctx.beginPath();
	ctx.arc(player.x - canvas.width / 2 + dPadX, player.y - canvas.height / 2 + dPadY, dPadRadius, 0, Math.PI * 2, false)
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(dTouchX, dTouchY, dPadRadius / 2, 0, Math.PI * 2, false)
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(player.x - canvas.width / 2 + dPad2X, player.y - canvas.height / 2 + dPad2Y, dPadRadius, 0, Math.PI * 2, false)
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(player.x - canvas.width / 2 + dPad2X, player.y - canvas.height / 2 + dPad2Y, dPadRadius / 2, 0, Math.PI * 2, false)
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();
}

function draw() {
	clearCanvas();
	if (!isPaused) {
		calcPlayerCoord();
		acceleratePlayer();
		doBoundary();
		drawBG();
		animateBullet();
		enemyKill();
		drawBadGuy();
		enemyKill();
		drawBorder();
		playerKill();
		drawPlayer();
		drawPowerUp();
		drawMiniMap()
		superTimer--;
	}
	else {
		drawBG();
		drawBorder();
		drawPlayer();
		drawMiniMap();
		ctx.font = "bolder 72px Arial";
		ctx.fillStyle = lineColor;
		ctx.fillText("PAUSED", player.x - 150, player.y);
	}
	drawPause();
	drawDPad();
	ctx.font = "16px Arial";
	ctx.fillStyle = lineColor;
	ctx.fillText("Lives: " + playerLives, 20 + player.x - canvas.width / 2, 30 + player.y - canvas.height / 2);
	ctx.fillText("Points: " + playerPoints, 20 + player.x - canvas.width / 2, 54 + player.y - canvas.height / 2);
	ctx.fillText("Super: " + powerUpsLeft, 20 + player.x - canvas.width / 2, 78 + player.y - canvas.height / 2);
}

var interval = setInterval(draw, 4);
