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
UI.lineWidth = 2.0;

//canvas context setup
UI.ctx = UI.canvas.getContext('2d');

//set canvas background color
UI.canvas.style.background = "rgba(" + UI.R + ", " + UI.G + ", " + UI.B + ", " + UI.A + ")";

//2D array of [index][x, y] pointer locations
UI.points = new Array(16);
for (var i = 0; i < UI.points.length; i++) {
	UI.points[i] = new Array(2);
}

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

	UI.ctx.lineWidth = UI.lineWidth;
	UI.ctx.strokeStyle = "rgba(" + UI.lR + ", " + UI.lG + ", " + UI.lB + ", " + UI.lA + ")";
	UI.ctx.stroke();
}

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

	//get X Y pointers
	socket.on('point', function(index, data) {
		if (data.startsWith("x")) {
			var x = data.substr(2) / 127 * UI.canvas.width;
			UI.points[index][0] = x;
		} else {
			var y = data.substr(2) / 127 * UI.canvas.height;
			UI.points[index][1] = y;
		}
	});

	//draw cross at pointers
	for (var i = 0; i < UI.points.length; i++) {
		drawCross(UI.points[i][0], UI.points[i][1]);
	}

	//loop animation
	window.requestAnimationFrame(draw);
}

//on page load, call setup to start animation
window.addEventListener("DOMContentLoaded", function () {
	setup();
});