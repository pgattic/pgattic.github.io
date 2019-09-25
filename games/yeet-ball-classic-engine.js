var
	canvas = document.getElementById("GWar")
	ctx = canvas.getContext("2d")
	
const
	playerRadius = 10
	playerStartX = canvas.width / 2
	playerStartY = canvas.height / 2
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
	enemySpawnRate = 0
	enemyWait = 500
	enemysLoaded = 1
	enemysKilled = 1
	enemyAlive = [false]
	
	isPaused = false
	playerLives = 3
	powerUpsLeft = 3
	playerPoints = 0

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

document.addEventListener("mousemove", getMouse, false);
document.addEventListener("click", getClick, false);
document.addEventListener("keydown", getKeys, false);
document.addEventListener("keyup", unGetKeys, false);

function getMouse(e) {
   mouseX = e.clientX - canvas.offsetLeft + playerStartX;
   mouseY = e.clientY - canvas.offsetTop + playerStartY;
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
			bulletTimer[0] = ((canvas.width + canvas.height) / 2) * Math.sqrt(2);
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
				for (let i = 1; i < Math.floor(canvas.width / gapBetweenSuperBullets); i++) {
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
					bulletDX[0] = 5;
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
	playerX = playerX + playerXVel;
	playerY = playerY + playerYVel;
}

function doBoundary() {
	if (playerX + playerRadius > canvas.width) { 
		playerXVel = 0;
		playerX--;
	}
	if (playerX - playerRadius < 0) { 
		playerXVel = 0;
		playerX++;
	}
	if (playerY + playerRadius > canvas.height) { 
		playerYVel = 0;
		playerY--;
	}
	if (playerY - playerRadius < 0) { 
		playerYVel = 0;
		playerY++;
	}
}

function drawBG() {
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.closePath();
	for (let i = 1; i < 8; i++) {
		ctx.beginPath();
		ctx.moveTo((canvas.width / 8) * i, 0);
		ctx.lineTo((canvas.width / 8) * i, canvas.height);
		ctx.lineWidth = 3;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, (canvas.height / 4) * i);
		ctx.lineTo(canvas.width, (canvas.height / 4) * i);
		ctx.lineWidth = 3;
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}
}

function drawBullet() {
	for (let i = 0; i < bulletsLoaded; i++) {
		if (bulletAlive[i]) {
			ctx.beginPath();
			ctx.moveTo(bulletX[i], bulletY[i]);
			ctx.lineTo(bulletX[i] + bulletDX[i] * (50 / bulletSpeed), bulletY[i] + bulletDY[i] * (50 / bulletSpeed));
			ctx.lineWidth = 12;
			ctx.strokeStyle = bulletColor;
			ctx.stroke();
			bulletX[i] = bulletX[i] + bulletDX[i];
			bulletY[i] = bulletY[i] + bulletDY[i];
		}
		bulletTimer[i]--;
		if (bulletTimer[i] <= 0) {
			bulletX[i] = NaN;
			bulletY[i] = NaN;
			bulletDX[i] = NaN;
			bulletDY[i] = NaN;
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
			enemyY[1] = canvas.height * Math.random();
		}
		else if (onTop == 1) {
			enemyX[1] = canvas.width - enemyRadius;
			enemyY[1] = canvas.height * Math.random();
		}
		else if (onTop == 2) {
			enemyX[1] = canvas.width * Math.random();
			enemyY[1] = enemyRadius;
		}
		else if (onTop == 3) {
			enemyX[1] = canvas.width * Math.random();
			enemyY[1] = canvas.height - enemyRadius;
		}
		enemyAlive[1] = true;
		enemyWait = enemySpawnConstant - (spawnVariable * 5);
		if (enemyWait < enemyWaitLimit) {
			enemyWait = enemyWaitLimit;
		}
	}
	for (let i = 1; i < enemysLoaded + 1; i++) {
		if (enemyAlive[i]) {
			let enemyRise = playerY - enemyY[i];
			let enemyRun = playerX - enemyX[i];
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
				spawnVariable++;
				powerUpVar++;
				playerPoints = playerPoints + enemyPtValue;
				if (powerUpVar >= kToPowerUp) {
					powerUpVar = 0;
					powerUpAlive[powerUpsSpawned] = true;
					powerUpX[powerUpsSpawned] = enemyX[i];
					powerUpY[powerUpsSpawned] = enemyY[i];
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

function playerKill() {
	for (let i = 1; i < enemysLoaded + 1; i++) {
		if (Math.abs(enemyX[i] - playerX) < playerHitBoxRadius && Math.abs(enemyY[i] - playerY) < playerHitBoxRadius) {
			playerLives--;
			playerX = playerStartX;
			playerY = playerStartY;
			playerXVel = 0;
			playerYVel = 0;
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
			if (Math.random() >= 0.5) {
				playerLives++;
			}
			else {
				powerUpsLeft++;
			}
			powerUpAlive[i] = false;
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
		drawBullet();
		enemyKill();
		drawBadGuy();
		enemyKill();
		drawLine();
		playerKill();
		drawPlayer();
		drawPowerUp();
		superTimer--;
	}
	else {
		makeCursor();
		drawBG();
		drawPlayer();
		ctx.font = "bolder 72px Arial";
		ctx.fillStyle = lineColor;
		ctx.fillText("PAUSED", canvas.width / 2 - 150, canvas.height / 2);
	}
	ctx.font = "bolder 12px Arial";
	ctx.fillStyle = lineColor;
	ctx.fillText("Lives: " + playerLives, 20, 30);
	ctx.fillText("Points: " + playerPoints, 20, 50);
	ctx.fillText("Super: " + powerUpsLeft, 20, 70);
}

var interval = setInterval(draw, 1);
