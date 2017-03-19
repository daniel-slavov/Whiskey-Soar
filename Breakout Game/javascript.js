var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = (Math.random() < 0.5) ? -2 : 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

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

function movePaddle(){
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function ballIsInRange(){
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y+dy > canvas.height - ballRadius - paddleHeight){
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
    
        if(y + dy > canvas.height - ballRadius - paddleHeight && !(x > paddleX && x < paddleX + paddleWidth)) {
            lives--;

            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height - paddleHeight - ballRadius;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    ballIsInRange();
    movePaddle();
    
    x += dx;
    y += dy;
    
}
setInterval(draw, 10);