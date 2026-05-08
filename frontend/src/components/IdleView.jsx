import { PokeballIcon } from "./PokeballIcon";

export function IdleView({ startRound }) {
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
      <button
        onClick={startRound}
        className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
      >
        Start round
      </button>
    </div>
  );
}
