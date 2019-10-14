var
	canvas = document.getElementById("Pong")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")

const
	bgColor = "black"
	p1PaddleColor = "tomato"
	p2PaddleColor = "lightgreen"
	ballColor = "white"
	effectColor = "red"
	midlineColor = "white"

	paddleThickness = 20
	paddleWidth = canvas.height / 3
	paddleAcceleration = 0.1
	paddleSlowRate = 1.04
	maxVelocity = 4

	ballRadius = 10
	ballStartX = canvas.width / 2
	ballStartY = canvas.height / 2
	ballDXCap = 10
	ballAcceleration = 0.2

	player1StartX = 4
	player1StartY = (canvas.height + paddleWidth) / 4 + 3
	player2StartX = canvas.width - paddleThickness - 4
	player2StartY = (canvas.height + paddleWidth) / 4
	
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
	
	ball = {
		x : ballStartX,
		y : ballStartY,
		dx : -2,
		dy : 0,
	}

	mostRecentPoint = 0
	isPaused = false

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
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
	if (numOfPlayers == 2) {
		if (e.key == "o" || e.key == "O") {
			player2.up = true;
		}
		if (e.key == "l" || e.key == "L") {
			player2.down = true;
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
	if (numOfPlayers == 2) {
		if (e.key == "o" || e.key == "O") {
			player2.up = false;
		}
		if (e.key == "l" || e.key == "L") {
			player2.down = false;
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!isPaused) {
		if (numOfPlayers == 1) {
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
		accelerate(player1);
		accelerate(player2);
		calcPlayerCoords(player1);
		calcPlayerCoords(player2);
		doBorder(player1);
		doBorder(player2);
		moveBall();
	}
	drawMidline();
	drawBall();
	drawPaddle(player1);
	drawPaddle(player2);
	drawScore();
	calcWinner();
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
	playerN.y = (playerN.y < 0) ? (playerN.vel = -playerN.vel / 2, playerN.y = 0) : playerN.y = (playerN.y + paddleWidth > canvas.height) ? (playerN.vel = -playerN.vel / 2, playerN.y = canvas.height - paddleWidth) : playerN.y;
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
		ball.dy = (player1.y - ball.y + paddleWidth / 2) / -30;
	}
	if (ball.x + ballRadius > player2.x && ball.y + ballRadius > player2.y && ball.y - ballRadius < player2.y + paddleWidth) {
		player2.x += ball.dx * 2;
		ball.dx = -ball.dx - ballAcceleration;
		if (ball.dx < -ballDXCap) {
			ball.dx = -ballDXCap;
		}
		ball.dy = (ball.dy + ((player2.y - ball.y + paddleWidth / 2) / -(canvas.height / 40))) / 2;
	}
	if (player1.x < player1StartX) {
		player1.x += 0.1;
	}
	if (player2.x > player2StartX) {
		player2.x -= 0.1;
	}
}

function resetGame() {
	if (mostRecentPoint == 1) {
		ball.dx = 2;
	}
	else {
		ball.dx = -2;
	}
	ball.dy = 0;
	ball.x = ballStartX;
	ball.y = ballStartY;
	player1.vel = 0;
	player2.vel = 0;
	player1.y = player1StartY;
	player2.y = player2StartY;
	player1.up = false;
	player1.down = false;
	player2.up = false;
	player2.down = false;
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
	if (playerN == player1) {
		ctx.fillStyle = p1PaddleColor;
	}
	else {
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
	ctx.font = "12px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(ball.dx, 10, 10);
}

function calcWinner() {
	if (player1.points >= pointsToWin) {
		alert("Player 1 wins!");
		player1.points = 0;
		player2.points = 0;
		mostRecentPoint = 0;
		isPaused = true;
		resetGame();
	}
	if (player2.points >= pointsToWin) {
		alert("Player 2 wins!");
		player1.points = 0;
		player2.points = 0;
		mostRecentPoint = 0;
		isPaused = true;
		resetGame();
	}
}

var
interval = setInterval(draw, 1);
