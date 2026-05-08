export function WrongGuesses({ guesses }) {
  if (guesses.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
      <span className="text-muted">Tried:</span>
      {guesses.map((g, i) => (
        <span
          key={i}
          className="animate-shake rounded-full border border-incorrect/30 bg-incorrect/10 px-2 py-0.5 capitalize text-incorrect line-through"
        >
          {g}
        </span>
      ))}
    </div>
  );
}
