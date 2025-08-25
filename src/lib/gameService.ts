// src/services/gameService.ts
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  increment,
  DocumentReference,
} from "firebase/firestore";

import { sendAiChatMessage } from "@/lib/aiService";

export type PlayerId = "player1" | "ai";

// ---------- CREATE GAME ----------
export async function createGame(
  gameId: string,
  puzzleId: number
): Promise<DocumentReference> {
  const gameRef = doc(db, "games", gameId);
  await setDoc(gameRef, {
    puzzleId,
    players: {
      player1: { score: 0 },
      ai: { score: 0 },
    },
    solvedWords: [],
    status: "in-progress",
    createdAt: serverTimestamp(),
  });
  return gameRef;
}

// ---------- SOLVE WORD ----------
export async function solveWord(
  gameId: string,
  playerId: PlayerId,
  wordKey: string
) {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    solvedWords: arrayUnion(wordKey),
    [`players.${playerId}.score`]: increment(1),
  });
}

// ---------- SEND CHAT MESSAGE ----------
export async function sendChatMessage(
  gameId: string,
  sender: string,
  text: string
) {
  const chatRef = collection(db, "chat_messages", gameId, "messages");
  await addDoc(chatRef, {
    sender,
    text,
    timestamp: serverTimestamp(),
  });

  // 🎯 Only trigger AI if player sends a message
  if (sender.toLowerCase().includes("player")) {
    await sendAiChatMessage(gameId, text);
  }
}

// ---------- SIMULATE AI MOVE ----------
export async function simulateAiMove(
  gameId: string,
  puzzle: { answers: Record<string, string> },
  solvedWords: string[]
) {
  const allWords = Object.keys(puzzle.answers);
  const unsolved = allWords.filter((w) => !solvedWords.includes(w));
  if (unsolved.length === 0) return;

  const wordToSolve = unsolved[Math.floor(Math.random() * unsolved.length)];
  await solveWord(gameId, "ai", wordToSolve);
}
