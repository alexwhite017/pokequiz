import { useState } from "react";

export function GuessForm({ state, dispatch, onSubmit, pokemonNames = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const query = state.guess.trim().toLowerCase();
  const matches = query
    ? pokemonNames.filter((n) => n.toLowerCase().startsWith(query)).slice(0, 8)
    : [];
  const showDropdown = isOpen && matches.length > 0;

  const choose = (name) => {
    dispatch({ type: "GUESS_CHANGED", payload: name });
    setIsOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault(); // pick the suggestion instead of submitting
      choose(matches[highlighted]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlighted(-1);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={state.guess}
          onChange={(e) => {
            dispatch({ type: "GUESS_CHANGED", payload: e.target.value });
            setIsOpen(true);
            setHighlighted(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder="Your guess…"
          autoFocus
          autoComplete="off"
          disabled={state.status === "submitting"}
          className="w-full rounded-full border border-border-strong bg-card-elevated px-4
  py-2.5 text-sm transition placeholder:text-muted/60 focus:border-accent focus:outline-none
  focus:ring-2 focus:ring-accent/20"
        />
        {showDropdown && (
          <ul
            className="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-2xl border
  border-border-strong bg-card-elevated py-1 shadow-lg"
          >
            {matches.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep input focused; fire before blur
                    choose(name);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm capitalize transition ${
                    i === highlighted
                      ? "bg-accent text-white"
                      : "hover:bg-white/5"
                  }`}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        disabled={state.status === "submitting" || !state.guess.trim()}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white 
  transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Guess
      </button>
    </form>
  );
}
