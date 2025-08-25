"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { createGame, simulateAiMove } from "@/lib/gameService";
import { listenToGame } from "@/lib/gameListeners";
import { puzzles } from "@/data/puzzles";
import CrosswordGrid from "@/components/CrosswordGrid";
import CluesList from "@/components/CluesList";
import ChatBox from "@/components/ChatBox";
import Scoreboard from "@/components/ScoreBoard";

export default function App() {
  const [currentPuzzle] = useState(puzzles[0]); // pick puzzle1
  const [gameId, setGameId] = useState<string | null>(null);
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [gameData, setGameData] = useState<any>(null);

  /** ---------------- New Game Handler ---------------- */
  const startNewGame = async () => {
    const newGameId = uuidv4();
    await createGame(newGameId, currentPuzzle.id);
    setGameId(newGameId);
    setSolvedWords([]);
    setCurrentWord(null);
  };

  /** ---------------- Listen to game updates ---------------- */
  useEffect(() => {
    if (!gameId) return;
    const unsub = listenToGame(gameId, (data) => {
      if (!data) return;
      setGameData(data);
      if (Array.isArray(data.solvedWords)) {
        setSolvedWords(data.solvedWords);
      }
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [gameId]);

  /** ---------------- AI player simulation ---------------- */
  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(() => {
      simulateAiMove(gameId, currentPuzzle, solvedWords).catch(console.error);
    }, 5000); // AI solves a word every 5 seconds

    return () => clearInterval(interval);
  }, [gameId, currentPuzzle, solvedWords]);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Crossword Battle Arena</h1>

      {/* New Game Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={startNewGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          New Game
        </button>
      </div>

      {/* Scoreboard */}
      {gameData && (
        <Scoreboard
          scores={{
            player1: gameData.players?.player1?.score ?? 0,
            ai: gameData.players?.ai?.score ?? 0,
          }}
        />
      )}

      {/* Main Game Layout */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Crossword Grid */}
        <CrosswordGrid
          gameId={gameId ?? ""}
          puzzle={currentPuzzle}
          solvedWords={solvedWords}
          setSolvedWords={setSolvedWords}
          setCurrentWord={setCurrentWord}
        />

        {/* Clues */}
        <CluesList
          clues={currentPuzzle.clues}
          highlightedClue={currentWord}
          solvedWords={solvedWords}
        />
      </div>

      {/* ChatBox */}
      {gameId && (
        <div className="mt-4">
          <ChatBox gameId={gameId} playerName="Player 1" />
        </div>
      )}
    </div>
  );
}
