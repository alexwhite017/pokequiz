import { NameDisplay } from "./NameDisplay";
import { HintsList } from "./HintsList";
import { WrongGuesses } from "./WrongGuesses";
import { GuessForm } from "./GuessForm";

export function PlayingView({ state, dispatch, submitAnswer, pokemonNames }) {
  return (
    <div className="space-y-6">
      <NameDisplay nameSoFar={state.nameSoFar} />
      <HintsList hints={state.hints} />
      <WrongGuesses guesses={state.wrongGuesses} />
      <GuessForm state={state} dispatch={dispatch} onSubmit={submitAnswer} pokemonNames={pokemonNames} />
    </div>
  );
}
