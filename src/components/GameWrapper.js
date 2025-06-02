import { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import TicTacToe from './TicTacToe';
import ShareButton from './ShareButton';

export default function GameWrapper() {
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerId] = useState(() => uuidv4());

  // Game initialization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const existingGameId = params.get('gameId');
    
    existingGameId ? joinGame(existingGameId) : createGame();
  }, []);

  const createGame = async () => {
    const newGameId = uuidv4();
    await set(ref(db, `games/${newGameId}`), {
      players: [playerId],
      currentPlayer: 'X',
      board: Array(9).fill(null),
      status: 'waiting',
      winner: null
    });
    setupGameListener(newGameId);
  };

  const joinGame = (gameId) => {
    const gameRef = ref(db, `games/${gameId}`);
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Add second player if needed
      if (data.players.length < 2 && !data.players.includes(playerId)) {
        const updatedPlayers = [...data.players, playerId];
        set(ref(db, `games/${gameId}`), {
          ...data,
          players: updatedPlayers,
          status: 'active',
          currentPlayer: 'X'
        });
      }
      
      updateGameState(data, gameId);
    });
  };

  const setupGameListener = (gameId) => {
    const gameRef = ref(db, `games/${gameId}`);
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      updateGameState(data, gameId);
    });
  };

  const updateGameState = (data, gameId) => {
    if (!data) return;
    const players = data.players?.length >= 2 ? 
      data.players : 
      [...(data.players || []), null];
    setGameState({ ...data, players });
    setGameId(gameId);
  };

  return (
    <div className="game-container">
      {gameId && <ShareButton gameId={gameId} />}
      {gameState && (
        <TicTacToe 
          gameId={gameId}
          gameState={gameState}
          playerId={playerId}
        />
      )}
    </div>
  );
}
