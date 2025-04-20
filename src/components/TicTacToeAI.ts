export type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O' | null;
type Board = Player[];

export class TicTacToeAI {
  private difficulty: Difficulty;

  constructor(difficulty: Difficulty = 'medium') {
    this.difficulty = difficulty;
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }

  async getMove(board: Board): Promise<number> {
    // Add a small delay to simulate "thinking" (max 300ms)
    const delay = this.difficulty === 'easy' ? 100 : this.difficulty === 'medium' ? 200 : 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    switch (this.difficulty) {
      case 'easy':
        return this.getEasyMove(board);
      case 'medium':
        return this.getMediumMove(board);
      case 'hard':
        return this.getMinimaxMove(board);
      default:
        return this.getEasyMove(board);
    }
  }

  private getEasyMove(board: Board): number {
    // Simply find a random empty spot
    const emptySpots = board
      .map((spot, index) => spot === null ? index : -1)
      .filter(index => index !== -1);
    
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  }

  private getMediumMove(board: Board): number {
    // 70% chance to make the best move, 30% chance to make a random move
    if (Math.random() < 0.3) {
      return this.getEasyMove(board);
    }
    return this.getMinimaxMove(board);
  }

  private getMinimaxMove(board: Board): number {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = this.minimax(board, false, 0);
        board[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  }

  private minimax(board: Board, isMaximizing: boolean, depth: number): number {
    const winner = this.checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (this.isBoardFull(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = this.minimax(board, false, depth + 1);
          board[i] = null;
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = this.minimax(board, true, depth + 1);
          board[i] = null;
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }

  private checkWinner(board: Board): Player {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  private isBoardFull(board: Board): boolean {
    return !board.includes(null);
  }
}