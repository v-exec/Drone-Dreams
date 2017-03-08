//assign socket variable
var socket = io();

//----------UI setup----------//
var UI = {};

//gets canvas
UI.canvas = document.getElementById('canv');

//RGBA canvas background (takes values between 0 and 255 for RGB, and between 0 and 1 for alpha)
UI.R = 0;
UI.G = 0;
UI.B = 0;
UI.A = 1;

//RGBA for lines
UI.lR = 255;
UI.lG = 255;
UI.lB = 255;
UI.lA = 1;

//line width
UI.lineWidth = 4.0;

//canvas context setup
UI.ctx = UI.canvas.getContext('2d');

//global variables for cursor location
UI.cursorX;
UI.cursorY;

//set canvas background color
UI.canvas.style.background = "rgba(" + UI.R + ", " + UI.G + ", " + UI.B + ", " + UI.A + ")";

//----------functons----------//

//fits canvas to container
function fitToContainer() {
	UI.canvas.style.width = '100%';
	UI.canvas.style.height = '100%';
	UI.canvas.width = UI.canvas.offsetWidth;
	UI.canvas.height = UI.canvas.offsetHeight;
}

//draws cross accross canvas intersecting at (x,y)
function drawCross(x, y) {
	UI.ctx.beginPath();
	UI.ctx.moveTo(x, 0);
	UI.ctx.lineTo(x, UI.canvas.height);

	UI.ctx.moveTo(0, y);
	UI.ctx.lineTo(UI.canvas.width, y);

	UI.ctx.strokeStyle = "rgba(" + UI.lR + ", " + UI.lG + ", " + UI.lB + ", " + UI.lA + ")";
	UI.ctx.stroke();
}

//emits coordinates using socket
function emitCoordinates(x, y) {
	socket.emit("data", "x " + x);
	socket.emit("data", "y " + y);
}

//normalizes coordinates to 0-100 range
function normalizeCoord(x, maxX) {
	return Math.round(x / maxX * 127);
}

//----------runtime----------//

function setup() {
	//fit canvas to container, ready to draw
	fitToContainer();

	//call draw function to start animation loop
	window.requestAnimationFrame(draw);
}

function draw() {
	//fit canvas to container
	fitToContainer();

	//clear canvas for next frame
	UI.ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);

	//get normalized X Y mouse / touch positions
	//mouse position on mouse move (desktop)
	document.onmousemove = function (event) {
		UI.cursorX = event.pageX;
		UI.cursorY = event.pageY;
	}
	//touch position on touch start and touch move (mobile)
  	document.addEventListener('touchstart', function(e) {
        UI.cursorX = e.targetTouches[0].pageX;
		UI.cursorY = e.targetTouches[0].pageY;
    }, false);
	document.addEventListener('touchmove', function(e) {
        UI.cursorX = e.targetTouches[0].pageX;
	    UI.cursorY = e.targetTouches[0].pageY;
    }, false);

	//draw cross at mouse position;
	drawCross(UI.cursorX, UI.cursorY);

	//loop animation
	window.requestAnimationFrame(draw);
}

//output coordinates intermittently through socket event
setInterval(function(){
	emitCoordinates(normalizeCoord(UI.cursorX, UI.canvas.width), normalizeCoord(UI.cursorY, UI.canvas.height));
}, 100);

//on page load, call setup to start animation
window.addEventListener("DOMContentLoaded", function () {
	setup();
});