const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const leaderboardList = document.getElementById("leaderboard-list");
const ghostColor = "rgba(128, 128, 128, 0.5)";

let board, score, level, playerName, intervalId, tetromino, isGameOver;
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33FF", "#FFFF33", "#FF5733", "#33FFF2"];
const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 30;
const leaderboard = [];
const tetrominoes = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]]
];

function startGame() {
  playerName = document.getElementById("player-name").value || "Anonymous";
  document.getElementById("player-info").style.display = "none";
  initializeGame();
}

function initializeGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  level = 1;
  isGameOver = false;
  updateScore(0);
  spawnTetromino();
  intervalId = setInterval(updateGame, 1000 - (level - 1) * 100);
  document.addEventListener("keydown", handleKeyDown);
}

function spawnTetromino() {
  tetromino = { shape: getRandomTetromino(), row: 0, col: 3, color: colors[Math.floor(Math.random() * colors.length)] };
  if (!canMove(tetromino.shape, tetromino.row, tetromino.col)) endGame();
}

function getRandomTetromino() {
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = colors[board[r][c] - 1];
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function drawTetromino() {
  tetromino.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        ctx.fillStyle = tetromino.color;
        ctx.fillRect((tetromino.col + c) * CELL_SIZE, (tetromino.row + r) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    });
  });
}

function updateGame() {
  if (!isGameOver) {
    move("down");
    drawBoard();
    drawGhostTetromino();
    drawTetromino();
  } else {
    clearInterval(intervalId);
    alert("Game Over! Your score: " + score);
  }
}

function handleKeyDown(event) {
  if (isGameOver) return;

  switch (event.key) {
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowUp":
      rotateTetromino();
      break;
    case " ":
      dropTetromino();
      break;
  }
}

function drawGhostTetromino() {
  const ghostRow = getGhostRow();
  tetromino.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        ctx.fillStyle = ghostColor;
        ctx.fillRect((tetromino.col + c) * CELL_SIZE, (ghostRow + r) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    });
  });
}

function getGhostRow() {
  let ghostRow = tetromino.row;
  while (canMove(tetromino.shape, ghostRow + 1, tetromino.col)) {
    ghostRow++;
  }
  return ghostRow;
}

function move(direction) {
  if (direction === "left" && canMove(tetromino.shape, tetromino.row, tetromino.col - 1)) {
    tetromino.col--;
  } else if (direction === "right" && canMove(tetromino.shape, tetromino.row, tetromino.col + 1)) {
    tetromino.col++;
  } else if (direction === "down") {
    if (canMove(tetromino.shape, tetromino.row + 1, tetromino.col)) {
      tetromino.row++;
    } else {
      lockTetromino();
      checkForCompletedRows();
      spawnTetromino();
    }
  }
  drawBoard();
  drawTetromino();
}

function canMove(shape, row, col) {
  return shape.every((r, i) => r.every((cell, j) => !cell || (row + i < ROWS && col + j >= 0 && col + j < COLS && !board[row + i][col + j])));
}

function rotateTetromino() {
    const rotated = tetromino.shape[0].map((_, i) => tetromino.shape.map(row => row[i])).reverse();
    
    // Try rotating and adjust position if out of bounds
    if (canMove(rotated, tetromino.row, tetromino.col)) {
      tetromino.shape = rotated;
    } else {
      // If rotation is blocked, try shifting left or right
      if (canMove(rotated, tetromino.row, tetromino.col - 1)) {
        tetromino.col--;
        tetromino.shape = rotated;
      } else if (canMove(rotated, tetromino.row, tetromino.col + 1)) {
        tetromino.col++;
        tetromino.shape = rotated;
      }
    }
  
    drawBoard();
    drawTetromino();
  }

function dropTetromino() {
  while (canMove(tetromino.shape, tetromino.row + 1, tetromino.col)) {
    tetromino.row++;
  }
  lockTetromino();
  drawBoard();
  drawTetromino();
}

function lockTetromino() {
  tetromino.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) board[tetromino.row + r][tetromino.col + c] = colors.indexOf(tetromino.color) + 1;
    });
  });
  clearLines();
  spawnTetromino();
}

function clearLines() {
  board = board.filter(row => row.some(cell => !cell));
  while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
  updateScore(10 * level);
}

function updateScore(points) {
  score += points;
  scoreboard.textContent = score;
  if (score / 100 > level) {
    level++;
    levelDisplay.textContent = level;
    clearInterval(intervalId);
    intervalId = setInterval(updateGame, 1000 - (level * 50));
  }
}

function endGame() {
  clearInterval(intervalId);
  isGameOver = true;
  saveScore();
  displayGameOverOverlay();
}

function displayGameOverOverlay() {
    const overlay = document.getElementById("game-over-overlay");
    overlay.style.display = "block"; // Show the overlay
    overlay.innerHTML = `<p>Game Over, ${playerName}!</p>
                         <button onclick="restartGame()">Restart</button>`;
  }
  function restartGame() {
    const overlay = document.getElementById("game-over-overlay");
    overlay.style.display = "none"; // Hide the overlay
    document.getElementById("player-info").style.display = "block";
    isGameOver = false;
    initializeGame();
  }

function saveScore() {
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  updateLeaderboard();
}

function updateLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.slice(0, 5).forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(listItem);
  });
}

window.addEventListener("beforeunload", () => saveScore());
