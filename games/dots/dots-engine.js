var
	canvas=document.getElementById("c")
	dimension=[document.documentElement.clientWidth, document.documentElement.clientHeight]
	canvas.width=dimension[0]
	canvas.height=dimension[1]
	ctx=canvas.getContext("2d");

const
	playerColor="#922",
	playerStartSize=10,
	spawnRate=10,
	enemyDMin=0.4,
	enemyDMax=2;

var
	enemyRadMin=7,
	enemyRadMax=playerStartSize+70,
	highScore=localStorage.getItem('dRecord')||0,
	playerStartX=canvas.width / 2,
	playerStartY=canvas.height / 2,
	player=[playerStartX,playerStartY,playerStartSize,playerColor],
	enemies=[],
	spawnWait=0,
	paused=false,
	dead=true,
	screen=canvas.style;

document.getElementById("s").innerHTML="Score: "+Math.round(player[2])+"<br/>Highscore: "+Math.round(highScore);


onmousemove=function(){if(!paused&&!dead){player[0]=event.x;player[1]=event.y}}
onclick=function(){
	if(dead){
		enemies=[];
		player[2]=playerStartSize;
		player[0]=canvas.width/2;
		player[1]=canvas.height/2;
		enemyRadMax=player[2]+70;
		document.getElementById("c").style.cursor="none"
		document.getElementById("s").style.cursor="none"
		document.getElementById("p").innerHTML=[];
		document.getElementById("s").innerHTML="Score: "+Math.round(player[2])+"<br/>Highscore: "+Math.round(highScore);
	}
	dead=false;
}
onkeydown=function(){if(event.key==" "){
//	paused=dead?paused:!paused;
	if(!dead){paused=!paused};
	if(paused&&!dead){
		document.getElementById("p").innerHTML="PAUSED";
	}
	else if(!dead){
		document.getElementById("p").innerHTML=[];
	}
	document.getElementById("c").style.cursor=(!paused&&!dead)?"none":"default";
	document.getElementById("s").style.cursor=(!paused&&!dead)?"none":"default";
}
};

function spawnEnemy(){
	if(spawnWait<1){
		spawnWait=spawnRate;
		var x;
		var y;
		var dx=Math.random()*(enemyDMax-enemyDMin)+enemyDMin;
		var dy=Math.random()*(enemyDMax-enemyDMin)+enemyDMin;
		var size=Math.pow(Math.random()*(Math.sqrt(enemyRadMax)-Math.sqrt(enemyRadMin))+Math.sqrt(enemyRadMin),2);
		switch(Math.floor(Math.random()*4)){
			case 0:
				x=-size;
				y=Math.random()*canvas.height;
				dy=(y<canvas.height/2)?dy:-dy;
				break;
			case 1:
				x=canvas.width+size;
				y=Math.random()*canvas.height;
				dy=(y<canvas.height/2)?dy:-dy;
				dx=-dx;
				break;
			case 2:
				x=Math.random()*canvas.width;
				y=-size;
				dx=(x<canvas.width/2)?dx:-dx;
				break;
			case 3:
				x=Math.random()*canvas.width;
				y=canvas.height+size;
				dx=(x<canvas.width/2)?dx:-dx;
				dy=-dy;
				break;
		}
		var eColor="#"+Math.floor(Math.random()*4+6)+Math.floor(Math.random()*4+6)+Math.floor(Math.random()*4+6);
		enemies.push([x, y, size, eColor, dx, dy]);
	}
	spawnWait--;
}

function moveEnemy(){
	for(var i of enemies){
		i[0]+=i[4];
		i[1]+=i[5];
	}
}

function killEnemy(){
	for(var i=0;i<enemies.length;i++){
		if(enemies[i][0]+enemies[i][2]<0||enemies[i][0]-enemies[i][2]>canvas.width||enemies[i][1]+enemies[i][2]<0||enemies[i][1]-enemies[i][2]>canvas.height){
			enemies.splice(i,1);
		}
	}
}

function killPlayer(){
	for(var i=0;i<enemies.length;i++){
		var xDist=Math.abs(player[0]-enemies[i][0]);
		var yDist=Math.abs(player[1]-enemies[i][1]);
		var dist=Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
		if(dist<enemies[i][2]+player[2]){
			if(player[2]>enemies[i][2]){
				player[2]=Math.sqrt(Math.pow(enemies[i][2],2)/6+Math.pow(player[2],2));
				enemies.splice(i,1);
				document.getElementById("s").innerHTML="Score: "+Math.round(player[2])+"<br/>Highscore: "+Math.round(highScore);
				enemyRadMax=player[2]+70;
			}
			else{
				if(player[2]>highScore){
					localStorage.setItem('dRecord', player[2]);
					highScore=player[2];
				}
				document.getElementById("c").style.cursor="default";
				document.getElementById("s").style.cursor="default";
				document.getElementById("p").innerHTML="You Died!<br/>Click to Retry<br/>Score: "+Math.round(player[2]);
				dead=true;
				paused=false;
			}
		}
	}
}

function draw(){
	for(var i of enemies){
		drawCircle(i);
	}
	drawCircle(player);
}

function drawCircle(o){
	ctx.beginPath();
	ctx.arc(o[0],o[1],o[2],0,Math.PI*2);
	ctx.fillStyle=o[3];
	ctx.fill();
	ctx.globalAlpha=0.2;
	ctx.strokeStyle="#000";
	ctx.lineWidth=10;
	ctx.stroke();
	ctx.globalAlpha=1;
	ctx.closePath();
	ctx.font="bold 12px Arial";
	ctx.textAlign="center"
	ctx.fillStyle="#000";
	ctx.fillText(Math.round(o[2]),o[0],o[1]+5);
}

function main(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	dimension=[document.documentElement.clientWidth,document.documentElement.clientHeight];
	canvas.width=dimension[0];
	canvas.height=dimension[1];	
	if(dead||paused){
		screen.filter="blur(1px)";
	}
	else{
		screen.filter="blur(0)";
	}
	if(!paused&&!dead){
		spawnEnemy();
		killEnemy();
		killPlayer();
	}
	if(!paused)moveEnemy();
	draw();
}

var interval = setInterval(main, 20);
