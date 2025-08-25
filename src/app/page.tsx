"use client";

import { v4 as uuidv4 } from "uuid";
import { createGame } from "@/lib/gameService";
import { puzzles } from "@/data/puzzles";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleStart = async () => {
    const newGameId = uuidv4();
    await createGame(newGameId, puzzles[0].id);
    router.push(`/game/${newGameId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Crossword Battle Arena</h1>
      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Start New Game
      </button>
    </main>
  );
}
