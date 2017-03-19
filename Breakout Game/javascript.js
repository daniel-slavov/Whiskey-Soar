var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);

function draw() {
    drawBall();
}
setInterval(draw, 10);

var canvasWidth = canvas.width;
canvas.heigth = canvas.width * 0.75;

function drawBall() {
    const ballRadius = 0.01 * canvasWidth;
    context.beginPath();
    context.arc(50, 50, 10, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    
}