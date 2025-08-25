// src/lib/gameListeners.ts
import { db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

export interface Player {
  score: number;
}

export interface Players {
  player1: Player;
  ai: Player;
}

export interface GameData {
  puzzleId: number;
  players: Players;
  solvedWords: string[];
  status: string;
  createdAt: any;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: any;
}

/**
 * Listen to games/{gameId} document in real-time.
 * Accepts sync or async callbacks.
 */
export function listenToGame(
  gameId: string,
  callback: (gameData: GameData | null) => void | Promise<void>
) {
  if (!gameId) return () => {};

  const gameRef = doc(db, "games", gameId);
  const unsub = onSnapshot(
    gameRef,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback(snap.data() as GameData);
    },
    (err) => {
      console.error("listenToGame snapshot error:", err);
      callback(null);
    }
  );

  return unsub;
}

/**
 * Listen to latest 20 chat messages (newest at bottom).
 */
export function listenToChat(
  gameId: string,
  callback: (messages: ChatMessage[]) => void
) {
  if (!gameId) return () => {};

  const chatRef = collection(db, "chat_messages", gameId, "messages");
  const q = query(chatRef, orderBy("timestamp", "desc"), limit(25));

  const unsub = onSnapshot(
    q,
    (snap: QuerySnapshot<DocumentData>) => {
      const items: ChatMessage[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ChatMessage, "id">),
      }));

      // Reverse so newest is always at the bottom
      callback(items.reverse());
    },
    (err) => {
      console.error("listenToChat snapshot error:", err);
      callback([]);
    }
  );

  return unsub;
}
