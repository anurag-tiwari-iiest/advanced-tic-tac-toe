function minimax(board, player) {
    // Get all available spots on the board
    const availableSpots = board.map((cell, index) => (cell === "" ? index : null)).filter((cell) => cell !== null);
  
    // Check for terminal states (win, loss, tie)
    const winner = checkWinner(board);
    if (winner === "X") return { score: -10 }; // Human wins
    if (winner === "O") return { score: 10 };  // AI wins
    if (availableSpots.length === 0) return { score: 0 }; // Tie
  
    // Array to store all possible moves
    const moves = [];
  
    // Loop through available spots to simulate moves
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i]; // Store the index of the move
      board[availableSpots[i]] = player; // Make the move on the board
  
      // Recursively call minimax for the opponent
      if (player === "O") {
        const result = minimax(board, "X"); // Simulate human's turn next
        move.score = result.score; // Store the score of the move
      } else {
        const result = minimax(board, "O"); // Simulate AI's turn next
        move.score = result.score; // Store the score of the move
      }
  
      board[availableSpots[i]] = ""; // Undo the move (reset the spot)
      moves.push(move); // Store the move in the array
    }
  
    // Determine the best move based on the player's turn
    let bestMove;
    if (player === "O") {
      // AI's turn: Maximize score
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      // Human's turn: Minimize score
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }
  
    return bestMove; // Return the best move
  }