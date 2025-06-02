import { useEffect, useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe({ gameId, gameState, playerId }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  // Real-time updates
  useEffect(() => {
    const gameRef = ref(db, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Convert Firebase board format to array
      const newBoard = Array(9).fill(null);
      if (data.board) {
        Object.entries(data.board).forEach(([key, value]) => {
          const index = parseInt(key, 10);
          if (index >= 0 && index < 9) newBoard[index] = value;
        });
      }
      
      setBoard(newBoard);
      setWinner(data.winner || null);
    });

    return () => unsubscribe();
  }, [gameId]);

  const calculateWinner = (squares) => {
    for (let [a, b, c] of WINNING_LINES) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const checkTie = (squares) => {
    return squares.every(cell => cell !== null) && !calculateWinner(squares);
  };

  const handleMove = async (index) => {
    if (board[index] || winner) return;
    
    // Determine player symbol
    console.log('Game state in tic tac toe.js-->',gameState);
    const playerIndex = gameState.players.indexOf(playerId);
    const currentSymbol = playerIndex === 0 ? 'X' : 'O';
    
    if (gameState.currentPlayer !== currentSymbol) return;

    const newBoard = [...board];
    newBoard[index] = currentSymbol;
    const newWinner = calculateWinner(newBoard);
    const isTie = checkTie(newBoard);

    await set(ref(db, `games/${gameId}`), {
      ...gameState,
      board: newBoard,
      currentPlayer: currentSymbol === 'X' ? 'O' : 'X',
      winner: newWinner || (isTie ? 'tie' : null)
    });
  };

  const resetGame = async () => {
    await set(ref(db, `games/${gameId}`), {
      ...gameState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null
    });
  };

  return (
    <div className="tic-tac-toe">
      <h2>
        {winner === 'tie' ? "Game Tied!" :
         winner ? `Winner: ${winner}` : 
         `Current Player: ${gameState.currentPlayer}`}
      </h2>
      
      <div className="game-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleMove(index)}
            disabled={
              gameState.currentPlayer !== (gameState.players[0] === playerId ? 'X' : 'O') ||
              !!cell ||
              !!winner
            }
          >
            {cell}
          </button>
        ))}
      </div>

      {(winner || winner === 'tie') && (
        <button className="reset-button" onClick={resetGame}>
          {winner === 'tie' ? 'Try Again' : 'Play Again'}
        </button>
      )}
    </div>
  );
}
