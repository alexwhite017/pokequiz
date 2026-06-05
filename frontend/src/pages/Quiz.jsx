import { useOutletContext } from "react-router-dom";
import { IdleView } from "../components/IdleView";
import { LoadingView } from "../components/LoadingView";
import { PlayingView } from "../components/PlayingView";
import { RevealedView } from "../components/RevealedView";
import { ErrorView } from "../components/ErrorView";

export function Quiz() {
  const { state, dispatch, startRound, submitAnswer, pokemonNames } = useOutletContext();

  return (
    <>
      {state.status === "idle" && <IdleView startRound={startRound} />}
      {state.status === "loading" && <LoadingView />}
      {(state.status === "playing" || state.status === "submitting") &&
        state.round && (
          <PlayingView
            state={state}
            dispatch={dispatch}
            submitAnswer={submitAnswer}
            pokemonNames={pokemonNames}
          />
        )}
      {state.status === "revealed" && state.result && (
        <RevealedView result={state.result} startRound={startRound} />
      )}
      {state.status === "error" && (
        <ErrorView error={state.error} dispatch={dispatch} />
      )}
    </>
  );
}
