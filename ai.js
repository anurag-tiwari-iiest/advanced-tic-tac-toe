let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xMoves = [];
let oMoves = [];

document.addEventListener("DOMContentLoaded", () => {
  const boardContainer = document.getElementById("game-board");
  const resetBtn = document.getElementById("reset-btn");

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    boardContainer.appendChild(cell);
  }

  const cells = document.querySelectorAll(".game-board div");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (gameActive && board[index] === "" && currentPlayer === "X") {
        handleMove(index);
        const winner = checkWinner();
        if (winner) {
          gameActive = false;
          updateTurnIndicator(winner);
          return;
        }
        currentPlayer = "O";
        updateTurnIndicator();
        setTimeout(() => {
          makeAIMove();
          const winner = checkWinner();
          if (winner) {
            gameActive = false;
            updateTurnIndicator(winner);
            return;
          }
          currentPlayer = "X";
          updateTurnIndicator();
        }, 800);
      }
    });
  });

  resetBtn.addEventListener("click", resetGame);
  updateTurnIndicator();
  updateFading();
});

function handleMove(index) {
  board[index] = currentPlayer;
  const cell = document.querySelectorAll(".game-board div")[index];
  cell.textContent = currentPlayer;
  cell.classList.remove("faded");

  let moves = currentPlayer === "X" ? xMoves : oMoves;
  moves.push(index);

  if (moves.length > 3) {
    const removedIndex = moves.shift();
    board[removedIndex] = "";
    const removedCell = document.querySelectorAll(".game-board div")[removedIndex];
    removedCell.textContent = "";
    removedCell.classList.remove("faded");
  }

  updateFading();
}

function updateTurnIndicator(winner = null) {
  const indicator = document.getElementById("turn-indicator");
  if (winner === "Tie") {
    indicator.innerHTML = "🤝 <strong>It's a Tie!</strong>";
    indicator.classList.add("end-message");
  } else if (winner === "X" || winner === "O") {
    indicator.innerHTML = `🏆 <strong>${winner} Won!</strong>`;
    indicator.classList.add("end-message");
  } else {
    indicator.textContent = `${currentPlayer}'s Turn`;
    indicator.classList.remove("end-message");
  }
}

function updateFading() {
  document.querySelectorAll('.game-board div').forEach(cell => {
    cell.classList.remove("faded");
  });

  // Fade the opponent's oldest move (not current player)
  const fadingMoves = currentPlayer === "X" ? oMoves : xMoves;
  if (fadingMoves.length === 3) {
    const fadeCell = document.querySelectorAll(".game-board div")[fadingMoves[0]];
    fadeCell.classList.add("faded");
  }
}

function checkWinner() {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const moves = currentPlayer === "X" ? xMoves.slice(-3) : oMoves.slice(-3);

  for (let combo of winCombos) {
    if (combo.every(i => moves.includes(i))) {
      return currentPlayer;
    }
  }

  if (board.every(cell => cell !== "")) return "Tie";
  return null;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  xMoves = [];
  oMoves = [];

  const cells = document.querySelectorAll(".game-board div");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("faded");
  });

  updateTurnIndicator();
  updateFading();
}

// ========== AI LOGIC ==========

function makeAIMove() {
  const bestMove = getBestMove([...board], [...oMoves], [...xMoves]);
  if (bestMove !== undefined && board[bestMove] === "") {
    handleMove(bestMove);
  }
}

function getBestMove(currentBoard, currentO, currentX) {
  let bestScore = -Infinity;
  let move;

  const available = currentBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  for (let i of available) {
    currentBoard[i] = "O";
    let newO = [...currentO, i];
    if (newO.length > 3) newO = newO.slice(1);

    let score = minimax(currentBoard, newO, currentX, 0, false);
    currentBoard[i] = "";

    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  return move;
}

function minimax(boardState, oState, xState, depth, isMax) {
  const winner = evalWinner(oState, xState);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (boardState.every(cell => cell !== "")) return 0;

  const avail = boardState.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  if (isMax) {
    let maxEval = -Infinity;
    for (let i of avail) {
      boardState[i] = "O";
      let newO = [...oState, i];
      if (newO.length > 3) newO = newO.slice(1);
      let eval = minimax(boardState, newO, xState, depth + 1, false);
      boardState[i] = "";
      maxEval = Math.max(maxEval, eval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i of avail) {
      boardState[i] = "X";
      let newX = [...xState, i];
      if (newX.length > 3) newX = newX.slice(1);
      let eval = minimax(boardState, oState, newX, depth + 1, true);
      boardState[i] = "";
      minEval = Math.min(minEval, eval);
    }
    return minEval;
  }
}

function evalWinner(oState, xState) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combo of winCombos) {
    if (combo.every(i => oState.includes(i))) return "O";
    if (combo.every(i => xState.includes(i))) return "X";
  }
  return null;
}
