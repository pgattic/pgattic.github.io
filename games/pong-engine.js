var
	canvas = document.getElementById("Pong")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")

const
	developerMode = false

	bgColor = "black"
	p1PaddleColor = "red"
	p2PaddleColor = "green"
	ballColor = "white"
	effectColor = "red"
	midlineColor = "white"

	paddleThickness = 20
	paddleWidth = (numOfPlayers > 2) ? (canvas.height / 4) : (canvas.height / 3)
	paddleAcceleration = 0.1 // default is 0.1
	paddleSlowRate = 1.02 //default is 1.02

	ballRadius = 10
	ballStartX = canvas.width / 2
	ballStartY = canvas.height / 2
	ballStartDX = -3
	theoreticalBallDXCap = paddleThickness + ballRadius * 2 - 1// 39
	ballDXCap = 8
	ballAcceleration = 0.2

	wallFriction = 0.5

	paddleStartY = canvas.height / 2 - paddleWidth / 2

	player1StartX = 4
	player1StartY = paddleStartY + 1

	player2StartX = canvas.width - paddleThickness - 4
	player2StartY = paddleStartY

	player3StartX = canvas.width / 4 + player1StartX
	player3StartY = paddleStartY + 1

	player4StartX = canvas.width * (3/4) - paddleThickness
	player4StartY = paddleStartY

	pointsToWin = 3


var
	player1 = {
		x : player1StartX,
		y : player1StartY,
		vel : 0,
		points : 0,
	}

	player2 = {
		x : player2StartX,
		y : player2StartY,
		vel : 0,
		points : 0,
	}
	
	player3 = {
		x : player3StartX,
		y : player3StartY,
		vel : 0,
		points : 0,
	}

	player4 = {
		x : player4StartX,
		y : player4StartY,
		vel : 0,
		points : 0,
	}
	
	ball = {
		x : ballStartX,
		y : ballStartY,
		dx : ballStartDX,
		dy : 0,
	}

	mostRecentPoint = 0
	isPaused = false

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry! However, if you really want to, you can still try.')
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if (e.key == "q" || e.key == "Q") {
		player1.up = true;
	}
	if (e.key == "a" || e.key == "A") {
		player1.down = true;
	}
	if (numOfPlayers >= 2) {
		if (e.key == "p" || e.key == "P") {
			player2.up = true;
		}
		if (e.key == ";" || e.key == ":") {
			player2.down = true;
		}
	}
	if (numOfPlayers >= 3) {
		if (e.key == "r" || e.key == "R") {
			player3.up = true;
		}
		if (e.key == "f" || e.key == "F") {
			player3.down = true;
		}
	}
	if (numOfPlayers >= 4) {
		if (e.key == "u" || e.key == "U") {
			player4.up = true;
		}
		if (e.key == "j" || e.key == "J") {
			player4.down = true;
		}
	}
	if (e.key == " " || e.key == "Enter") {
		isPaused = !isPaused;
	}
}

function keyUpHandler(e) {
	if (e.key == "q" || e.key == "Q") {
		player1.up = false;
	}
	if (e.key == "a" || e.key == "A") {
		player1.down = false;
	}
	if (numOfPlayers >= 2) {
		if (e.key == "p" || e.key == "P") {
			player2.up = false;
		}
		if (e.key == ";" || e.key == ":") {
			player2.down = false;
		}
	}
	if (numOfPlayers >= 3) {
		if (e.key == "r" || e.key == "R") {
			player3.up = false;
		}
		if (e.key == "f" || e.key == "F") {
			player3.down = false;
		}
	}
	if (numOfPlayers >= 4) {
		if (e.key == "u" || e.key == "U") {
			player4.up = false;
		}
		if (e.key == "j" || e.key == "J") {
			player4.down = false;
		}
	}
}

function aiCalc() {
	if (ball.x > canvas.width * (2/5)) {
		if (player2.y + (paddleWidth / 2) > ball.y) {
			player2.up = true;
			player2.down = false;
		}
		else if (player2.y + (paddleWidth / 2) < ball.y) {
			player2.up = false;
			player2.down = true;
		}
		else {
			player2.up = false;
			player2.down = false;
		}
	}
	else {
		player2.up = false;
		player2.down = false;
	}
}

function accelerate(playerN) {
	if (playerN.up) {
		playerN.vel -= paddleAcceleration;
	}
	if (playerN.down) {
		playerN.vel += paddleAcceleration;
	}
	playerN.vel /= paddleSlowRate;
}

function calcPlayerCoords(playerN) {
	playerN.y += playerN.vel;
}

function doBorder(playerN) {
	playerN.y = (playerN.y < 0) ? (playerN.vel = -playerN.vel * wallFriction, playerN.y = 0) : playerN.y = (playerN.y + paddleWidth > canvas.height) ? (playerN.vel = -playerN.vel * wallFriction, playerN.y = canvas.height - paddleWidth) : playerN.y;
//	if (playerN.y < 0) {
//		playerN.vel = 0;
//		playerN.y = 0;
//	if (playerN.y + paddleWidth > canvas.height) {
//		playerN.vel = 0;
//		playerN.y = canvas.height - paddleWidth;
//	}
}

function moveBall() {
	if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
		ball.dy = -ball.dy;
	}
	ball.x += ball.dx;
	ball.y += ball.dy;
	if (ball.x < 0) {
		player2.points++;
		mostRecentPoint = 2;
		resetGame();
	}
	if (ball.x > canvas.width) {
		player1.points++;
		mostRecentPoint = 1;
		resetGame();
	}
	if (ball.x - ballRadius < player1.x + paddleThickness && ball.y + ballRadius > player1.y && ball.y - ballRadius < player1.y + paddleWidth) {
		player1.x += ball.dx * 2;
		ball.dx = -ball.dx + ballAcceleration;
		if (ball.dx > ballDXCap) {
			ball.dx = ballDXCap;
		}
		player1.dy += ball.dy / 4;
		ball.dy = (player1.y - ball.y + paddleWidth / 2) / -30;
	}
	if (ball.x + ballRadius > player2.x && ball.y + ballRadius > player2.y && ball.y - ballRadius < player2.y + paddleWidth) {
		player2.x += ball.dx * 2;
		ball.dx = -ball.dx - ballAcceleration;
		if (ball.dx < -ballDXCap) {
			ball.dx = -ballDXCap;
		}
		player2.dy += ball.dy / 4;
		ball.dy = (ball.dy + ((player2.y - ball.y + paddleWidth / 2) / -(canvas.height / 40))) / 2;
	}

	if (numOfPlayers >= 3) {
		if (ball.x - ballRadius < player3.x + paddleThickness && ball.y + ballRadius > player3.y && ball.y - ballRadius < player3.y + paddleWidth && ball.x + ballRadius > player3.x) {
			player3.x += ball.dx * 2;
			if (ball.dx < 0) {
				ball.dx = -ball.dx + ballAcceleration;
			}
			else {
				ball.dx = -ball.dx - ballAcceleration;
			}
			if (ball.dx > ballDXCap) {
				ball.dx = ballDXCap;
			}
			ball.dy = (player3.y - ball.y + paddleWidth / 2) / -30;
		}
	}
	if (numOfPlayers >= 4) {
		if (ball.x + ballRadius > player4.x && ball.y + ballRadius > player4.y && ball.y - ballRadius < player4.y + paddleWidth && ball.x - ballRadius < player4.x + paddleThickness) {
			player4.x += ball.dx * 2;
			if (ball.dx < 0) {
				ball.dx = -ball.dx + ballAcceleration;
			}
			else {
				ball.dx = -ball.dx - ballAcceleration;
			}
			if (ball.dx < -ballDXCap) {
				ball.dx = -ballDXCap;
			}
			ball.dy = (ball.dy + ((player4.y - ball.y + paddleWidth / 2) / -(canvas.height / 40))) / 2;
		}
	}

	if (player1.x < player1StartX) {
		player1.x += 0.1;
	}
	else if (player1.x > player1StartX) {
		player1.x -= 0.1;
	}
	if (player2.x > player2StartX) {
		player2.x -= 0.1;
	}
	else if (player2.x < player2StartX) {
		player2.x += 0.1;
	}
	if (player3.x < player3StartX) {
		player3.x += 0.1;
	}
	else if (player3.x > player3StartX) {
		player3.x -= 0.1;
	}
	if (player4.x > player4StartX) {
		player4.x -= 0.1;
	}
	else if (player4.x < player4StartX) {
		player4.x += 0.1;
	}
}

function resetGame() {
	if (mostRecentPoint == 1) {
		ball.dx = -ballStartDX;
	}
	else {
		ball.dx = ballStartDX;
	}
	ball.dy = 0;
	ball.x = ballStartX;
	ball.y = ballStartY;
	player1.vel = 0;
	player2.vel = 0;
	player3.vel = 0;
	player4.vel = 0;
	player1.y = player1StartY;
	player2.y = player2StartY;
	player3.y = player1StartY;
	player4.y = player2StartY;
	player1.up = false;
	player1.down = false;
	player2.up = false;
	player2.down = false;
	player3.up = false;
	player3.down = false;
	player4.up = false;
	player4.down = false;
}

function drawMidline() {
	ctx.beginPath();
	ctx.setLineDash([10, 10]);
	ctx.moveTo(canvas.width / 2, 4);
	ctx.lineTo(canvas.width / 2, canvas.height + 4);
	ctx.lineWidth = 3.5;
	ctx.strokeStyle = midlineColor;
	ctx.stroke();
}

function drawPaddle(playerN) {
	ctx.beginPath();
	ctx.rect(playerN.x, playerN.y, paddleThickness, paddleWidth);
	if (playerN == player1 || playerN == player3) {
		ctx.fillStyle = p1PaddleColor;
	}
	else if (playerN == player2 || playerN == player4){
		ctx.fillStyle = p2PaddleColor;
	}
	ctx.fill();
	ctx.closePath();
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.font = "bolder 36px Courier New";
	ctx.fillStyle = p1PaddleColor;
	ctx.fillText(player1.points, paddleThickness + 10, 50);
	ctx.font = "bolder 36px Courier New";
	ctx.fillStyle = p2PaddleColor;
	ctx.fillText(player2.points, canvas.width - (paddleThickness + 30), 50);
	if (developerMode) {
		ctx.font = "12px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(ball.dx, 10, 10);
	}
}

function calcWinner() {
	if (player1.points >= pointsToWin) {
		alert("Red Team wins!");
		player1.points = 0;
		player2.points = 0;
		mostRecentPoint = 0;
		isPaused = true;
		resetGame();
	}
	if (player2.points >= pointsToWin) {
		alert("Green Team wins!");
		player1.points = 0;
		player2.points = 0;
		mostRecentPoint = 0;
		isPaused = true;
		resetGame();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!isPaused) {
		if (numOfPlayers == 1) {
			aiCalc();
		}
		accelerate(player1);
		accelerate(player2);
		accelerate(player3);
		accelerate(player4);
		calcPlayerCoords(player1);
		calcPlayerCoords(player2);
		calcPlayerCoords(player3);
		calcPlayerCoords(player4);
		doBorder(player1);
		doBorder(player2);
		doBorder(player3);
		doBorder(player4);
		moveBall();
	}
	drawMidline();
	drawBall();
	drawPaddle(player1);
	drawPaddle(player2);
	if (numOfPlayers >= 3) {
		drawPaddle(player3);
	}
	if (numOfPlayers >= 4) {
	drawPaddle(player4);
	}
	drawScore();
	if (isPaused) {
		ctx.font = "bold 72px Arial";
		ctx.fillStyle = midlineColor;
		ctx.textAlign = "center";
		ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
	}
	calcWinner();
}

var
interval = setInterval(draw, 1);
