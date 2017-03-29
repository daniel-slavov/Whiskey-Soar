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
            var currentBrickX = canvas.width * 0.025 + (col * brickSpacingX) + (col * brickWidth);
            var currentBrickY = canvas.height * 0.1 + (row * brickSpacingY) + (row * brickHeight);
            bricks[col][row].x = currentBrickX;
            bricks[col][row].y = currentBrickY;

            if (bricks[col][row].status > 0) {
                context.beginPath();
                context.rect(currentBrickX, currentBrickY, brickWidth, brickHeight);
                if (row % 2 === 0) {
                    context.fillStyle = "#841F27";
                } else {
                    context.fillStyle = "#FFFF00";
                    if (bricks[col][row].status === 1) {
                        context.fillStyle = "#841F27";
                    }
                }
                context.fill();
                context.closePath();
            }
        }
    }
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#841F27";
    context.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#841F27";
    context.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    var isChangedDirection = false;
    var sideZoneWidth = brickWidth / 50;
    var centralZoneWidth = (brickWidth / 25) * 24;

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {

            let brickToCheck = bricks[c][r];

            if (brickToCheck.status > 0) {
                // Check if ball hits center zone - changes the movement on the Y axis
                if (brickToCheck.x + sideZoneWidth < x && (brickToCheck.x + brickWidth - sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status -= 1;

                    score += 10;

                    dy = -dy;

                }
                // Check if ball hits LEFT side zone - changes the movement on the X axis
                if (brickToCheck.x - ballRadius < x && (brickToCheck.x + sideZoneWidth) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status -= 1;

                    score += 10;

                    dx = -dx;
                    if (!isChangedDirection) {
                        dy = -dy;
                        isChangedDirection = true;
                    }


                }

                // Check if ball hits RIGHT side zone - changes the movement on the X axis
                if ((brickToCheck.x + brickWidth - sideZoneWidth) < x && (brickToCheck.x + brickWidth + ballRadius) > x &&
                    (brickToCheck.y - ballRadius < y) && ((brickToCheck.y + brickHeight + ballRadius) > y)) {

                    brickToCheck.status -= 1;
                    score += 10;

                    dx = -dx;
                    if (!isChangedDirection) {
                        dy = -dy;
                        isChangedDirection = true;
                    }
                }

                // End of the game
                if (score === maxPoints) {
                    alert("You Won");
                    document.location.reload();
                }
            }
        }
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
            if (x == paddleX) {
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
            if (x == paddleX + paddleWidth) {
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
    // Window
    canvas.width = (9 / 10) * window.innerWidth;
    canvas.height = (9 / 10) * window.innerHeight;

    // Ball
    ballRadius = 0.01 * (canvas.width + canvas.height);

    // Paddle
    paddleHeight = 0.02 * canvas.height;
    paddleWidth = 0.2 * canvas.width;
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - (paddleHeight * 2);

    x = canvas.width / 2;
    y = paddleY - ballRadius;

    // Bricks
    brickWidth = canvas.width * 0.9 / brickColumnCount;
    brickSpacingX = canvas.width * 0.05 / (brickColumnCount - 1);
    brickHeight = canvas.height * 0.3 / brickRowCount;
    brickSpacingY = canvas.height * 0.05 / (brickRowCount - 1);
}

function checkWindowSize() {
    if (window.innerHeight !== windowHeight || window.innerWidth !== windowWidth) {
        resizeCanvas();
    }
}
//Add some sounds
function startSoundTrack() {
    var audio = document.getElementById("audio");
    audio.play();
}

function update() {
    x += dx;
    y += dy;
}

function draw() {
    if (!isPause) {
        checkWindowSize();
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        ballIsInRange();
        movePaddle();
        startSoundTrack();
        update();

    }
}

// MENU
function startGame() {
    var buttonsContainer = document.getElementById('button-container');

    buttonsContainer.addEventListener("click", function(e) {
        var clickedButton = e.target;
        var clickedButtonClass = e.target.getAttribute("class");
        var buttons = Array.prototype.slice.apply(document.getElementsByTagName('button'));
        var isButton = clickedButtonClass == 'easy-button' || clickedButtonClass == 'normal-button' ||
            clickedButtonClass == 'hard-button';

        buttons.forEach(b => b.style.backgroundColor = "#841F27");

        if (isButton) {
            clickedButton.style.backgroundColor = "#CC0000";
        }

        switch (clickedButtonClass) {
            case 'easy-button':
                dy = -2;
                dx = (Math.random() < 0.5) ? -2 : 2;
                break;
            case 'normal-button':
                dy = -3.5;
                dx = (Math.random() < 0.5) ? -3.5 : 3.5;
                break;
            case 'hard-button':
                dy = -5;
                dx = (Math.random() < 0.5) ? -5 : 5;
                break;
            case 'start-button':
                if (dx !== undefined && dy !== undefined) {
                    buttonsContainer.style.display = "none";
                    actualSpeed = Math.sqrt((dx * dx) + (dy * dy));

                    // Execution of the code
                    setInterval(draw, 10);
                    break;
                }
        }
    });
}

resizeCanvas();
startGame();