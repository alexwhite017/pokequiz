import { StatsBar } from "./StatsBar";
import { NavTabs } from "./NavTabs";

export function Card({ state, onTitleClick, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 sm:rounded-3xl">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={onTitleClick}
          className="flex items-center gap-2.5 rounded transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
          <h1 className="text-sm font-semibold tracking-tight">Pokémon Quiz</h1>
        </button>
        {(state.status === "playing" || state.status === "submitting") &&
          state.round && (
            <p className="font-mono text-xs text-muted">
              {state.hints.length}/{state.round.maxHints} hints
            </p>
          )}
      </header>

      <StatsBar streak={state.streak} sessionScore={state.sessionScore} />
      <NavTabs />

      <div className="p-4 sm:p-7">{children}</div>
    </div>
  );
}
