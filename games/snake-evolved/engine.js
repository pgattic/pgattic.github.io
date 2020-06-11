const
	mapSize = 650,
	turnSensitivity = 0.1,
	playerSpeed = 2,
	amtOfFood = 100,
	sprintingAtrophy = 0.5,
	playerSizeFloor = 150,
	mouthSize = 10,
	growthRate = 20,
	foodDropConstant = 30,
	snakeWidth = 10,
	mapBorderWidth = 10,
	foodRadius = 5,
	spectateDuration = 200,
	compassRadius = 10,
	spectateZoom = 0.5,
	bgColor = "#fff",
	mapBorderColor = "#000",
	foodColor = "#080",
	compassColor = "#000"
	pauseKey = "Escape",
	version = "v1.4.13";

var
	indexOfSpectate = 1,
	playerResolution = 1,
	playersInGame = [],
	playerDrawRate = 2, // how many segments of the player are skipped, plus one. higher number = less resolution on their curvature. 
	paused = false,
	food = [],
	seconds = 0,
	frames = 0,
	spectateCounter = 0;

document.getElementById("version").innerHTML = version;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

window.onresize = () => {
	resize();
}

resize();

onkeydown = () => {
	for (var e = 0; e < numOfPlayers; e++) {
		switch (event.key) {
			case players[e].upKey:
				players[e].up = true;
				break;
			case players[e].leftKey:
				players[e].left = true;
				break;
			case players[e].rightKey:
				players[e].right = true;
				break;
			case players[e].spawnKey:
				if (players[e].inGame) {
					doKill(e);
				}
				players[e].inGame = !players[e].inGame;
		}
	}
	if (event.key == pauseKey) {
		paused = !paused;
		document.getElementById("paused").style.display = paused ? "block" : "none";
		for (var i of canvas) {
			i.style.filter = paused ? "blur(1px)" : "blur(0)";
		}
	}
}

onkeyup = () => {
	for (var e = 0; e < numOfPlayers; e++) {
		switch (event.key) {
			case players[e].upKey:
				players[e].up = false;
				break;
			case players[e].leftKey:
				players[e].left = false;
				break;
			case players[e].rightKey:
				players[e].right = false;
				break;
		}
	}
}

function doSpectateCounter () {
	spectateCounter++;
	playersInGame = [];
	for (var e = 0; e < numOfPlayers; e++) {
		if (players[e].inGame) {
			playersInGame.push(e);
		}
	}
	indexOfSpectate = playersInGame[parseInt(spectateCounter / spectateDuration) % playersInGame.length];
}

function rotatePlayer(e) {
	if (players[e].left) {
		players[e].direction += turnSensitivity;
	}
	if (players[e].right) {
		players[e].direction -= turnSensitivity;
	}
}

function movePlayer(e) {
	var x = Math.cos(players[e].direction) * playerSpeed;
	var y = Math.sin(players[e].direction) * playerSpeed;
	players[e].location.unshift([players[e].location[0][0] + x, players[e].location[0][1] - y]);
	if (players[e].location.length > players[e].size) {
		players[e].location.pop();
	}
	while (players[e].location.length > players[e].size) {
		players[e].location.pop();
	}
}

function spawnFood() {
	if (food.length < amtOfFood) {
		var rad = Math.random() * Math.PI * 2;
		var dist = Math.random() * (mapSize - foodRadius);
		var x = Math.cos(rad) * dist;
		var y = Math.sin(rad) * dist;
		food.push([x, y]);
	}
}

function killPlayer(e) {
	if (Math.sqrt(players[e].location[0][0] ** 2 + players[e].location[0][1] ** 2) > mapSize) {
		doKill(e);
	}
	for (var i = 0; i < numOfPlayers; i++) {
		if (i != e && players[i].inGame) {
			for (var c = 0; c < players[i].location.length; c++) {
				var x = players[e].location[0][0] - players[i].location[c][0];
				var y = players[e].location[0][1] - players[i].location[c][1];
				if (Math.sqrt(x ** 2 + y ** 2) < mouthSize) {
					doKill(e);
				}
			}
		}
	}
}

function doKill(e) {
	for (var i = 0; i < players[e].location.length; i++) {
		if (i % foodDropConstant == 0 && !(players[e].location[i][0] == players[e].location[players[e].location.length - 1][0] && players[e].location[i][1] == players[e].location[players[e].location.length - 1][1] )) {
			food.push([players[e].location[i][0], players[e].location[i][1]])
		}
	}
	players[e].location = [
		startLocation[e]
	];
	players[e].direction = startDirection[e];
	players[e].size = startLength;
}

function eatFood(e) {
	for (var i = 0; i < food.length; i++) {
		var x = players[e].location[0][0] - food[i][0];
		var y = players[e].location[0][1] - food[i][1];
		if (Math.sqrt(x ** 2 + y ** 2) < mouthSize) {
			food.splice(i, 1);
			players[e].size += growthRate;
		}
	}
}

function calculate() {
	doSpectateCounter();
	for (var e = 0; e < numOfPlayers; e++) {
		if (players[e].inGame) {
			rotatePlayer(e);
			movePlayer(e);
			if (players[e].up && players[e].size > playerSizeFloor) {
				players[e].boosting = true;
				movePlayer(e);
				players[e].size -= sprintingAtrophy;
			} else {
				players[e].boosting = false
			}
			killPlayer(e);
			eatFood(e);
		}
	}
	spawnFood();
}

function drawBG(e) {
	ctx[e].beginPath();
	ctx[e].arc(0, 0, mapSize + snakeWidth, 0, Math.PI * 2);
	ctx[e].fillStyle = bgColor;
	ctx[e].fill();
	ctx[e].lineWidth = mapBorderWidth;
	ctx[e].strokeStyle = mapBorderColor;
	ctx[e].stroke();
	ctx[e].closePath();
}

function drawPlayer(e) {
	for (var v = 0; v < numOfPlayers; v++) {
		if (players[v].inGame) {
			ctx[e].lineCap = "round";
			ctx[e].lineWidth = snakeWidth;
			ctx[e].strokeStyle = players[v].boosting ? players[v].boostColor : players[v].color;
			ctx[e].beginPath();
			ctx[e].moveTo(players[v].location[0][0], players[v].location[0][1]);
			for (var i = 0; i < players[v].location.length; i += playerDrawRate) {
				if (i < players[v].location.length) {
					ctx[e].lineTo(players[v].location[i][0], players[v].location[i][1]);
				}
			}
			ctx[e].lineTo(players[v].location[players[v].location.length - 1][0], players[v].location[players[v].location.length - 1][1])
			ctx[e].stroke();
			ctx[e].closePath();
		}
	}


	if (players[e].inGame) {
		ctx[e].font = "16px Arial";
		ctx[e].fillStyle = compassColor;
		ctx[e].textAlign = "center";
		ctx[e].fillText("▲", players[e].location[0][0], players[e].location[0][1] - compassRadius);	
	}
}

function drawFood(e) {
	for (var i of food) {
//		if ((Math.sqrt((players[e].location[0][0] - i[0]) ** 2 + (players[e].location[0][1] - i[1]) ** 2)) < (Math.sqrt((canvas[e].width / 2) ** 2 + (canvas[e].height / 2) ** 2))) { // This if statement checks to see if food is within the viewport of the player
			ctx[e].beginPath();
			ctx[e].arc(i[0], i[1], foodRadius, 0, Math.PI * 2);
			ctx[e].fillStyle = foodColor;
			ctx[e].fill();
			ctx[e].closePath();
//		}
	}
}

function translateCanvas(e) {
	ctx[e].restore();
	ctx[e].save();
	ctx[e].translate(canvas[e].width / 2, canvas[e].height / 2);
	if (players[e].inGame) {
		ctx[e].rotate(players[e].direction - Math.PI / 2);
		ctx[e].translate(-players[e].location[0][0], -players[e].location[0][1]);
		scoreMeters[e].innerHTML = "Score: " + players[e].size;
	}
	else if (playersInGame.length !== 0) {
		ctx[e].translate(-players[indexOfSpectate].location[0][0] * spectateZoom, -players[indexOfSpectate].location[0][1] * spectateZoom);		
	}
	if (!players[e].inGame) {
		var keys = (players[e].upKey + players[e].leftKey + players[e].downKey + players[e].rightKey).toUpperCase();
		if (keys.length > 4) {
			keys = "the arrow keys"
		}
		scoreMeters[e].innerHTML = `Press ${players[e].spawnKey} to join! Use ${keys} to control your snake!`;
		ctx[e].scale(spectateZoom, spectateZoom);
	}
}

function draw() {
	for (var e = 0; e < numOfPlayers; e++) {
		ctx[e].clearRect(-mapSize - innerWidth / 2, -mapSize - innerHeight / 2, mapSize * 2 + innerWidth, mapSize * 2 + 2000 + innerHeight);
		drawBG(e);
		drawFood(e);
		drawPlayer(e);
		translateCanvas(e);
	}
}

function main() {
	if (new Date().getSeconds() != seconds) {
		document.getElementById("framerate").innerHTML = "FPS: " + frames;
		frames = 0;
		seconds = new Date().getSeconds();
	}
	frames++;
	if (!paused) {
		calculate();
	}
	draw();
	requestAnimationFrame(main);
}

requestAnimationFrame(main);