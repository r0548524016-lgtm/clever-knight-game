const p1 = sessionStorage.getItem('player1');
const p2 = sessionStorage.getItem('player2');

if (!p1 || !p2) {
    sessionStorage.clear();
    window.location.replace("../home.html");
}

const player1 = JSON.parse(sessionStorage.getItem('player1'));
const nameP1 = player1.name;
const player2 = JSON.parse(sessionStorage.getItem('player2'));
const nameP2 = player2.name;
let scoresP1 = player1.CleverKnightWins || 0;
let scoresP2 = player2.CleverKnightWins || 0;
document.querySelector('#p1-display .player-name').innerText = nameP1;
document.querySelector('#p2-display .player-name').innerText = nameP2;
document.getElementById('wins1').innerText = scoresP1;
document.getElementById('wins2').innerText = scoresP2;

const SIZE_OF_BOARD = 8;
let selectedPiece = null;
let queue = 'player1Piece';
let timeLeft = 30;
let timerInterval = null;
const board = document.getElementById("board");

document.getElementById('p1-display').innerText = nameP1;
document.getElementById('p2-display').innerText = nameP2;

document.getElementById('log-out').addEventListener('click', () => logOut());

function logOut() {
    window.location.replace("../home.html")
    sessionStorage.clear();
}

document.getElementById('restart').addEventListener('click', () => restart());

function restart() {
    location.reload();
}

function switchTurn() {
    queue = (queue === 'player1Piece' ? 'player2Piece' : 'player1Piece');
    startTimer();
}

function startGame() {
    board.innerHTML = "";
    for (let x = 1; x <= SIZE_OF_BOARD; x++) {
        for (let y = 1; y <= SIZE_OF_BOARD; y++) {
            const square = document.createElement("div");
            square.valueX = x;
            square.valueY = y;
            square.classList.add(getSquareClass(square, x, y));
            addEventToSquare(square);
            board.appendChild(square);
            addPieceToSquare(square, x, y);
        }
    }
    startTimer();
}

function isStartingPosition(x, y) {
    return (x > 2 && x < 7) || (y > 2 && y < 7);
}

function getSquareClass(square, x, y) {
    if (winArea(square)) return 'winArea';
    if (gameArea(square)) return 'gameArea';
    return isStartingPosition(x, y) ? 'basePlace' : 'hidden';
}

function calculatePieceColor(x, y) {
    return (x + y + (x == 1 || x == 8)) % 2 ? 'player2Piece' : 'player1Piece';
}

function addPieceToSquare(square, x, y) {
    if (square.classList.contains('basePlace')) {
        const piece = document.createElement("div");
        piece.classList.add(calculatePieceColor(x, y));
        square.appendChild(piece);
        addEventToPiece(piece);
    }
}

function addEventToPiece(piece) {
    piece.setAttribute('draggable', 'true');
    piece.addEventListener('dragstart', (e) => {
        if (piece.classList.contains(queue)) {
            gameToolSelected(piece);
        } else {
            e.preventDefault();
        }
    });
}

function addEventToSquare(square) {
    if (gameArea(square)) {
        square.addEventListener('dragover', (e) => e.preventDefault());
        square.addEventListener('drop', () => SquareCrossing(square));
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    const timerDisplay = document.getElementById('timer');

    const p1Box = document.getElementById('p1-display');
    const p2Box = document.getElementById('p2-display');
    p1Box.classList.remove('active');
    p2Box.classList.remove('active');
    if (queue === 'player1Piece') {
        p1Box.classList.add('active');
    } else {
        p2Box.classList.add('active');
    }

    if (timerDisplay) timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (selectedPiece) {
                selectedPiece.classList.remove('selectedPiece');
                removeHighlights();
            }
            switchTurn();
            startTimer();
        }
    }, 1000);
}

function winArea(square) {
    return square.valueX > 2 && square.valueX < 7 && square.valueY > 2 && square.valueY < 7;
}

function gameArea(square) {
    return square.valueX > 1 && square.valueX < 8 && square.valueY > 1 && square.valueY < 8;
}

function legalStep(square, piece) {
    const source = piece.parentElement;
    const diffX = Math.abs(source.valueX - square.valueX);
    const diffY = Math.abs(source.valueY - square.valueY);
    const isLMove = (diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1);
    const hasSpace = square.children.length < 3;
    return isLMove && hasSpace && gameArea(square);
}

function gameToolSelected(piece) {
    if (selectedPiece && selectedPiece != piece) {
        selectedPiece.classList.remove('selectedPiece')
        removeHighlights();
    }
    selectedPiece = piece;
    piece.classList.add('selectedPiece');
}

function SquareCrossing(square) {
    if (selectedPiece && selectedPiece.parentElement != square) {
        if (legalStep(square, selectedPiece)) {
            const scoresSquare = selectedPiece.parentElement
            if (square.firstChild) {
                square.insertBefore(selectedPiece, square.firstChild);
            } else {
                square.appendChild(selectedPiece);
            }

            locationAccordingPartsStack(selectedPiece, square.children.length);
            selectedPiece.classList.remove('selectedPiece');
            if (scoresSquare.firstChild)
                if (check(scoresSquare))
                    return;
            check(square);
            selectedPiece = null;
            switchTurn();
            removeHighlights();
            startTimer();
        } else {
            showValidSquares();
        }
    }
}

function check(square) {
    if (winArea(square)) {
        const x = square.valueX;
        const y = square.valueY;
        const classOfPiece = square.firstChild.classList.contains('player2Piece') ? 'player2Piece' : 'player1Piece';
        let winningPositions = winOptionsCalculation(x, y, classOfPiece);
        if (winningPositions) {
            clearInterval(timerInterval);
            winningPositions.forEach(sq => sq.classList.add('selectedPiece'));
            board.classList.add('selectedPiece');
            board.classList.add('win-glow');

            const winnerName = (classOfPiece === 'player1Piece' ? nameP1 : nameP2);
            setTimeout(() => {
                showVictory(winnerName);
            }, 5000);
            setTimeout(() => {
                let scores = JSON.parse(localStorage.getItem('knightScores'));
                scores[winnerName] = (scores[winnerName] || 0) + 1;
                localStorage.setItem('knightScores', JSON.stringify(scores));
                location.reload();
            }, 20000);
            return true;
        }
        return false;
    }
}

function locationAccordingPartsStack(piece, stackSize) {
    piece.style.transform = stackSize === 2 ? 'translate(10px, -10px)' : (stackSize === 3 ? 'translate(20px, -20px)' : '');
    piece.style.zIndex = stackSize;
}

function showValidSquares() {
    removeHighlights();
    const squares = board.children;
    for (let square of squares) {
        if (selectedPiece && legalStep(square, selectedPiece)) {
            square.classList.add('highlight');
        }
    }
}

function removeHighlights() {
    Array.from(board.children).forEach(sq => sq.classList.remove('highlight'));
}

function winOptionsCalculation(x, y, classOfPiece) {
    const squares = board.children;
    const allSquares = Array.from(squares);
    let isWin;
    let squaresToCheck;
    let i;
    for (i = 0; i < 7; i++) {
        isWin = true;
        switch (i) {
            case 0:
                squaresToCheck = allSquares.filter(rowToCheck(x));
                break;
            case 1:
                squaresToCheck = allSquares.filter(columnToCheck(y));
                break;
            case 2:
                if (x === y)
                    squaresToCheck = allSquares.filter(mainDiagonalToCheck());
                else if (x + y === 9)
                    squaresToCheck = allSquares.filter(secondaryDiagonalToCheck());
                break;
            case 3:
                if (x > 3 && y > 3)
                    squaresToCheck = allSquares.filter(wichSquaresToCheck(x - 1, y - 1));
                break;
            case 4:
                if (x < 6 && y > 3)
                    squaresToCheck = allSquares.filter(wichSquaresToCheck(x, y - 1));
                break;
            case 5:
                if (x > 3 && y < 6)
                    squaresToCheck = allSquares.filter(wichSquaresToCheck(x - 1, y));
                break;
            case 6:
                if (x < 6 && y < 6)
                    squaresToCheck = allSquares.filter(wichSquaresToCheck(x, y));
                break;
            default:
                return null;
        }
        squaresToCheck.forEach(square => {
            if (!(square.firstChild && square.firstChild.classList.contains(classOfPiece)))
                isWin = false;
        });
        if (isWin)
            return squaresToCheck;
    }
    return null;
}

function columnToCheck(y) {
    return square => square.valueY === y && winArea(square);
}

function rowToCheck(x) {
    return square => square.valueX === x && square.valueY > 2 && square.valueY < 7;
}

function mainDiagonalToCheck() {
    return square => square.valueX === square.valueY && square.valueX > 2 && square.valueX < 7;
}

function secondaryDiagonalToCheck() {
    return square => square.valueX + square.valueY === SIZE_OF_BOARD + 1 && square.valueX > 2 && square.valueX < 7;
}

function wichSquaresToCheck(x, y) {
    return square => (square.valueX === x || square.valueX === x + 1) && (square.valueY === y || square.valueY === y + 1);
}

function showVictory(playerName) {
    const overlay = document.getElementById("victory-overlay");
    const text = document.getElementById("victory-text");
    const canvas = document.getElementById("confetti");
    const sound = document.getElementById("win-sound");

    text.textContent = `${playerName} ניצח! ✨`;
    overlay.style.display = "flex";

    const stopConfetti = startConfetti(canvas);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => { });
        sound.addEventListener('ended', () => {
            stopConfetti();
        });
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const winnerObj = users.find(u => u.name === playerName);
    if (winnerObj) {
        winnerObj.CleverKnightWins = (winnerObj.CleverKnightWins || 0) + 1;
    }
    localStorage.setItem('users', JSON.stringify(users));

    const resetTime = sound ? (sound.duration * 1000 + 1000) : 6000;
    setTimeout(() => location.reload(), resetTime);
}

function startConfetti(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let running = true;

    const pieces = [];
    const colors = ["#4fc3f7", "#f5c542", "#ffffff", "#38bdf8"];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function update() {
        if (!running) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speed;
            if (p.y > canvas.height) p.y = -10;

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        requestAnimationFrame(update);
    }

    update();

    return () => {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}
window.onload = startGame;
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        sessionStorage.clear();
        window.location.replace("../home.html");
    }
});