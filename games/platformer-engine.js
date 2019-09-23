var
	canvas = document.getElementById("Platformer")
	dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0];
	canvas.height = dimension[1];
	ctx = canvas.getContext("2d")

const
	

var
	upPressed = false
	downPressed = false
	leftPressed = false
	rightPressed = false
	isPaused = false


document.addEventListener("mousemove", getMouse, false);
document.addEventListener("click", getClick, false);
document.addEventListener("keydown", getKeys, false);
document.addEventListener("keyup", unGetKeys, false);

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
	if (e.key == "q" || e.key == "Enter") {
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
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer{
	
}

function draw() {
	clearCanvas();
	drawPlayer();
}

var interval = setInterval(draw, 1);
