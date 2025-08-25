// src/lib/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generates an AI chat reply based on conversation history.
 * @param gameId Current game ID
 * @param userMessage The player's latest message
 */
export async function sendAiChatMessage(gameId: string, userMessage: string) {
  try {
    // Get last 20 chat messages for context
    const chatRef = collection(db, "chat_messages", gameId, "messages");
    const q = query(chatRef, orderBy("timestamp", "desc"), limit(20));
    const snap = await getDocs(q);
    const history = snap.docs.map((d) => d.data()).reverse();

    const historyText = history
      .map((m: any) => `${m.sender}: ${m.text}`)
      .join("\n");

    const prompt = `
You are a cheeky AI crossword opponent.
Stay in character: witty, competitive, sometimes trash-talk, but fun.
Do not output anything except your message.

Recent chat:
${historyText}

The player just said: "${userMessage}"

Reply as "ai" in 1–2 sentences.
`;

    const result = await model.generateContent(prompt);
    const message = result.response.text();

    await addDoc(collection(db, "chat_messages", gameId, "messages"), {
      sender: "ai",
      text: message,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("AI chat error:", err);
  }
}
