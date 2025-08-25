import CrosswordGrid from "@/components/CrosswordGrid";
import CluesList from "@/components/CluesList";
import { puzzle1 } from "@/data/puzzles";

export default function GameHome() {
  return (
    <main className="p-8 grid grid-cols-2 gap-2">
      <CrosswordGrid gameId="local" puzzle={puzzle1} />
      <CluesList clues={puzzle1.clues} />
    </main>
  );
}
