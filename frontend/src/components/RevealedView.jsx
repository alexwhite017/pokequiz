import { SpriteFrame } from "./SpriteFrame";

export function RevealedView({ result, startRound }) {
  return (
    <div className="space-y-5 text-center">
      <SpriteFrame spriteUrl={result.sprite_url} animateReveal />

      <div>
        <p className="mb-1 text-xs uppercase tracking-wider text-muted">
          It was
        </p>
        <p className="animate-fade-up text-2xl font-bold capitalize tracking-tight">
          {result.name}
        </p>
      </div>

      <div
        className={`inline-flex animate-pop items-center gap-2 rounded-full px-4 py-1.5 ${
          result.correct
            ? "bg-correct/15 text-correct"
            : "bg-incorrect/15 text-incorrect"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            result.correct ? "bg-correct" : "bg-incorrect"
          }`}
        />
        <span className="text-sm font-semibold">
          {result.correct
            ? `Correct · +${result.score} pts`
            : "Better luck next time"}
        </span>
      </div>

      <button
        onClick={startRound}
        className="block w-full rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
      >
        Next Pokémon
      </button>
    </div>
  );
}
