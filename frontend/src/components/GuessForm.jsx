export function GuessForm({ state, dispatch, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={state.guess}
        onChange={(e) =>
          dispatch({ type: "GUESS_CHANGED", payload: e.target.value })
        }
        placeholder="Your guess…"
        autoFocus
        disabled={state.status === "submitting"}
        className="flex-1 rounded-full border border-border-strong bg-card-elevated px-4 py-2.5 text-sm transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
      <button
        type="submit"
        disabled={state.status === "submitting" || !state.guess.trim()}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Guess
      </button>
    </form>
  );
}
