import React from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface TicTacToeBoardProps {
  board: Board;
  onMove: (index: number) => void;
  isPlayerTurn: boolean;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onMove, isPlayerTurn }) => {
  return (
    <div className="board">
      {board.map((value, index) => (
        <div
          key={index}
          className={`cell${value ? ' marked' : ''}${isPlayerTurn && !value ? ' clickable' : ''}`}
          onClick={() => {
            if (isPlayerTurn && !value) {
              onMove(index);
            }
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default TicTacToeBoard;