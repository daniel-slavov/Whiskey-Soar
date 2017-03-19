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

function collisionDetection() {

    for(let c = 0; c < brickColumnCount; c++ ) {
        for (let r = 0; r < brickRowCount; r++) {

            let brickToCheck = bricks[c][r];

            if (brickToCheck.status === 1) {

                if ((brickToCheck.x < x) && ((brickToCheck.x + brickWidth) > x) && (brickToCheck.y < y) && ((brickToCheck.y + brickHeight) > y)) {
                    
                    brickToCheck.status = 0;

                    dy = -dy;
                }

            }
        }
    }   
}