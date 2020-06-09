const
	mapSize = 1000,
	turnSensitivity = 0.1,
	playerSpeed = 2,
	amtOfFood = 100,
	sprintingAtrophy = 0.5,
	playerSizeFloor = 150,
	mouthSize = 10,
	growthRate = 20,
	foodDropConstant = 30;

var
	paused = false,
	food = [];

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
		}
	}
	if (event.key == "Escape") {
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
		var dist = Math.random() * mapSize;
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
		if (i != e) {
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
		if (i % foodDropConstant == 0) {
			food.push([players[e].location[i][0], players[e].location[i][1]])
		}
	}
	players[e].location = [
		startLocation[e]
	];
	players[e].direction = startDirection[e];
	players[e].size = startLength;
	scoreMeters[e].innerHTML = "Score: " + players[e].size;
}

function eatFood(e) {
	for (var i = 0; i < food.length; i++) {
		var x = players[e].location[0][0] - food[i][0];
		var y = players[e].location[0][1] - food[i][1];
		if (Math.sqrt(x ** 2 + y ** 2) < mouthSize) {
			food.splice(i, 1);
			players[e].size += growthRate;
			scoreMeters[e].innerHTML = "Score: " + players[e].size;
		}
	}
}

function calculate() {
	for (var e = 0; e < numOfPlayers; e++) {
		rotatePlayer(e);
		movePlayer(e);
		if (players[e].up && players[e].size > playerSizeFloor) {
			players[e].boosting = true;
			movePlayer(e);
			players[e].size -= sprintingAtrophy;
			scoreMeters[e].innerHTML = "Score: " + players[e].size;
		} else {
			players[e].boosting = false
		}
		killPlayer(e);
		eatFood(e);
	}
	spawnFood();
}

function drawBG(e) {
	ctx[e].beginPath();
	ctx[e].arc(0, 0, mapSize, 0, Math.PI * 2);
	ctx[e].fillStyle = "white";
	ctx[e].fill();
	ctx[e].closePath();
}

function drawPlayer(e) {
	for (var v = 0; v < numOfPlayers; v++) {
		ctx[e].lineCap = "round";
		ctx[e].lineWidth = 10;
		ctx[e].beginPath();
		ctx[e].moveTo(players[v].location[0][0], players[v].location[0][1]);
		for (var i = 0; i < players[v].location.length; i++) {
			ctx[e].lineTo(players[v].location[i][0], players[v].location[i][1]);
		}
		ctx[e].strokeStyle = players[v].boosting ? players[v].boostColor : players[v].color;
		ctx[e].stroke();
		ctx[e].closePath();
	}


	ctx[e].font = "16px Arial";
	ctx[e].fillStyle = "black";
	ctx[e].textAlign = "center";
	ctx[e].fillText("▲", players[e].location[0][0], players[e].location[0][1] - 10);
	//	ctx[e].fillText("E", players[e].location[0][0] + 30, players[e].location[0][1]);/
	//	ctx[e].fillText("S", players[e].location[0][0], players[e].location[0][1] + 30);
	//	ctx[e].fillText("W", players[e].location[0][0] - 30, players[e].location[0][1]);

}

function drawFood(e) {
	for (var i of food) {
		ctx[e].beginPath();
		ctx[e].arc(i[0], i[1], 5, 0, Math.PI * 2);
		ctx[e].fillStyle = "green";
		ctx[e].fill();
		ctx[e].closePath();
	}
}

function translateCanvas(e) {
	ctx[e].restore();
	ctx[e].save();
	ctx[e].translate(canvas[e].width / 2, canvas[e].height / 2);
	ctx[e].rotate(players[e].direction - Math.PI / 2);
	ctx[e].translate(-players[e].location[0][0], -players[e].location[0][1]);
}

function draw() {
	for (var e = 0; e < numOfPlayers; e++) {
		ctx[e].clearRect(-mapSize - 1000, -mapSize - 1000, mapSize * 2 + 2000, mapSize * 2 + 2000);
		drawBG(e);
		drawPlayer(e);
		drawFood(e);
		translateCanvas(e);
	}
}

function main() {
	if (!paused) {
		calculate();
	}
	draw();
	requestAnimationFrame(main);
}

requestAnimationFrame(main);