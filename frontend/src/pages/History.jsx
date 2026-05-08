import { useEffect, useState } from "react";
import { quizApi } from "../api/quiz";

export function History() {
  const [rounds, setRounds] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    quizApi
      .listRounds()
      .then((data) => setRounds(data.rounds))
      .catch((err) => setError(err.message));
  }, []);

  if (error)
    return <p className="py-8 text-center text-incorrect">Error: {error}</p>;
  if (rounds === null)
    return <p className="py-8 text-center text-muted">Loading…</p>;
  if (rounds.length === 0)
    return (
      <p className="py-8 text-center text-muted">
        No rounds yet — go play one!
      </p>
    );

  return (
    <ul className="space-y-2">
      {rounds.map((round) => (
        <RoundRow key={round.id} round={round} />
      ))}
    </ul>
  );
}

function RoundRow({ round }) {
  return (
    <li
      className="flex items-center gap-3 rounded-xl border border-border bg-card-elevated 
  px-3 py-2"
    >
      <img
        src={round.sprite_url}
        alt={round.pokemon_name}
        className="size-10 [image-rendering:pixelated]"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize truncate">
          {round.pokemon_name}
        </p>
        <p className="font-mono text-xs text-muted">
          {round.hints_used} hints used
        </p>
      </div>
      <div
        className={`text-sm font-bold tabular-nums ${
          round.correct ? "text-correct" : "text-incorrect"
        }`}
      >
        {round.correct ? `+${round.score}` : "—"}
      </div>
    </li>
  );
}
