import { useState, useEffect } from 'react'
import './App.css'
import TicTacToeBoard from './components/TicTacToeBoard'
import { TicTacToeAI, type Difficulty } from './components/TicTacToeAI'

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'ai' | '2players';

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Player X\'s turn');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [ai] = useState(() => new TicTacToeAI('medium'));
  const [isThinking, setIsThinking] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('ai');

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
      if (gameMode === 'ai') {
        setGameStatus(winner === 'X' ? 'You win!' : 'AI wins!');
      } else {
        setGameStatus(`Player ${winner} wins!`);
      }
    } else if (isBoardFull(board)) {
      setGameStatus("It's a draw!");
    } else {
      if (gameMode === 'ai') {
        setGameStatus(isPlayerTurn ? 'Your turn (X)' : 'AI thinking... (O)');
      } else {
        setGameStatus(`Player ${isPlayerTurn ? 'X' : 'O'}'s turn`);
      }
    }
  }, [board, isPlayerTurn, gameMode]);

  const handleMove = async (index: number) => {
    if (board[index] || checkWinner(board)) return;
    
    if (gameMode === '2players' || (gameMode === 'ai' && isPlayerTurn)) {
      const newBoard = [...board];
      newBoard[index] = isPlayerTurn ? 'X' : 'O';
      setBoard(newBoard);
      
      if (gameMode === '2players') {
        setIsPlayerTurn(!isPlayerTurn);
      } else if (!checkWinner(newBoard) && !isBoardFull(newBoard)) {
        setIsPlayerTurn(false);
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
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    ai.setDifficulty(newDifficulty);
  };

  const handleGameModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    resetGame();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setIsThinking(false);
    if (gameMode === 'ai') {
      setGameStatus('Your turn (X)');
    } else {
      setGameStatus('Player X\'s turn');
    }
  };

  return (
    <div className="game-container">
      <h1>Tic-tac-toe</h1>
      <div className="status">{gameStatus}</div>
      <div className="game-controls">
        <div className="mode-controls">
          <label>Game Mode: </label>
          <select 
            value={gameMode} 
            onChange={(e) => handleGameModeChange(e.target.value as GameMode)}
            disabled={isThinking}
          >
            <option value="ai">vs AI</option>
            <option value="2players">2 Players</option>
          </select>
        </div>
        {gameMode === 'ai' && (
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
        )}
      </div>
      <TicTacToeBoard 
        board={board}
        onMove={handleMove}
        isPlayerTurn={gameMode === '2players' || (gameMode === 'ai' && !isThinking)}
      />
      <div className="controls">
        <button onClick={resetGame} disabled={isThinking}>New Game</button>
      </div>
    </div>
  )
}

export default App
