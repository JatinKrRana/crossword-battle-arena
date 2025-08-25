"use client";

import React from "react";

interface ScoreboardProps {
  scores: {
    player1: number;
    ai: number;
  };
}

export default function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <div className="flex justify-center space-x-10 bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Player 1</h2>
        <p className="text-2xl text-blue-600">{scores.player1}</p>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold">AI</h2>
        <p className="text-2xl text-red-600">{scores.ai}</p>
      </div>
    </div>
  );
}
