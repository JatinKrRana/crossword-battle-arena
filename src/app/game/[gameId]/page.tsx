"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CrosswordGrid from "@/components/CrosswordGrid";
import CluesList from "@/components/CluesList";
import { listenToGame, listenToChat, type GameData, type ChatMessage } from "@/lib/gameListeners";
import { sendChatMessage } from "@/lib/gameService";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { puzzles } from "@/data/puzzles";
import type { CrosswordPuzzle } from "@/types/crossword";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();

  const [game, setGame] = useState<GameData | null>(null);
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (!gameId) return;

    const unsub = listenToGame(gameId, async (data) => {
      if (!data) {
        setGame(null);
        setLoading(false);
        return;
      }

      setGame(data);
      if (Array.isArray(data.solvedWords)) setSolvedWords(data.solvedWords);

      if (data.puzzleId) {
        try {
          const puzzleRef = doc(db, "puzzles", data.puzzleId.toString());
          const snap = await getDoc(puzzleRef);
          if (snap.exists()) {
            setPuzzle(snap.data() as CrosswordPuzzle);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error fetching puzzle doc:", e);
        }
      }

      setPuzzle(puzzles[0]);
      setLoading(false);
    });

    return () => unsub?.();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const unsub = listenToChat(gameId, (msgs) => setChatMessages(msgs));
    return () => unsub?.();
  }, [gameId]);

  const handleSendMessage = async () => {
    if (!gameId || !chatInput.trim()) return;
    await sendChatMessage(gameId, "player1", chatInput.trim()); // 👈 triggers AI reply inside gameService
    setChatInput("");
  };

  if (loading) return <div className="p-4">Loading game...</div>;
  if (!game) return <div className="p-4">Game not found</div>;
  if (!puzzle) return <div className="p-4">Puzzle not available</div>;

  return (
    <div className="flex p-4 gap-6">
      {/* LEFT: Grid + Scoreboard */}
      <div className="flex-1 space-y-4">
        <CrosswordGrid
          gameId={gameId}
          puzzle={puzzle}
          solvedWords={solvedWords}
          setSolvedWords={setSolvedWords}
        />
      </div>

      {/* MIDDLE: Clues */}
      <div className="w-1/3">
        <h2 className="font-semibold mb-2">Clues</h2>
        <CluesList
          clues={puzzle.clues}
          highlightedClue={null}
          solvedWords={solvedWords}
        />
      </div>

      {/* RIGHT: Chat */}
      <div className="w-1/3 flex flex-col">
        <h2 className="font-semibold mb-2">Chat</h2>

        {/* Chat messages area */}
        <div className="flex-1 space-y-1 text-sm overflow-y-auto border p-2 rounded mb-2 h-[400px]">
          {chatMessages.length > 0 ? (
            chatMessages.map((m) => (
              <div key={m.id}>
                <b>{m.sender}:</b> {m.text}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No messages yet...</p>
          )}
        </div>

        {/* Input */}
        <div className="flex">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border px-2 py-1 rounded-l text-black"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
