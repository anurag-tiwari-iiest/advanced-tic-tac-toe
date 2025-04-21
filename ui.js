document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      gameBoard.appendChild(cell);
    }
  
    const cells = document.querySelectorAll(".game-board div");
    const resetButton = document.getElementById("reset-btn");
    const isSinglePlayer = window.location.pathname.includes("singleplayer");
  
    function makeAIMove() {
      const bestMove = minimax([...board], "O").index;
      if (bestMove !== undefined && gameActive && board[bestMove] === "") {
        handleCellPlayed(bestMove);
        const winner = checkWinner();
        if (winner) {
          gameActive = false;
          setTimeout(() => alert(winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`), 100);
        } else {
          currentPlayer = "X";
        }
      }
    }
  
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (gameActive && board[index] === "" && currentPlayer === "X") {
          handleCellPlayed(index);
          const winner = checkWinner();
          if (winner) {
            gameActive = false;
            // setTimeout(() => alert(winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`), 100);
          } else {
            currentPlayer = "O";
            if (isSinglePlayer) {
              setTimeout(makeAIMove, 300); // Small delay for realism
            }
          }
        }
      });
    });
  
    resetButton.addEventListener("click", resetGame);
  });
  