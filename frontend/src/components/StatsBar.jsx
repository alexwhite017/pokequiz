export function StatsBar({ streak, sessionScore }) {
  if (streak === 0 && sessionScore === 0) return null;
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-3">
      <p className="text-sm text-muted">
        Streak: <span className="font-mono">{streak}</span>
      </p>
      <p className="text-sm text-muted">
        Score: <span className="font-mono">{sessionScore}</span>
      </p>
    </div>
  );
}
