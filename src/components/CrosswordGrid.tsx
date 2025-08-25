// src/components/CrosswordGrid.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { listenToGame } from "@/lib/gameListeners";
import { solveWord } from "@/lib/gameService";

type Direction = "across" | "down";

interface Props {
  gameId: string;
  puzzle: {
    id: number;
    grid: (string | null)[][];
    answers: Record<string, string>;
  };
  solvedWords?: string[];
  setSolvedWords?: Dispatch<SetStateAction<string[]>>;
  setCurrentWord?: (wordId: string | null) => void;
}

type Coord = { r: number; c: number };

type WordEntry = {
  id: string; // "1-across"
  number: number;
  direction: Direction;
  cells: Coord[];
  answer: string;
};

export default function CrosswordGrid({
  gameId,
  puzzle,
  solvedWords: solvedWordsProp,
  setSolvedWords: setSolvedWordsProp,
  setCurrentWord: setParentCurrentWord,
}: Props) {
  // ---------------- Board state ----------------
  const [board, setBoard] = useState<string[][]>(() =>
    puzzle.grid.map((row) => row.map((cell) => (cell ?? "")))
  );

  const [selected, setSelected] = useState<Coord | null>(null);
  const [dir, setDir] = useState<Direction>("across");

  // ---------------- Solved words ----------------
  const [solvedWordsLocal, setSolvedWordsLocal] = useState<string[]>([]);
  const solvedWords = solvedWordsProp ?? solvedWordsLocal;
  const setSolvedWords = setSolvedWordsProp ?? setSolvedWordsLocal;

  const [currentWord, setCurrentWordLocal] = useState<string | null>(null);

  // ---------------- Firestore game state ----------------
  const [game, setGame] = useState<any>(null);

  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  const inBounds = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;
  const isBlocked = (r: number, c: number) => puzzle.grid[r][c] === null;

  // ---------------- Word map / numbering ----------------
  const { wordMap, smallNumberAt } = useMemo(() => {
    const N = rows;
    const M = cols;

    const localWordMap: Record<string, WordEntry> = {};
    const smallNums: Record<string, number> = {};
    let nextNum = 1;

    const addWord = (r0: number, c0: number, direction: Direction) => {
      const tentativeId = `${nextNum}-${direction}`;
      const cells: Coord[] = [];
      let r = r0,
        c = c0;
      while (r < N && c < M && !isBlocked(r, c)) {
        cells.push({ r, c });
        if (direction === "across") c++;
        else r++;
      }

      const answer = puzzle.answers[tentativeId];
      if (answer) {
        localWordMap[tentativeId] = { id: tentativeId, number: nextNum, direction, cells, answer };
        smallNums[`${r0}-${c0}`] = nextNum;
        nextNum++;
      }
    };

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < M; c++) {
        if (isBlocked(r, c)) continue;
        const startAcross = (c === 0 || isBlocked(r, c - 1)) && c + 1 < M && !isBlocked(r, c + 1);
        if (startAcross) addWord(r, c, "across");

        const startDown = (r === 0 || isBlocked(r - 1, c)) && r + 1 < N && !isBlocked(r + 1, c);
        if (startDown) addWord(r, c, "down");
      }
    }

    return { wordMap: localWordMap, smallNumberAt: smallNums };
  }, [puzzle.id, puzzle.grid, puzzle.answers]);

  // ---------------- Listen to game (scores + solvedWords) ----------------
  useEffect(() => {
    if (!gameId) return;

    const unsub = listenToGame(gameId, (data) => {
      if (!data) return;
      setGame(data);
      if (Array.isArray(data.solvedWords)) setSolvedWords(data.solvedWords);
    });

    return () => unsub?.();
  }, [gameId, setSolvedWords]);

  // ---------------- Sync local solvedWords if parent passes them ----------------
  useEffect(() => {
    if (Array.isArray(solvedWordsProp)) setSolvedWordsLocal(solvedWordsProp);
  }, [solvedWordsProp]);

  // ---------------- Selection -> current word sync ----------------
  useEffect(() => {
    if (!selected) {
      setCurrentWordLocal(null);
      setParentCurrentWord?.(null);
      return;
    }
    const wid = getWordIdAtCell(selected.r, selected.c, dir);
    setCurrentWordLocal(wid);
    setParentCurrentWord?.(wid);
  }, [selected, dir, wordMap, setParentCurrentWord]);

  // ---------------- Utilities ----------------
  const setLetter = (r: number, c: number, ch: string) =>
    setBoard((prev) => {
      const copy = prev.map((row) => row.slice());
      copy[r][c] = ch;
      return copy;
    });

  const move = (r: number, c: number, d: Direction, backwards = false): Coord => {
    if (d === "across") {
      let nc = c + (backwards ? -1 : 1);
      while (inBounds(r, nc) && isBlocked(r, nc)) nc += backwards ? -1 : 1;
      if (inBounds(r, nc)) return { r, c: nc };
    } else {
      let nr = r + (backwards ? -1 : 1);
      while (inBounds(nr, c) && isBlocked(nr, c)) nr += backwards ? -1 : 1;
      if (inBounds(nr, c)) return { r: nr, c };
    }
    return { r, c };
  };

  const getWordIdAtCell = (r: number, c: number, d: Direction): string | null =>
    Object.values(wordMap).find((entry) => entry.direction === d && entry.cells.some((p) => p.r === r && p.c === c))?.id ?? null;

  const getWordStatus = (wordId: string): "correct" | "wrong" | "incomplete" => {
    const entry = wordMap[wordId];
    if (!entry) return "incomplete";
    const letters = entry.cells.map(({ r, c }) => board[r][c] || "");
    if (letters.some((l) => l === "")) return "incomplete";
    return letters.join("") === entry.answer ? "correct" : "wrong";
  };

  // ---------------- Keyboard handling ----------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      const { r, c } = selected;

      // toggle direction
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setDir((d) => (d === "across" ? "down" : "across"));
        return;
      }

      // navigation
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const newPos =
          e.key === "ArrowLeft"
            ? move(r, c, "across", true)
            : e.key === "ArrowRight"
            ? move(r, c, "across", false)
            : e.key === "ArrowUp"
            ? move(r, c, "down", true)
            : move(r, c, "down", false);
        setSelected(newPos);
        return;
      }

      // delete
      if (e.key === "Backspace") {
        e.preventDefault();
        if (!isBlocked(r, c)) setLetter(r, c, "");
        setSelected(move(r, c, dir, true));
        return;
      }

      // letter input
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();
        if (!isBlocked(r, c)) {
          setLetter(r, c, e.key.toUpperCase());
          setSelected(move(r, c, dir, false));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, dir, board]);

  // ---------------- When a word is correct ----------------
  useEffect(() => {
    if (!currentWord) return;
    const status = getWordStatus(currentWord);
    if (status === "correct" && !solvedWords.includes(currentWord)) {
      setSolvedWords((prev) => (prev.includes(currentWord) ? prev : [...prev, currentWord]));

      if (gameId) solveWord(gameId, "player1", currentWord).catch(console.error);
    }
  }, [board, currentWord, solvedWords, setSolvedWords, gameId]);

  const cellStatus = (r: number, c: number): "correct" | "wrong" | "incomplete" | null => {
    const acrossId = getWordIdAtCell(r, c, "across");
    const downId = getWordIdAtCell(r, c, "down");
    const statuses: Array<"correct" | "wrong" | "incomplete"> = [];
    if (acrossId) statuses.push(getWordStatus(acrossId));
    if (downId) statuses.push(getWordStatus(downId));
    if (statuses.includes("wrong")) return "wrong";
    if (statuses.includes("correct")) return "correct";
    return statuses.length ? "incomplete" : null;
  };

  // ---------------- Render ----------------
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* SCOREBOARD */}
      {game && (
        <div className="flex justify-center space-x-10 bg-black-100 p-4 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-lg font-bold">🧑Player 1</h2>
            <p className="text-2xl text-blue-600">{game.players?.player1?.score ?? 0}</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">🤖AI</h2>
            <p className="text-2xl text-red-600">{game.players?.ai?.score ?? 0}</p>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="inline-grid border border-black" style={{ gridTemplateColumns: `repeat(${cols}, 3rem)` }}>
        {board.map((row, ri) =>
          row.map((cell, ci) => {
            const blocked = isBlocked(ri, ci);
            const isSel = selected?.r === ri && selected?.c === ci;
            const status = blocked ? null : cellStatus(ri, ci);

            const bgClass = blocked
              ? "bg-black text-transparent"
              : status === "correct"
              ? "bg-green-200 text-green-700"
              : status === "wrong"
              ? "bg-red-200 text-red-700"
              : "bg-white text-black";

            return (
              <div
                key={`${ri}-${ci}`}
                onClick={() => !blocked && setSelected({ r: ri, c: ci })}
                className={`w-12 h-12 border border-black flex items-center justify-center text-lg font-bold cursor-pointer relative ${bgClass} ${
                  isSel ? "ring-2 ring-blue-400" : ""
                }`}
              >
                {!blocked && smallNumberAt[`${ri}-${ci}`] && (
                  <span className="absolute top-0 left-0 text-[10px] p-[1px] text-gray-600">
                    {smallNumberAt[`${ri}-${ci}`]}
                  </span>
                )}
                {!blocked ? cell : ""}
              </div>
            );
          })
        )}
      </div>

      {/* footer */}
      <div className="mt-2 text-sm text-gray-600">
        {selected ? (
          <span>
            Cell: ({selected.r + 1},{selected.c + 1}) • Direction: <b className="uppercase">{dir}</b>{" "}
            (Space/Enter to toggle)
          </span>
        ) : (
          <span>Click a cell to start • Arrows to move • Backspace to erase</span>
        )}
      </div>
    </div>
  );
}
