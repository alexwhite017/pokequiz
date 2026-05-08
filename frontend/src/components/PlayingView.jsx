import { SpriteFrame } from "./SpriteFrame";
import { HintsList } from "./HintsList";
import { WrongGuesses } from "./WrongGuesses";
import { GuessForm } from "./GuessForm";

export function PlayingView({ state, dispatch, submitAnswer }) {
  return (
    <div className="space-y-6">
      <SpriteFrame spriteUrl={state.round.spriteUrl} silhouette />
      <HintsList hints={state.hints} />
      <WrongGuesses guesses={state.wrongGuesses} />
      <GuessForm state={state} dispatch={dispatch} onSubmit={submitAnswer} />
    </div>
  );
}
