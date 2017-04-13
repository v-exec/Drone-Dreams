//assign socket variable
var socket = io();

//----------UI setup----------//
//gets canvas
var canvas = document.getElementById('canv');

//RGBA canvas background (takes values between 0 and 255 for RGB, and between 0 and 1 for alpha)
var R = 0;
var G = 0;
var B = 0;
var A = 1;

//RGBA for lines
var lR = 255;
var lG = 255;
var lB = 255;
var lA = 1;

//line width
var lineWidth = 2.0;

//canvas context setup
var ctx = canvas.getContext('2d');

//global variables for cursor location
var cursorX;
var cursorY;

var dotCount = 8000;
var dots = new Array(dotCount);

//set canvas background color
canvas.style.background = "rgba(" + R + ", " + G + ", " + B + ", " + A + ")";

//----------functions----------//

//fits canvas to container
function fitToContainer() {
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
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

//calculates distance between two coordinates
function calculateDistance(point1X, point1Y, point2X, point2Y) {
	return Math.sqrt((point1X - point2X)*(point1X - point2X) + (point1Y - point2Y)*(point1Y - point2Y));
}

//random float generator
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

//----------draw functions----------//

//draws cross accross canvas intersecting at (x,y)
function drawCross(x, y) {
	ctx.beginPath();
	ctx.moveTo(x, 0);
	ctx.lineTo(x, canvas.height);

	ctx.moveTo(0, y);
	ctx.lineTo(canvas.width, y);

	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "rgba(" + lR + ", " + lG + ", " + lB + ", " + lA + ")";
	ctx.stroke();
}

//dots that change size depending on distance from mouse
function Dot(x = 100, y = 100) {
	this.x = x;
	this.y = y;
	this.size = 5;

	this.display = function() {
		this.size = calculateDistance(this.x, this.y, cursorX, cursorY) / 400;

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = "rgba(" + lR + ", " + lG + ", " + lB + ", " + lA + ")";
		ctx.fill();
	}
}

//----------runtime----------//

function setup() {
	//fit canvas to container, ready to draw
	fitToContainer();

	var row = 0;
	var col = 0;
	var spacing = 20;

	for (var i = 0; i < dotCount; i++) {
		if (col > canvas.width) {
			col = 0;
			row += spacing;
		}
		console.log(col);
		dots[i] = new Dot(col, row);
		col += spacing;
    }

	//call draw function to start animation loop
	window.requestAnimationFrame(draw);
}

function draw() {
	//fit canvas to container
	fitToContainer();

	//clear canvas for next frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//get X Y mouse / touch positions
	//mouse position on mouse move (desktop)
	document.onmousemove = function (event) {
		cursorX = event.pageX;
		cursorY = event.pageY;
	}
	//touch position on touch start and touch move (mobile)
  	document.addEventListener('touchstart', function(e) {
        cursorX = e.targetTouches[0].pageX;
		cursorY = e.targetTouches[0].pageY;
    }, false);
	document.addEventListener('touchmove', function(e) {
        cursorX = e.targetTouches[0].pageX;
	    cursorY = e.targetTouches[0].pageY;
    }, false);

	//draw cross at mouse position;
	//drawCross(cursorX, cursorY);

	//display dots
	for (var i = 0; i < dotCount; i++) {
		dots[i].display();
	}

	//loop animation
	window.requestAnimationFrame(draw);
}

//output coordinates intermittently through socket event
setInterval(function(){
	emitCoordinates(normalizeCoord(cursorX, canvas.width), normalizeCoord(cursorY, canvas.height));
}, 50);

//on page load, call setup to start animation
window.addEventListener("DOMContentLoaded", function () {
	setup();
});