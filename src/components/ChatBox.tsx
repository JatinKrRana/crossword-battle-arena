"use client";

import React, { useEffect, useState } from "react";
import { listenToChat } from "@/lib/gameListeners"; // <-- fixed
import { sendChatMessage } from "@/lib/gameService";

interface ChatBoxProps {
  gameId: string;
  playerName?: string; // default: Player 1
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp?: any;
}

export default function ChatBox({ gameId, playerName = "Player 1" }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!gameId) return;
    const unsub = listenToChat(gameId, setMessages);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [gameId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendChatMessage(gameId, playerName, input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-64 border p-2 rounded shadow-md">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="bg-blue-500 text-white px-4 rounded-r" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
