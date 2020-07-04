const
	mapSize = 650,
	turnSensitivity = 0.1,
	startLength = 20,
	playerSpeed = 2,
	amtOfFood = 100,
	sprintingAtrophy = 0.25,
	playerSizeFloor = 15,
	bodyConsumptionRadius = 2,
	growthRate = 5,
	foodDropConstant = 8,
	snakeWidth = 10,
	mapBorderWidth = 10,
	foodRadius = 5,
	spectateDuration = 200,
	compassRadius = 10,
	spectateZoom = 0.5,
	bgColor = ["#fff", "#aaa"],
	mapBorderColor = "#000",
	foodColor = "#080",
	pauseKey = "Escape",
	spectatorRotationVelocity = 0.005,
	version = "Copyright SaveState. v1.9.5";

var
	indexOfSpectate = 1,
	spectatorRotate = 0,
	playerResolution = 1,
	playersInGame = [],
	playerDrawRate = 2, // how many segments of the player are skipped, plus one. higher number = less resolution on their curvature. 
	paused = false,
	food = [],
	seconds = 0,
	frames = 0,
	spectateCounter = 0,
	relativeGameSpeed = 1,
	
	canvas,
	ctx,
	startDirection,
	startLocation,
	scoreMeters,
	players,
	selectedFood = 0;

switch (numOfPlayers) {
	case 1:
		canvas = [document.getElementById("1")];
		ctx = [canvas[0].getContext("2d")];
		startDirection = [Math.PI / 2, Math.PI, 0, Math.PI * (3/2)];
		startLocation = [[0, -200], [-200, 0], [200, 0], [0, 200]];
		scoreMeters = [document.getElementById("a")];
		players = [
			{
				location: [
					startLocation[0]
				],
				direction: startDirection[0],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#f00", "#a00"],
				boostColor: ["#f66", "#a66"],
				upKey: "ARROWUP",
				leftKey: "ARROWLEFT",
				downKey: "ARROWDOWN",
				rightKey: "ARROWRIGHT",
				spawnKey: "1",
				inGame: true,
				cpu: false,
			},
			{
				location: [
					startLocation[1]
				],
				direction: startDirection[1],
				size: generateAILength(),
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#0a0", "#060"],
				boostColor: ["#6a6", "#363"],
				inGame: true,
				cpu: true,
			},
			{
				location: [
					startLocation[2]
				],
				direction: startDirection[2],
				size: generateAILength(),
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#00f", "#00a"],
				boostColor: ["#66f", "#66a"],
				inGame: true,
				cpu: true,
			},
			{
				location: [
					startLocation[3]
				],
				direction: startDirection[3],
				size: generateAILength(),
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#a0a", "#606"],
				boostColor: ["#a6a", "#636"],
				inGame: true,
				cpu: true,
			},
		];
		break;
	case 2:
		canvas = [document.getElementById("1"), document.getElementById("2")];
		ctx = [canvas[0].getContext("2d"), canvas[1].getContext("2d")];
		startDirection = [Math.PI, 0];
		startLocation = [[-200, 0], [200, 0]];
		scoreMeters = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c"), document.getElementById("d")];
		players = [
			{
				location: [
					startLocation[0]
				],
				direction: startDirection[0],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#f00", "#a00"],
				boostColor: ["#f66", "#a66"],
				upKey: "W",
				leftKey: "A",
				downKey: "S",
				rightKey: "D",
				spawnKey: "1",
				inGame: false,
				cpu: false,
			},
			{
				location: [
					startLocation[1]
				],
				direction: startDirection[1],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#0a0", "#060"],
				boostColor: ["#6a6", "#363"],
				upKey: "ARROWUP",
				leftKey: "ARROWLEFT",
				downKey: "ARROWDOWN",
				rightKey: "ARROWRIGHT",
				spawnKey: "2",
				inGame: false,
				cpu: false,
			},
		];
		break;
	case 4:
		canvas = [document.getElementById("1"), document.getElementById("2"), document.getElementById("3"), document.getElementById("4")];
		ctx = [canvas[0].getContext("2d"), canvas[1].getContext("2d"), canvas[2].getContext("2d"), canvas[3].getContext("2d")];
		startDirection = [Math.PI / 2, Math.PI, 0, Math.PI * (3/2)];
		startLocation = [[0, -200], [-200, 0], [200, 0], [0, 200]];
		scoreMeters = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c"), document.getElementById("d")];
		players = [
			{
				location: [
					startLocation[0]
				],
				direction: startDirection[0],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#f00", "#a00"],
				boostColor: ["#f66", "#a66"],
				upKey: "W",
				leftKey: "A",
				downKey: "S",
				rightKey: "D",
				spawnKey: "1",
				inGame: false,
				cpu: false,
			},
			{
				location: [
					startLocation[1]
				],
				direction: startDirection[1],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#0a0", "#060"],
				boostColor: ["#6a6", "#363"],
				upKey: "T",
				leftKey: "F",
				downKey: "G",
				rightKey: "H",
				spawnKey: "2",
				inGame: false,
				cpu: false,
			},
			{
				location: [
					startLocation[2]
				],
				direction: startDirection[2],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#00f", "#00a"],
				boostColor: ["#66f", "#66a"],
				upKey: "I",
				leftKey: "J",
				downKey: "K",
				rightKey: "L",
				spawnKey: "3",
				inGame: false,
				cpu: false,
			},
			{
				location: [
					startLocation[3]
				],
				direction: startDirection[3],
				size: startLength,
				boosting:false,
				right: false,
				left: false,
				up: false,
				color: ["#a0a", "#606"],
				boostColor: ["#a6a", "#636"],
				upKey: "ARROWUP",
				leftKey: "ARROWLEFT",
				downKey: "ARROWDOWN",
				rightKey: "ARROWRIGHT",
				spawnKey: "4",
				inGame: false,
				cpu: false,
			},
		];
		break;
}
document.getElementById("version").innerHTML = version;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	alert('Are you on mobile? This game was created for PC users only, sorry!')
}

function resize() {
	for (var i of canvas) {
		switch (numOfPlayers) {
			case 1:
				i.width = innerWidth;
				i.height = innerHeight;
				break;
			case 2:
				i.height = innerHeight;
				i.width = innerWidth / 2;
				break;
			case 4:
				i.height = innerHeight / 2;
				i.width = innerWidth / 2;
				break;
		}
	}
}

function generateAILength() {
	return Math.floor(Math.random() * 1980) + 20;
}

window.onresize = () => {
	resize();
}

resize();

onkeydown = () => {
	for (var e = 0; e < numOfPlayers; e++) {
		switch (event.key.toUpperCase()) {
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
		switch (event.key.toUpperCase()) {
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

function calcAI(e) {
	if (players[e].cpu && food.length > 0) {
		players[e].left = false;
		players[e].right = false;
		players[e].up = false;
		var closeDistance = mapSize * 2;
		var selectedFood;
		for (var i = 0; i < food.length; i++) {
			var x = food[i][0] - players[e].location[0][0];
			var y = food[i][1] - players[e].location[0][1];
			var d = Math.sqrt(x ** 2 + y ** 2);
			if (d < closeDistance) {
				closeDistance = d;
				selectedFood = i;
			}
		}
		var a = food[selectedFood][0] - players[e].location[0][0];
		var b = food[selectedFood][1] - players[e].location[0][1];
		var an = a * Math.cos(players[e].direction) - b * Math.sin(players[e].direction);
		var bn = a * Math.sin(players[e].direction) + b * Math.cos(players[e].direction);
		if (bn > 0) {
			players[e].right = true;
		}
		else if (bn < 0) {
			players[e].left = true;
		}
		if (Math.abs(bn) < calcSnakeWidth(e) / 2 + foodRadius && an > 0) {
			players[e].left = false;
			players[e].right = false;
		}
		if (an < 0 && an > - 40 && Math.abs(bn) < 30) {
			players[e].left = false;
			players[e].right = false;
		}
		var selectedBody;
		var closeBodyDist = 300;
		var selectedPlayer;
		for (var i = 0; i < players.length; i++) {
			if (e != i) {
				var c = players[i].location[0][0] - food[selectedFood][0];
				var f = players[i].location[0][1] - food[selectedFood][1];
				var g = Math.sqrt(c **2 + f ** 2);
				if (g - 10 < closeDistance) {
					players[e].up = true;
				}
				for (var q = 0; q < players[i].location.length; q++) {
					var x = players[i].location[q][0] - players[e].location[0][0];
					var y = players[i].location[q][1] - players[e].location[0][1];
					var d = Math.sqrt(x ** 2 + y ** 2);
					if (d < closeBodyDist) {
						closeBodyDist = d;
						selectedBody = q;
						selectedPlayer = i;
					}		
				}
			}
		}
		if (closeBodyDist < 40) {
			var x = players[selectedPlayer].location[selectedBody][0] - players[e].location[0][0];
			var y = players[selectedPlayer].location[selectedBody][1] - players[e].location[0][1];
			var xn = x * Math.cos(players[e].direction) - y * Math.sin(players[e].direction);
			var yn = x * Math.sin(players[e].direction) + y * Math.cos(players[e].direction);
			players[e].up = false;
			if (yn < 0) {
				players[e].right = true;
				players[e].left = false;
			}
			else if (yn > 0) {
				players[e].left = true;
				players[e].right = false;
			}
		}
		if (Math.sqrt(players[e].location[0][0] ** 2 + players[e].location[0][1] ** 2) > mapSize - 30) {
			var x = 0 - players[e].location[0][0];
			var y = 0 - players[e].location[0][1];
			var xn = x * Math.cos(players[e].direction) - y * Math.sin(players[e].direction);
			var yn = x * Math.sin(players[e].direction) + y * Math.cos(players[e].direction);
			if (yn > 0) {
				players[e].right = true;
				players[e].left = false;
			}
			else if (yn < 0) {
				players[e].left = true;
				players[e].right = false;
			}
		}
	}
}

function rotatePlayer(e) {
	if (players[e].left) {
		players[e].direction += turnSensitivity * relativeGameSpeed;
	}
	if (players[e].right) {
		players[e].direction -= turnSensitivity * relativeGameSpeed;
	}
}

function movePlayer(e) {
	var x = Math.cos(players[e].direction) * playerSpeed * relativeGameSpeed;
	var y = Math.sin(players[e].direction) * playerSpeed * relativeGameSpeed;
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
		var dist = Math.random() * (mapSize - foodRadius * 4);
		food.push([Math.floor(Math.cos(rad) * dist), Math.floor(Math.sin(rad) * dist)]);
	}
}

function constrict(e) {
	var playerCopy = players[e];
	for (var i = 1; i < players[e].location.length - 1; i++) {
		players[e].location[i][0] = (((playerCopy.location[i - 1][0] + playerCopy.location[i + 1][0]) / 2));// + players[e].location[i][0]) / 2;
		players[e].location[i][1] = (((playerCopy.location[i - 1][1] + playerCopy.location[i + 1][1]) / 2));// + players[e].location[i][1]) / 2;
	}
}

function killPlayer(e) {
	if (Math.sqrt(players[e].location[0][0] ** 2 + players[e].location[0][1] ** 2) > mapSize) {
		doKill(e);
	}
	for (var i = 0; i < players.length; i++) {
		if (i != e && players[i].inGame) {
			for (var c = 0; c < players[i].location.length; c++) {
				var x = players[e].location[0][0] - players[i].location[c][0];
				var y = players[e].location[0][1] - players[i].location[c][1];
				if (Math.sqrt(x ** 2 + y ** 2) < (calcSnakeWidth(e) + calcSnakeWidth(i)) / 2) {
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
		if (Math.sqrt(x ** 2 + y ** 2) < calcSnakeWidth(e) / 2 + foodRadius) {
			food.splice(i, 1);
			players[e].size += growthRate;
		}
	}

	for (var q = 0; q < players[e].location.length; q++) {
		for (var i = 0; i < food.length; i++) {
			var x = players[e].location[q][0] - food[i][0];
			var y = players[e].location[q][1] - food[i][1];
			if (Math.sqrt(x ** 2 + y ** 2) < bodyConsumptionRadius) {
				food.splice(i, 1);
				players[e].size += growthRate;
			}
		}
	}
}

function calculate() {
	doSpectateCounter();
	spectatorRotate += spectatorRotationVelocity;
	for (var e = 0; e < players.length; e++) {
		if (players[e].inGame) {
			calcAI(e);
			rotatePlayer(e);
			movePlayer(e);
			if (players[e].up && players[e].size > playerSizeFloor) {
				players[e].boosting = true;
				movePlayer(e);
				players[e].size -= sprintingAtrophy;
			} else {
				players[e].boosting = false;
			}
			constrict(e);
			killPlayer(e);
			eatFood(e);
		}
	}
	spawnFood();
}

function drawBG(e) {
	ctx[e].beginPath();
	ctx[e].arc(0, 0, mapSize + snakeWidth, 0, Math.PI * 2);
	ctx[e].fillStyle = makeGradient(bgColor, e);
	ctx[e].fill();
	ctx[e].lineWidth = mapBorderWidth;
	ctx[e].strokeStyle = mapBorderColor;
	ctx[e].stroke();
	ctx[e].closePath();
}

function drawPlayer(e) {
	for (var v = 0; v < players.length; v++) {
		if (players[v].inGame) {
			ctx[e].lineCap = "round";
			ctx[e].lineWidth = calcSnakeWidth(v);
			var targetColor = players[v].boosting ? players[v].boostColor : players[v].color;
			ctx[e].strokeStyle = makeGradient(targetColor, e);
			ctx[e].beginPath();
			ctx[e].moveTo(players[v].location[0][0], players[v].location[0][1]);
			for (var i = 0; i < players[v].location.length; i += playerDrawRate) {
				ctx[e].lineTo(players[v].location[i][0], players[v].location[i][1]);
			}
			ctx[e].lineTo(players[v].location[players[v].location.length - 1][0], players[v].location[players[v].location.length - 1][1])
			ctx[e].stroke();
			ctx[e].closePath();
			ctx[e].beginPath();
			ctx[e].arc(players[v].location[0][0], players[v].location[0][1], calcSnakeWidth(v) / 4, 0, Math.PI * 2);
			ctx[e].fillStyle = compassColor(v);
			ctx[e].fill();
			ctx[e].closePath();
		}
	}

	if (players[e].inGame) {
		ctx[e].font = calcSnakeWidth(e) * 1.5 + "px Arial";
		ctx[e].fillStyle = compassColor(v);
		ctx[e].textAlign = "center";
		ctx[e].fillText("▲", players[e].location[0][0], players[e].location[0][1] - calcSnakeWidth(e) );	
	}
}

function compassColor(e) {
	var size = 0;
	var leader = 0;
	for (var i = 0; i < players.length; i++) {
		if (players[i].size > players[leader].size) {
			leader = i;
			size = players[i].size;
		}
	}
	return leader == e ? "#ff0" : "#000";
}

function calcSnakeWidth(v) {
	return (Math.sqrt(players[v].size) / 3) + 5;
}

function drawFood(e) {
	for (var i of food) {
//		if ((Math.sqrt((players[e].location[0][0] - i[0]) ** 2 + (players[e].location[0][1] - i[1]) ** 2)) < (Math.sqrt((canvas[e].width / 2) ** 2 + (canvas[e].height / 2) ** 2))) { // This if statement checks to see if food is within the viewport of the player
			ctx[e].beginPath();
			ctx[e].arc(i[0], i[1], foodRadius, 0, Math.PI * 2);
//			ctx[e].rect(i[0] - 4, i[1] - 4, 8, 8);
			ctx[e].fillStyle = foodColor;
			ctx[e].fill();
//			ctx[e].closePath();
//		}
	}
}

function translateCanvas(e) {
	ctx[e].restore();
	ctx[e].save();
	ctx[e].translate(canvas[e].width / 2, canvas[e].height / 2);
	if (players[e].inGame) {
		ctx[e].rotate(players[e].direction - Math.PI / 2);
		ctx[e].scale(playerScale(e), playerScale(e));
		ctx[e].translate(-players[e].location[0][0], -players[e].location[0][1]);
		scoreMeters[e].innerHTML = "Score: " + Math.floor(players[e].size);
	}
	else if (playersInGame.length !== 0) {
		ctx[e].rotate(spectatorRotate);
		ctx[e].translate(-players[indexOfSpectate].location[0][0] * spectateZoom, -players[indexOfSpectate].location[0][1] * spectateZoom);
	}
	if (!players[e].inGame) {
		var keys = players[e].upKey + players[e].leftKey + players[e].downKey + players[e].rightKey;
		if (keys.length > 4) {
			keys = "the arrow keys"
		}
		scoreMeters[e].innerHTML = `Press ${players[e].spawnKey} to join! Use ${keys} to control your snake!`;
		ctx[e].scale(spectateZoom, spectateZoom);
	}
}

function playerScale(e) {
	return 10 / calcSnakeWidth(e);
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

function makeGradient(colors, e) {
	var grd = ctx[e].createRadialGradient(0, 0, 0, 0, 0, mapSize);
	grd.addColorStop(0, colors[0]);
	grd.addColorStop(1, colors[1]);
	return grd;
}

function main() {
	if (new Date().getSeconds() != seconds) {
		document.getElementById("framerate").innerHTML = "FPS: " + frames;
		relativeGamespeed = 60 / frames;
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
