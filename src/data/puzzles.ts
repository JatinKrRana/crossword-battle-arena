// src/data/puzzles.ts
import { CrosswordPuzzle } from "@/types/crossword";

// ---------- PUZZLE 1 ----------
export const puzzle1: CrosswordPuzzle = {
  id: 1,
  grid: [
    // 10x10 grid
    ["", "", "", "", "", null, "", "", "", ""],
    [null, null, "", null, "", null, "", null, null, ""],
    ["", "", "", null, "", null, "", null, null, ""],
    [null, null, null, null, "", "", "", "", null, ""],
    [null, null, null, "", "", "", "", null, null, ""],
    [null, "", null, null, null, "", "", null, null, null],
    ["", "", "", "", null, "", "", "", "", null],
    [null, "", null, null, null, null, null, null, "", null],
    [null, "", null, null, null, null, null, null, "", null],
    [null, "", null, null, null, null, null, null, "", null],
  ],
  clues: {
    across: [
      { num: 1, text: "Capital of France", answer: "PARIS" },
      { num: 2, text: "Round object used in games", answer: "BALL" },
      { num: 3, text: "Feline pet", answer: "CAT" },
      { num: 4, text: "Opposite of cold", answer: "HOT" },
      { num: 5, text: "Color of the clear sky", answer: "BLUE" },
      { num: 6, text: "Earth’s natural satellite", answer: "MOON" },
      { num: 7, text: "King of the Jungle", answer: "LION" },
    ],
    down: [
      { num: 8, text: "Vehicle of the Sea", answer: "SHIP" },
      { num: 9, text: "Night hawk", answer: "OWL" },
      { num: 2, text: "A type of fruit (yellow, curved)", answer: "BANANA" },
      { num: 11, text: "Color opposite of dark", answer: "LIGHT" },
      { num: 12, text: "Color of a Crow", answer: "BLACK" },
      { num: 13, text: "A birds home", answer: "NEST" },
    ],
  },
  answers: {
    "1-across": "PARIS",
    "2-across": "BALL",
    "3-across": "CAT",
    "4-across": "HOT",
    "5-across": "BLUE",
    "6-across": "MOON",
    "7-across": "LION",

    "8-down": "SHIP",
    "9-down": "OWL",
    "2-down": "BANANA",
    "11-down": "LIGHT",
    "12-down": "BLACK",
    "13-down": "NEST",
  },
};


// ---------- PUZZLE 2 ----------
export const puzzle2: CrosswordPuzzle = {
  id: 2,
  grid: [
    ["S", "U", "N", null, null, "M", "O", "O", "N", null],
    [null, "T", null, null, null, "A", null, null, "O", null],
    ["S", "T", "A", "R", null, "R", "A", "I", "N", null],
    [null, "R", null, null, null, "S", null, null, "B", null],
    ["C", "L", "O", "U", "D", null, "S", "N", "O", "W"],
    [null, "O", null, null, null, "T", null, null, "W", null],
    ["W", "I", "N", "D", null, "H", "A", "I", "L", null],
    [null, "R", null, null, null, "E", null, null, "L", null],
    ["S", "K", "Y", null, null, "S", "T", "O", "R", "M"],
    [null, "N", null, null, null, "N", null, null, "N", null],
  ],
  clues: {
    across: [
      { num: 1, text: "Daytime star", answer: "SUN" },
      { num: 5, text: "Earth's satellite", answer: "MOON" },
      { num: 7, text: "Twinkling body in night sky", answer: "STAR" },
      { num: 9, text: "Water droplets falling", answer: "RAIN" },
      { num: 11, text: "White fluffy thing in sky", answer: "CLOUD" },
      { num: 14, text: "Frozen rain", answer: "SNOW" },
      { num: 17, text: "Air in motion", answer: "WIND" },
      { num: 19, text: "Frozen ice pellets", answer: "HAIL" },
      { num: 21, text: "Blue thing above", answer: "SKY" },
      { num: 23, text: "Severe weather", answer: "STORM" },
    ],
    down: [
      { num: 2, text: "Shines at night", answer: "MOON" },
      { num: 4, text: "Opposite of cloudy", answer: "CLEAR" },
      { num: 6, text: "Sky water", answer: "RAIN" },
      { num: 8, text: "Comes after autumn", answer: "WINTER" },
      { num: 10, text: "Fast air movement", answer: "WIND" },
    ],
  },
  answers: {
    "1-across": "SUN",
    "5-across": "MOON",
    "7-across": "STAR",
    "9-across": "RAIN",
    "11-across": "CLOUD",
    "14-across": "SNOW",
    "17-across": "WIND",
    "19-across": "HAIL",
    "21-across": "SKY",
    "23-across": "STORM",
    "2-down": "MOON",
    "4-down": "CLEAR",
    "6-down": "RAIN",
    "8-down": "WINTER",
    "10-down": "WIND",
  },
};

// ---------- EXPORT ----------
export const puzzles: CrosswordPuzzle[] = [puzzle1, puzzle2];
