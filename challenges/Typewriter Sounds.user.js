// ==UserScript==
// @name         Typewriter Sounds
// @namespace    https://pgattic.github.io/
// @version      0.4
// @description  make typewriter sounds!
// @author       SaveState
// @match        *://*/*
// @grant        none
// ==/UserScript==

(document.onload = function() {
    'use strict';
	document.onkeydown=function(){new Audio('https://pgattic.github.io/challenges/'+(event.keyCode==13?1:2)+'.mp3').play()}
})();