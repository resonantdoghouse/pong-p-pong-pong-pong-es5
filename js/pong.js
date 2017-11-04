// code along: https://www.udemy.com/code-your-first-game

var canvas,
    canvasContext,
    backgroundOffset,
    canvasNegWidth,
    backgroundWidth,
    ballX = 50,
    ballY = 50,
    ballSpeedX = 10,
    ballSpeedY = 4,
    paddleWidth = 10,
    paddleHeight = 100,
    paddle1Y = 250,
    paddle2Y = 250,
    player1Score = 0,
    player2Score = 0,
    framesPerSecond = 60;


const WINNING_SCORE = 3;


var background = new Image();

background.src = './assets/images/space-tile.jpg';


var backgroundPosition = 0;


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

function pos_to_neg(n) {
    return ~n + 1;
}

window.onload = init;

/**
 * Initialize Game
 */
function init() {
    canvas = document.getElementById('game__canvas');
    canvasContext = canvas.getContext('2d');
    backgroundWidth = background.width;

    backgroundOffset = (backgroundWidth - canvas.width) - framesPerSecond;
    canvasNegWidth = pos_to_neg(backgroundOffset);


    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (paddleHeight / 2);
    })

}

function ballReset() {
    if (player1Score >= WINNING_SCORE ||
        player2Score >= WINNING_SCORE) {
        player1Score = 0;
        player2Score = 0;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y &&
            ballY < paddle1Y + paddleHeight) {

            playSound(0);
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {

            playSound(1);
            player2Score++;
            ballReset();
        }

    }

    if (ballX > canvas.width) {

        if (ballY > paddle2Y &&
            ballY < paddle2Y + paddleHeight) {

            playSound(0);
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;

        } else {

            playSound(1);
            player1Score++;
            ballReset();
        }
    }

    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

/**
 * Drawing
 */
function drawEverything() {
    // canvasContext.clearRect(0,0,canvas.width,canvas.height);
    // background
    colorRect(0, 0, canvas.width, canvas.height, 'rgba(255, 255, 255, .3)');

    // image nonsense
    // canvasContext.globalAlpha = 0.5;
    // backgroundPosition--;

    // if (backgroundPosition > canvasNegWidth) {
    //     canvasContext.drawImage(background, backgroundPosition, 0);
    // } else {
    //     canvasContext.drawImage(background, 0, 0);
    //     backgroundPosition = 0;
    // }

    // canvasContext.globalAlpha = 1;

    // left player paddle
    colorRect(0, paddle1Y, paddleWidth, paddleHeight, 'black');

    // right player paddle
    colorRect(canvas.width - paddleWidth, paddle2Y, paddleHeight, paddleHeight, 'black');

    // ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);

}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = 'red';
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}



/**
 * Audio api oscillators
 */

var audioCtx = new AudioContext();
var oscillator;
var gainNode = audioCtx.createGain();

gainNode.connect(audioCtx.destination);

// osc.connect(gainNode);
// osc.start();

function playSound(soundType) {

    oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = getRandomArbitrary(240,640);

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    oscillatorTypes = ['sine', 'sawtooth', 'square', 'triangle'];

    switch (soundType) {
        case 0:
            oscillator.type = oscillatorTypes[0];
            break;

        case 1:
            oscillator.type = oscillatorTypes[1];
            break;
    }

    oscillator.connect(gainNode);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator.start();

    var stopAudio = function () {

        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);

        oscillator.disconnect(gainNode);
        setTimeout(function () {
            oscillator.stop();

        }, 1000);
    }

    setTimeout(stopAudio, 100);
}