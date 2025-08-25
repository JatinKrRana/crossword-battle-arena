// src/components/CluesList.tsx
import React from "react";

interface Clue {
  num: number;
  text: string;
}

interface Clues {
  across: Clue[];
  down: Clue[];
}

interface CluesListProps {
  clues: Clues;
  highlightedClue?: string | null; // e.g., "1-across"
  solvedWords?: string[]; // e.g., ["1-across", "2-down"]
}

export default function CluesList({
  clues,
  highlightedClue = null,
  solvedWords = [],
}: CluesListProps) {
  const renderClues = (list: Clue[], direction: "across" | "down") =>
    list.map((clue) => {
      const id = `${clue.num}-${direction}`;
      const isHighlighted = id === highlightedClue;
      const isSolved = solvedWords.includes(id);

      return (
        <li
          key={id}
          className={`mb-1 p-1 rounded cursor-pointer ${
            isHighlighted ? "bg-yellow-300" : ""
          } ${isSolved ? "line-through text-green-600" : ""}`}
        >
          {clue.num}. {clue.text}
        </li>
      );
    });

  return (
    <div className="p-2">
      <h3 className="font-bold text-lg">Across</h3>
      <ul>{renderClues(clues.across, "across")}</ul>
      <h3 className="font-bold text-lg mt-4">Down</h3>
      <ul>{renderClues(clues.down, "down")}</ul>
    </div>
  );
}
