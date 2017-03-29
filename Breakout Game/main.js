var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);

var ballRadius = 0.01 * canvas.width;
var x;
var y;
var dx;
var dy;
var actualSpeed;
var paddleHeight;
var paddleWidth;
var paddleX;
var paddleY;
var rightPressed = false;
var leftPressed = false;
var isPause = false;

var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth;
var brickHeight;
var brickSpacing;
var brickClusterPadding;
var brickClusterWidth;
var brickClusterPaddingToCanvasWidthRatio = 0.05;
var brickHeightToWidthRatio = 0.25;
var brickSpacingToWidthRatio = 0.1;

// Init bricks
var bricks = [];
for (col = 0; col < brickColumnCount; col += 1) {
    bricks[col] = [];
    for (row = 0; row < brickRowCount; row += 1) {
        if (row % 2 === 0) {
            bricks[col][row] = { x: 0, y: 0, status: 1 };
        } else {
            bricks[col][row] = { x: 0, y: 0, status: 2 };
        }

    }
}

var score = 0;
const maxPoints = 560;
var lives = 3;
var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Allow moving the paddle with the mouse
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode === 32) {
        isPause = !isPause;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var mousePosition = e.clientX,
        distanceToCurrentWindow = canvas.offsetLeft,
        currentPosition = mousePosition - distanceToCurrentWindow;
    if (currentPosition > 0 && currentPosition < canvas.width) {
        paddleX = currentPosition - paddleWidth / 2;
    }
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}