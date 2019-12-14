/* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
	dropdown[i].addEventListener("click", function() {
//			this.classList.toggle("active");
		var dropdownContent = this.nextElementSibling;
		if (dropdownContent.style.display === "block") {
		dropdownContent.style.display = "none";
		} else {
		dropdownContent.style.display = "block";
		}
	});
}

for (i of document.getElementsByClassName("player")) {
	i.innerHTML = '<ellipse cx="8"cy="13"rx="6"ry="3"fill="gray"/><circle cx="8"cy="6"r="5.5"stroke="#eee"fill="gray"/>1'
}
for (i of document.getElementsByTagName("svg")) {
	i.innerHTML = '<ellipse cx="8"cy="13"rx="6"ry="3"fill="gray"/><circle cx="8"cy="6"r="5.5"stroke="#eee"fill="gray"/>1'
}

document.getElementsByClassName("sidebar")[0].innerHTML=`<h2><img src="img/favicon-32x32.png" style="vertical-align:text-bottom"> SaveState</h2>
		<a href="/">Home</a>
		<a class="dropdown-btn">Games<span>▼</span></a>
		<div class="dropdown-container">
			<a href="snake">Snake</a>
			<a href="multiplayer-snake">Multiplayer Snake</a>
			<a href="yeet-ball">Yeet Ball</a>
			<a href="yeet-ball-classic">Yeet Ball Classic</a>
			<a href="pong">Pong</a>
			<a href="4p-pong">4-Player Pong</a>
		</div>
		<a href="challenges">Coding Challenges</a>
		<a href="about-me">About Me</a>`.replace(c,'class="active"');

var 

//multi-support min: 
//for(i of document.getElementsByClassName("dropdown-btn"))i.addEventListener("click",function(){a=this.nextElementSibling.style;a.display=a.display=="block"?"none":"block"})

//mono-support min:
//document.getElementsByClassName("dropdown-btn")[0].addEventListener("click",function(){a=this.nextElementSibling.style;a.display=a.display=="block"?"none":"block"})