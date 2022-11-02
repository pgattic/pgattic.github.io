"use strict";

const
	$=(x)=>{return document.querySelector(x)},
	rootColors = $(":root").style,
	
	cScheme = ["light", "dark"],
	textColor = ["#444", "#ccc"],
	bgColor = ["#fff","#111"],
	navColor = ["#eee","#222"],
	navHover = ["#bdb","#343"],
	navSelected = ["#ccc","#333"],
	navBorder = ["#7c7", "#585"],
	linkColor = ["#272", "#7b7"],
	shadowColor = ["#aaa", "#000"],
	btnEmoji = ["☀️","🌙"];

var
	darkMode = Number(localStorage.getItem("darkMode")) || 0; // 0 for light mode, 1 for dark mode

function refreshColors() {
	var i = Number(darkMode);
	$(":root").style="color-scheme: " + cScheme[i];
	rootColors.setProperty("--text-color", textColor[i]);
	rootColors.setProperty("--bg-color", bgColor[i]);
	rootColors.setProperty("--nav-color", navColor[i]);
	rootColors.setProperty("--nav-hover", navHover[i]);
	rootColors.setProperty("--nav-selected", navSelected[i]);
	rootColors.setProperty("--nav-border", navBorder[i]);
	rootColors.setProperty("--link-color", linkColor[i]);
	rootColors.setProperty("--shadow-color", shadowColor[i]);
	$("#darkBtn").innerText = btnEmoji[darkMode];
	for (var e=0; e<document.getElementsByClassName("extern-nav").length; e++) {
		document.getElementsByClassName("extern-nav")[e].src = (i==0?"svg/external-link-light.svg":"svg/external-link-dark.svg");
	}
}

$("#darkBtn").onclick = (e) => {
	darkMode = Number(!darkMode);
	localStorage.setItem("darkMode", darkMode);
	refreshColors();
}

refreshColors();

$("#year").innerText = new Date().getFullYear();

