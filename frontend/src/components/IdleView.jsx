import { PokeballIcon } from "./PokeballIcon";
import { useOutletContext } from "react-router-dom";
import { GenerationPicker } from "./GenerationPicker";

export function IdleView({ startRound }) {
  const { selectedGenerations, setSelectedGenerations } = useOutletContext();
  const canStart = selectedGenerations.length > 0;
  return (
    <div className="animate-fade-up py-6 text-center">
      <div className="mb-6 flex justify-center">
        <PokeballIcon className="size-20" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Ready to play?</h2>
      <p className="mx-auto mb-7 max-w-xs text-sm text-muted">
        Identify the Pokémon. Wrong guesses reveal hints — score depends on how
        few you need.
      </p>
      <div className="mb-6">
        <GenerationPicker
          selected={selectedGenerations}
          onChange={setSelectedGenerations}
        />
      </div>
      <button
        onClick={startRound}
        disabled={!canStart}
        className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-white          
  transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start round
      </button>
    </div>
  );
}
