import { useState, useEffect } from 'react'
import './App.css'
import TicTacToeBoard from './components/TicTacToeBoard'
import { TicTacToeAI, type Difficulty } from './components/TicTacToeAI'

type Player = 'X' | 'O' | null;
type Board = Player[];

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Your turn (X)');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [ai] = useState(() => new TicTacToeAI('medium'));
  const [isThinking, setIsThinking] = useState(false);

  const checkWinner = (currentBoard: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const isBoardFull = (currentBoard: Board): boolean => {
    return !currentBoard.includes(null);
  };

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setGameStatus(winner === 'X' ? 'You win!' : 'AI wins!');
    } else if (isBoardFull(board)) {
      setGameStatus("It's a draw!");
    } else {
      setGameStatus(isPlayerTurn ? 'Your turn (X)' : 'AI thinking... (O)');
    }
  }, [board, isPlayerTurn]);

  const handlePlayerMove = async (index: number) => {
    if (!isPlayerTurn || board[index] || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    
    // Check if game is over after player's move
    if (!checkWinner(newBoard) && !isBoardFull(newBoard)) {
      setIsThinking(true);
      try {
        const aiMove = await ai.getMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
      } finally {
        setIsThinking(false);
        setIsPlayerTurn(true);
      }
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    ai.setDifficulty(newDifficulty);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setIsThinking(false);
    setGameStatus('Your turn (X)');
  };

  return (
    <div className="game-container">
      <h1>Tic-tac-toe vs AI</h1>
      <div className="status">{gameStatus}</div>
      <div className="difficulty-controls">
        <label>AI Level: </label>
        <select 
          value={difficulty} 
          onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
          disabled={isThinking}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <TicTacToeBoard 
        board={board}
        onMove={handlePlayerMove}
        isPlayerTurn={isPlayerTurn && !isThinking}
      />
      <div className="controls">
        <button onClick={resetGame} disabled={isThinking}>New Game</button>
      </div>
    </div>
  )
}

export default App
