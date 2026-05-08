import { useReducer } from "react";
import { quizApi } from "./api/quiz";
import { quizReducer, initialState } from "./state/quizReducer";

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startRound = async () => {
    dispatch({ type: "START_REQUESTED" });
    try {
      const data = await quizApi.startRound();
      dispatch({
        type: "ROUND_STARTED",
        payload: {
          id: data.round_id,
          spriteUrl: data.sprite_url,
          maxHints: data.max_hints,
        },
      });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!state.round || !state.guess.trim()) return;
    dispatch({ type: "ANSWER_SUBMITTED" });
    try {
      const data = await quizApi.submitAnswer(
        state.round.id,
        state.guess.trim(),
      );
      if (data.continued) {
        dispatch({
          type: "WRONG_GUESS_CONTINUED",
          payload: { guess: data.guess, hint: data.hint },
        });
      } else {
        dispatch({ type: "ANSWER_REVEALED", payload: data });
      }
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold text-accent">
        Who's That Pokémon?
      </h1>

      {state.status === "idle" && (
        <div className="text-center">
          <button
            onClick={startRound}
            className="rounded-lg bg-accent px-8 py-3 font-semibold text-bg transition 
  hover:bg-accent-strong"
          >
            Start round
          </button>
        </div>
      )}

      {state.status === "loading" && (
        <p className="text-center text-zinc-400">Loading…</p>
      )}

      {(state.status === "playing" || state.status === "submitting") &&
        state.round && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img
                src={state.round.spriteUrl}
                alt="Mystery Pokémon silhouette"
                className="h-48 w-48 brightness-0 [image-rendering:pixelated]"
              />
            </div>

            {state.hints.length > 0 && (
              <ul className="space-y-2">
                {state.hints.map((hint, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-zinc-700 bg-surface px-4 py-2 animate-slide-in"
                  >
                    <span className="font-semibold capitalize text-accent">
                      {hint.kind.replace("_", " ")}:
                    </span>{" "}
                    <span className="capitalize">
                      {Array.isArray(hint.value)
                        ? hint.value.join(", ")
                        : hint.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {state.wrongGuesses.length > 0 && (
              <div className="text-center text-sm text-zinc-400">
                Tried:{" "}
                {state.wrongGuesses.map((g, i) => (
                  <span
                    key={i}
                    className="mx-1 inline-block rounded bg-incorrect/20 px-2 py-0.5 capitalize        
  text-incorrect line-through animate-shake"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <form onSubmit={submitAnswer} className="flex gap-2">
              <input
                type="text"
                value={state.guess}
                onChange={(e) =>
                  dispatch({ type: "GUESS_CHANGED", payload: e.target.value })
                }
                placeholder="Type your guess…"
                autoFocus
                disabled={state.status === "submitting"}
                className="flex-1 rounded-lg border border-zinc-700 bg-surface px-4 py-2       
  focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={state.status === "submitting" || !state.guess.trim()}
                className="rounded-lg bg-accent px-6 py-2 font-semibold text-bg transition     
                hover:bg-accent-strong disabled:opacity-50"
              >
                Guess
              </button>
            </form>
          </div>
        )}

      {state.status === "revealed" && state.result && (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <img
              src={state.result.sprite_url}
              alt={state.result.name}
              className="h-48 w-48 [image-rendering:pixelated] animate-reveal"
            />
          </div>
          <p className="text-2xl font-bold capitalize">{state.result.name}</p>
          <p
            className={`text-3xl font-bold animate-pop ${
              state.result.correct ? "text-correct" : "text-incorrect"
            }`}
          >
            {state.result.correct
              ? `Correct! +${state.result.score}`
              : "Wrong!"}
          </p>
          <button
            onClick={startRound}
            className="rounded-lg bg-accent px-8 py-3 font-semibold text-bg transition 
  hover:bg-accent-strong"
          >
            Next Pokémon
          </button>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-4 text-center">
          <p className="text-incorrect">Error: {state.error}</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-bg"
          >
            Try again
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
