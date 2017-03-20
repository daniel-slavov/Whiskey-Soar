var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);

var ballRadius = 0.01 * canvas.width;
var x;
var y;
var dx = (Math.random() < 0.5) ? -2 : 2;
var dy = -2;
var paddleHeight;
var paddleWidth;
var paddleX;
var paddleY;
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
var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

// function draw() {
//     drawBall();
// }
// setInterval(draw, 10);

function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {

    var sideZoneWidth = brickWidth / 8;
    var centralZoneWidth = (brickWidth / 4) * 3;

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {

            let brickToCheck = bricks[c][r];

            if (brickToCheck.status === 1) {

                // Check if ball hits center zone - changes the movement on the Y axis
                if (brickToCheck.x + sideZoneWidth < x && (brickToCheck.x + brickWidth - sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status = 0;

                    dy = -dy;

                }
                // Check if ball hits LEFT side zone - changes the movement on the X axis
                if (brickToCheck.x - ballRadius < x && (brickToCheck.x + sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status = 0;

                    dx = -dx;

                }

                // Check if ball hits RIGHT side zone - changes the movement on the X axis
                if ((brickToCheck.x + brickWidth - sideZoneWidth) < x && (brickToCheck.x + brickWidth + ballRadius) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status = 0;

                    dx = -dx;
                }
            }
        }
    }
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function ballIsInRange() {
    // right & left check
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // top check
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // bottom check
    if (y + dy > canvas.height - ballRadius - 2 * paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
    } else if (y + dy > canvas.height + ballRadius) {
        lives--;

        if (!lives) {
            alert("GAME OVER");
            document.location.reload();
        } else {
            resizeCanvas();
        }
    }
}

function resizeCanvas() {
    canvas.width = (9 / 10) * window.innerWidth;
    canvas.height = (9 / 10) * window.innerHeight;
    ballRadius = 0.01 * (canvas.width + canvas.height);
    paddleHeight = 0.02 * canvas.height;
    paddleWidth = 0.2 * canvas.width;
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - (paddleHeight * 2);
    x = canvas.width / 2;
    y = paddleY - ballRadius;
}

function checkWindowSize() {
    if (window.innerHeight !== windowHeight || window.innerWidth !== windowWidth) {
        resizeCanvas();
    }
}

resizeCanvas();


function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    checkWindowSize();
    //drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    //collisionDetection();
    ballIsInRange();
    movePaddle();

    x += dx;
    y += dy;

}
setInterval(draw, 10);