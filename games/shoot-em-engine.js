var
	canvas = document.getElementById("GWar")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")
	
const
	
	screenWidth = 1200
	screenHeight = 1200

	playerRadius = 10
	playerStartX = canvas.width / 2
	playerStartY = canvas.height / 2
	playerAccel = 0.1
	playerSlowRate = 1.04
	playerHitBoxRadius = playerRadius

	bulletRadius = 10
	bulletSpeed = 5
	gapBetweenSuperBullets = 30

	badGuyRadius = 10
	badGuySpeed = 0.5
	badGuyHitBoxRadius = badGuyRadius * 1.5
	badGuySpawnConstant = 300
	badGuyPtValue = 100
	badGuyWaitLimit = 80

	kToPowerUp = 50
	powerUpSize = 20
	
var
	mouseX = playerStartX
	mouseY = playerStartY
	upPressed = false
	downPressed = false
	leftPressed = false
	rightPressed = false
	
	playerX = playerStartX
	playerY = playerStartY
	playerXVel = 0
	playerYVel = 0
	spawnVariable = 0

	powerUpX = [0]
	powerUpY = [0]
	powerUpAlive = [false]
	powerUpsSpawned = 0
	powerUpVar = 0
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
	
	badGuyX = [5]
	badGuyY = [5]
	badGuyWait = 500
	badGuysLoaded = 1
	badGuysKilled = 1
	badGuyAlive = [false]
	
	isPaused = false
	playerLives = 3
	powerUpsLeft = 3
	playerPoints = 0		


document.addEventListener("mousemove", getMouse, false);
document.addEventListener("click", getClick, false);
document.addEventListener("keydown", getKeys, false);
document.addEventListener("keyup", unGetKeys, false);

function getMouse(e) {
   mouseX = e.clientX - canvas.offsetLeft + playerX;
   mouseY = e.clientY - canvas.offsetTop + playerY;
}

function getClick() {
	if (!isPaused) {
		if (superTimer < 0) {
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
			let bulletRise = mouseY - playerY;
			let bulletRun = mouseX - playerX;
			let bulletDZ = Math.sqrt(Math.pow(bulletRun, 2) + Math.pow(bulletRise, 2));
			bulletTimer[0] = ((screenWidth + screenHeight) / 2) * Math.sqrt(2);
			bulletDY[0] = (bulletRise / bulletDZ) * bulletSpeed;
			bulletDX[0] = (bulletRun / bulletDZ) * bulletSpeed;
			bulletX[0] = playerX;
			bulletY[0] = playerY;
		}
	}
}

function getKeys(e) {
	if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
		upPressed = true;
	}
	if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
		downPressed = true;
	}
	
	if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
		leftPressed = true;
	}
	if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
		rightPressed = true;
	}
	if (e.key == "q") {
		isPaused = !isPaused;
	}
}

function unGetKeys(e) {
	if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
		upPressed = false;
	}
	else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
		downPressed = false;
	}
	
	if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
		leftPressed = false;
	}
	else if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
		rightPressed = false;
	}
	if (e.key == "e") {
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
	if (e.key == " ") {
		getClick();
	}
}

function clearCanvas() {
	ctx.clearRect(-screenWidth / 2, -screenHeight / 2, screenWidth * 2.5, screenHeight * 2.5);
}

function makeCrosshair() {
	document.getElementById("GWar").style.cursor = "crosshair";
}

function makeCursor() {
	document.getElementById("GWar").style.cursor = "default";
}

function acceleratePlayer() {
	if (upPressed) {
		playerYVel = playerYVel - playerAccel;
	}
	if (downPressed) {
		playerYVel = playerYVel + playerAccel;
	}
	if (leftPressed) {
		playerXVel = playerXVel - playerAccel;
	}
	if (rightPressed) {
		playerXVel = playerXVel + playerAccel;
	}
	playerYVel = playerYVel / playerSlowRate;
	playerXVel = playerXVel / playerSlowRate;
}

function calcPlayerCoord() {
	ctx.translate(-playerXVel, -playerYVel)
	playerX = playerX + playerXVel;
	playerY = playerY + playerYVel;
	mouseX = mouseX + playerXVel;
	mouseY = mouseY + playerYVel;
}

function doBoundary() {
	if (playerX + playerRadius > screenWidth) { 
		playerXVel = 0;
		playerX--;
		ctx.translate(1, 0)
	}
	if (playerX - playerRadius < 0) { 
		playerXVel = 0;
		playerX++;
		ctx.translate(-1, 0)
	}
	if (playerY + playerRadius > screenHeight) { 
		playerYVel = 0;
		playerY--;
		ctx.translate(0, 1)
	}
	if (playerY - playerRadius < 0) { 
		playerYVel = 0;
		playerY++;
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
	badGuyWait--;
	if (badGuyWait == 0) {
		badGuysLoaded++;
		for (let i = badGuysLoaded; i > 0; i--) {
			badGuyX[i] = badGuyX[i - 1];
			badGuyY[i] = badGuyY[i - 1];
			badGuyAlive[i] = badGuyAlive[i - 1];
		}
		let onTop = Math.floor(Math.random() * 4);
		if (onTop == 0) {
			badGuyX[1] = badGuyRadius;
			badGuyY[1] = screenHeight * Math.random();
		}
		else if (onTop == 1) {
			badGuyX[1] = screenWidth - badGuyRadius;
			badGuyY[1] = screenHeight * Math.random();
		}
		else if (onTop == 2) {
			badGuyX[1] = screenWidth * Math.random();
			badGuyY[1] = badGuyRadius;
		}
		else if (onTop == 3) {
			badGuyX[1] = screenWidth * Math.random();
			badGuyY[1] = screenHeight - badGuyRadius;
		}
		badGuyAlive[1] = true;
		badGuyWait = badGuySpawnConstant - (spawnVariable * 5);
		if (badGuyWait < badGuyWaitLimit) {
			badGuyWait = badGuyWaitLimit;
		}
	}
	for (let i = 1; i < badGuysLoaded + 1; i++) {
		if (badGuyAlive[i]) {
			let badGuyRise = playerY - badGuyY[i];
			let badGuyRun = playerX - badGuyX[i];
			let badGuyDZ = Math.sqrt(Math.pow(badGuyRun, 2) + Math.pow(badGuyRise, 2));
			let badGuyDY = (badGuyRise / badGuyDZ) * badGuySpeed;
			let badGuyDX = (badGuyRun / badGuyDZ) * badGuySpeed;
			badGuyX[i] = badGuyX[i] + badGuyDX;
			badGuyY[i] = badGuyY[i] + badGuyDY;
			ctx.beginPath();
			ctx.arc(badGuyX[i], badGuyY[i], badGuyRadius + 3, 0, Math.PI * 2, false);
			ctx.fillStyle = badGuyOutlineColor;
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(badGuyX[i], badGuyY[i], badGuyRadius, 0, Math.PI * 2, false);
			ctx.fillStyle = badGuyColor;
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc((((canvas.width / 2) - screenWidth / 8) + playerX + badGuyX[i] / 10), (((canvas.height / 2) - screenHeight / 8) + playerY + badGuyY[i] / 10), badGuyRadius / 5, 0, Math.PI * 2, false);
			ctx.fillStyle = badGuyOutlineColor;
			ctx.fill();
			ctx.closePath();
		}
		else {
			badGuyX[i] = 5000;
		}
	}
}

function badGuyKill() {
	for (let i = 1; i < badGuysLoaded; i++) {
		for (let e = 0; e < bulletsLoaded; e++) {
			if ((Math.abs(bulletX[e] - badGuyX[i]) < badGuyHitBoxRadius && Math.abs(bulletY[e] - badGuyY[i]) < badGuyHitBoxRadius) && badGuyAlive[i] && bulletAlive[e]) {
				badGuyAlive[i] = false;
				if (!bulletSuper[e]) {
					bulletAlive[e] = false;
				}
				badGuysKilled++;
				spawnVariable++;
				powerUpVar++;
				playerPoints = playerPoints + badGuyPtValue;
				if (powerUpVar >= kToPowerUp) {
					powerUpVar = 0;
					powerUpAlive[powerUpsSpawned] = true;
					powerUpX[powerUpsSpawned] = badGuyX[i] - powerUpSize / 2;
					powerUpY[powerUpsSpawned] = badGuyY[i] - powerUpSize / 2;
					powerUpsSpawned++;
				}
			}
		}
	}
}

function drawLine() {
	ctx.beginPath();
	ctx.moveTo(playerX, playerY);
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
	for (let i = 1; i < badGuysLoaded + 1; i++) {
		if (Math.abs(badGuyX[i] - playerX) < playerHitBoxRadius && Math.abs(badGuyY[i] - playerY) < playerHitBoxRadius) {
			ctx.translate(playerX - canvas.width / 2, playerY - canvas.height / 2);
			mouseX = mouseX - (playerX - screenWidth / 2)
			mouseY = mouseY - (playerY - screenHeight / 2)
			playerLives--;
			playerX = playerStartX;
			playerY = playerStartY;
			playerXVel = 0;
			playerYVel = 0;
			badGuyWait = 500;
			for (let i = 1; i < badGuysLoaded + 1; i++) {
				badGuyAlive[i] = false;
			}
			if (playerLives == 0) {
				alert("Game Over!\nYou killed " + (badGuysKilled - 1) + " enemies.");
				document.location.reload();
				clearInterval(interval);
			}
		}
	}
}

function drawPlayer() {
	ctx.beginPath();
	ctx.arc(playerX, playerY, playerRadius + 3, 0, Math.PI * 2, false);
	ctx.fillStyle = playerOutlineColor;
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = playerColor;
	ctx.fill();
	ctx.closePath();
	}

function drawPowerUp() {
	for (let i = 0; i < powerUpsSpawned; i++) {
		if (powerUpAlive[i]) {
			ctx.beginPath();
			ctx.fillStyle = powerUpOutlineColor;
			ctx.fillRect(powerUpX[i] - 3, powerUpY[i] - 3, powerUpSize + 6, powerUpSize + 6);
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = powerUpColor;
			ctx.fillRect(powerUpX[i], powerUpY[i], powerUpSize, powerUpSize);
			ctx.closePath();
		}
		if (Math.abs((powerUpX[i] + (powerUpSize / 2)) - playerX) < powerUpSize && Math.abs((powerUpY[i] + (powerUpSize / 2)) - playerY) < powerUpSize && powerUpAlive[i]) {
			playerLives++;
			powerUpAlive[i] = false;
		}
	}
}

function drawMiniMap() {
	ctx.beginPath();
	ctx.rect(((canvas.width / 2) - screenWidth / 8) + playerX, ((canvas.height / 2) - screenHeight / 8) + playerY, screenWidth / 10, screenHeight / 10);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = lineColor;
	ctx.stroke();
	ctx.closePath();
	for (let i = 1; i < 8; i++) {
		ctx.beginPath();
		ctx.moveTo(((canvas.width / 2) - screenWidth / 8) + playerX + (screenWidth / 80) * i, ((canvas.height / 2) - screenHeight / 8) + playerY);
		ctx.lineTo(((canvas.width / 2) - screenWidth / 8) + playerX + (screenWidth / 80) * i, ((canvas.height / 2) - screenHeight / 8) + playerY + (screenWidth / 10));
		ctx.lineWidth = 1;
		ctx.strokeStyle = gridColor;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(((canvas.width / 2) - screenWidth / 8) + playerX, ((canvas.height / 2) - screenHeight / 8) + playerY + (screenHeight / 80) * i);
		ctx.lineTo(((canvas.width / 2) - screenWidth / 8) + playerX + (screenWidth / 10), ((canvas.height / 2) - screenHeight / 8) + playerY + (screenHeight / 80) * i);
		ctx.lineWidth = 1;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}
	ctx.beginPath()
	ctx.rect(((((canvas.width / 2) - screenWidth / 8) + playerX * 1.1) - canvas.width / 20), ((((canvas.height / 2) - screenHeight / 8) + playerY * 1.1) - canvas.height / 20), canvas.width / 10, canvas.height / 10);
	ctx.lineWidth = 1;
	ctx.strokeStyle = miniMapColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc((((canvas.width / 2) - screenWidth / 8) + playerX * 1.1), (((canvas.height / 2) - screenHeight / 8) + playerY * 1.1), playerRadius / 5, 0, Math.PI * 2, false);
	ctx.fillStyle = playerOutlineColor;
	ctx.fill();
	ctx.closePath();
	
	for (let i = 1; i < badGuysLoaded + 1; i++) {
		if (badGuyAlive[i]) {
			ctx.beginPath();
			ctx.arc((((canvas.width / 2) - screenWidth / 8) + playerX + badGuyX[i] / 10), (((canvas.height / 2) - screenHeight / 8) + playerY + badGuyY[i] / 10), badGuyRadius / 5, 0, Math.PI * 2, false);
			ctx.fillStyle = badGuyOutlineColor;
			ctx.fill();
			ctx.closePath();
		}
	}
}

function draw() {
	clearCanvas();
	if (!isPaused) {
		makeCrosshair();
		calcPlayerCoord();
		acceleratePlayer();
		doBoundary();
		drawBG();
		animateBullet();
		badGuyKill();
		drawBadGuy();
		badGuyKill();
		drawLine();
		drawBorder();
		playerKill();
		drawPlayer();
		drawPowerUp();
		drawMiniMap()
		superTimer--;
	}
	else {
		makeCursor();
		drawBG();
		drawBorder();
		drawPlayer();
		drawMiniMap();
		ctx.font = "bolder 72px Arial";
		ctx.fillStyle = lineColor;
		ctx.fillText("PAUSED", playerX - 150, playerY);
	}
	ctx.font = "16px Arial";
	ctx.fillStyle = lineColor;
	ctx.fillText("Lives: " + playerLives, 20 + playerX - canvas.width / 2, 30 + playerY - canvas.height / 2);
	ctx.fillText("Points: " + playerPoints, 20 + playerX - canvas.width / 2, 54 + playerY - canvas.height / 2);
	ctx.fillText("Super: " + powerUpsLeft, 20 + playerX - canvas.width / 2, 78 + playerY - canvas.height / 2);
}

var interval = setInterval(draw, 1);
