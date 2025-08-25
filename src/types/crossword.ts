export interface Clue {
  num: number;
  text: string;
  answer?: string;
}

export interface CrosswordPuzzle {
  id: number;
  grid: (string | null)[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
  answers: Record<string, string>; // key like "1-across"
}

export interface Player {
  score: number;
}

export interface GameData {
  puzzleId: number;
  players: {
    player1: Player;
    ai: Player;
  };
  solvedWords: string[];
  status: string;
  createdAt?: any;
}
