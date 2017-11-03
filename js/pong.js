var canvas,
    canvasContext,
    ballX = 50,
    ballY = 50,
    ballSpeedX = 10,
    ballSpeedY = 4,
    paddle1Y = 250;

const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {

    var rect = canvas.getBoundingClientRect(),
        root = document.documentElement,
        mouseX = evt.clientX - rect.left - root.scrollLeft,
        mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };

}

window.onload = init;

/**
 * Initialize Game
 */
function init() {
    canvas = document.getElementById('game__canvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 60;

    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', function(evt){
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y;
    })

}

function moveEverything() {

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if (ballX < 0) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX > canvas.width) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

}

function drawEverything() {
    // background
    // canvasContext.fillStyle = 'black';
    // canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // white box
    // canvasContext.fillStyle = 'white';
    // canvasContext.fillRect(0, 200, 10, 100);

    // red box
    // canvasContext.fillStyle = 'red';
    // canvasContext.fillRect(ballX, 100, 10, 10);

    // refactored --------------------------------

    // background
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    // left player paddle
    colorRect(0, 210, 10, 100, 'white');

    // draw ball
    // colorRect(ballX, 100, 10, 10, 'red');

    // canvasContext.fillStyle = 'red';
    // canvasContext.beginPath();
    // canvasContext.arc(ballX, canvas.height / 2, 10, 0, Math.PI*2, true);
    // canvasContext.fill();

    colorCircle(ballX, ballY, 10, 'white');
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}