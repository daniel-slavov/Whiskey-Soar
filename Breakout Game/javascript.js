var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);

var ballRadius = 0.01 * canvas.width;
var x;
var y;
var dx = (Math.random() < 0.5) ? -2 : 2;
var dy = -2;
var actualSpeed = Math.sqrt((dx * dx) + (dy * dy));
var paddleHeight;
var paddleWidth;
var paddleX;
var paddleY;
var rightPressed = false;
var leftPressed = false;

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
    for (row = 0; row < brickRowCount; row +=1) {
        if (row % 2 === 0) {
        bricks[col][row] = { x: 0, y: 0, status :1 };
    }
    else {
        bricks[col][row] = { x: 0, y: 0, status :2 };
    }
    
    }
}

var score = 0;
var lives = 3;
var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

// function draw() {
//     drawBall();
// }
// setInterval(draw, 10);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
//Allow moving the paddle with the mouse
function mouseMoveHandler(e) {
     var mousePosition=e.clientX,
         distanceToCurrentWindow=canvas.offsetLeft,
         currentPosition = mousePosition - distanceToCurrentWindow;
    if(currentPosition > 0 && currentPosition < canvas.width) {
        paddleX = currentPosition - paddleWidth/2;
    }
}

function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#841F27";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = "#841F27";
    context.fill();
    context.closePath();
}

function drawBricks() {
    for (col = 0; col < brickColumnCount; col += 1) {
        for (row = 0; row < brickRowCount; row += 1) {
            var currentBrickX = brickClusterPadding + (col * brickSpacing) + (col * brickWidth); 
            var currentBrickY = brickClusterPadding + (row * brickSpacing) + (row * brickHeight); 
            bricks[col][row].x = currentBrickX;
            bricks[col][row].y = currentBrickY;

            if (bricks[col][row].status > 0) {
                context.beginPath();
                context.rect(currentBrickX, currentBrickY, brickWidth, brickHeight);
                if (row % 2 === 0) {
                    context.fillStyle = "#841F27";
                }
                else {
                    context.fillStyle = "#FFFF00";
                }
                context.fill();
                context.closePath();
            }
        }
    }
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

            if (brickToCheck.status > 0) {

                // Check if ball hits center zone - changes the movement on the Y axis
                if (brickToCheck.x + sideZoneWidth < x && (brickToCheck.x + brickWidth - sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status--;
                    score += 10;

                    dy = -dy;

                }
                // Check if ball hits LEFT side zone - changes the movement on the X axis
                if (brickToCheck.x - ballRadius < x && (brickToCheck.x + sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status--;
                    score += 10;
                    
                    dx = -dx;

                }

                // Check if ball hits RIGHT side zone - changes the movement on the X axis
                if ((brickToCheck.x + brickWidth - sideZoneWidth) < x && (brickToCheck.x + brickWidth + ballRadius) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status--;
                    score += 10;

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
        bounceOffPaddle();    
            //dy = -dy;
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

function bounceOffPaddle() {
    var paddleCenterX = paddleX + (paddleWidth / 2);
    var xySpeedRatio;
    var xySpeedRatioCap = 5;

    function setDY() {
        dy = (-1) * Math.sqrt((actualSpeed * actualSpeed) - (dx * dx))
    }

    function setCappedXYRatio(side) {
        if (side == "left") {
            dx = (-1) * actualSpeed * (xySpeedRatioCap / (xySpeedRatioCap + 1))
            setDY();
        } else if (side == "right") {
            dx = actualSpeed * (xySpeedRatioCap / (xySpeedRatioCap + 1))
            //dy = (-1) * actualSpeed * (1 / xySpeedRatioCap);
            setDY();
        }
    }

    if (x >= paddleX && x <= paddleX + paddleWidth) {
        // Ball falls on top of the paddle
        if (x == paddleCenterX) {
            // Ball falls on the center
            dx = 0;
            //dy = (-1) * actualSpeed;
            setDY();
        }

        if (x < paddleCenterX) {
            // Ball falls on the left side
            if(x == paddleX) {
                // Ball falls on the edge
                setCappedXYRatio("left");
            } else {
                // Ball falls between the edge and the center
                xySpeedRatio = ((paddleWidth / 2) / ((paddleWidth / 2) - (paddleCenterX - x))) - 1;
                if (xySpeedRatio > xySpeedRatioCap) {
                    xySpeedRatio = xySpeedRatioCap;
                }

                dx = (-1) * actualSpeed * (xySpeedRatio / (xySpeedRatio + 1));
                //dy = (-1) * actualSpeed * (1 / xySpeedRatio);
                setDY();
            }
        }
        
        if (x > paddleCenterX) {
            // Ball falls on the right side
            if(x == paddleX + paddleWidth) {
                // Ball falls on the edge
                setCappedXYRatio("right");
            } else {
                // Ball falls between the edge and the center
                xySpeedRatio = ((paddleWidth / 2) / ((paddleWidth / 2) - (x - paddleCenterX))) - 1;
                if (xySpeedRatio > xySpeedRatioCap) {
                    xySpeedRatio = xySpeedRatioCap;
                }

                dx = actualSpeed * (xySpeedRatio / (xySpeedRatio + 1));
                //dy = (-1) * actualSpeed * (1 / xySpeedRatio);
                setDY();
            }
        }

    } else {
        dx = (-1) * dx;
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

    // Bricks
    brickClusterPadding = brickClusterPaddingToCanvasWidthRatio * canvas.width;
    brickClusterWidth = canvas.width - (2 * brickClusterPadding);
    brickSpacing = brickClusterWidth / (((brickColumnCount) * (1 / brickSpacingToWidthRatio)) + (brickColumnCount - 1));
    brickWidth = brickSpacing * (1 / brickSpacingToWidthRatio);
    brickHeight = brickWidth * brickHeightToWidthRatio;
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