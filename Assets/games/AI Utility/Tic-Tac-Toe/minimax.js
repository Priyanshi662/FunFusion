// if x wins - +1
// if O wins - -1
// if it is a tie  - 0
// X- maximizing player
// O- minimizing player 
// At each level of tree maaximizing and minimizing players are going to play alternatively


function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        // Backtracking to undo the move and check for next best move
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

// Lookup table to check the score:
let scores = {
  X: 10,
  O: -10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
	// Keep track of the depth/level too
  let result = checkWinner();
  if (result !== null) {
  	// We reached the endpoint of the node : Base Case of the algorithm : 
    return scores[result];
  }

  if (isMaximizing) {
  	// To maximize :
    let bestScore = -Infinity;
    // X turn right now :
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
        // Check for best possible move using recursively calling minimax at next level
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
  	// To minimize : 
    let bestScore = Infinity;
    // O turn right now:
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}