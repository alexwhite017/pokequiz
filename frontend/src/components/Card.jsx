import { StatsBar } from "./StatsBar";
import { NavTabs } from "./NavTabs";

export function Card({ state, children }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/40">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
          <h1 className="text-sm font-semibold tracking-tight">Pokémon Quiz</h1>
        </div>
        {(state.status === "playing" || state.status === "submitting") &&
          state.round && (
            <p className="font-mono text-xs text-muted">
              {state.hints.length}/{state.round.maxHints} hints
            </p>
          )}
      </header>

      <StatsBar streak={state.streak} sessionScore={state.sessionScore} />
      <NavTabs />

      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}
