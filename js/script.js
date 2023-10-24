"use strict";

const
	$=(x)=>{return document.querySelector(x)},
	rootColors = $(":root").style,
	colors = {
		"--text-color": ["#444", "#ccc"],
		"--bg-color": ["#fff","#111"],
		"--nav-color": ["#eee","#222"],
		"--nav-hover": ["#bdb","#343"],
		"--nav-selected": ["#ccc","#333"],
		"--nav-border": ["#7c7", "#585"],
		"--link-color": ["#272", "#7b7"],
		"--shadow-color": ["#aaa", "#000"]
	};

let darkMode = Number(localStorage.getItem("darkMode")) || 0; // 0 for light mode, 1 for dark mode

function refreshColors() {
	let modeString = darkMode ? "dark": "light";
	rootColors.setProperty("color-scheme", modeString);
	for (let c of Object.keys(colors)) {
		rootColors.setProperty(c, colors[c][darkMode]);
	}
	$("#darkBtn").innerText = darkMode ? "🌙" : "☀️";
	for (let e = 0; e < document.getElementsByClassName("extern-nav").length; e++) {
		document.getElementsByClassName("extern-nav")[e].src = `svg/external-link-${modeString}.svg`;
	}
}

$("#darkBtn").onclick = () => {
	darkMode = Number(!darkMode);
	localStorage.setItem("darkMode", darkMode);
	refreshColors();
}

refreshColors();

$("#year").innerText = new Date().getFullYear();
