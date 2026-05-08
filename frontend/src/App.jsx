import { useReducer } from "react";
import { quizApi } from "./api/quiz";
import { quizReducer, initialState } from "./state/quizReducer";
import { Card } from "./components/Card";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const [selectedGenerations, setSelectedGenerations] = useLocalStorage(
    "pokemon-quiz:generations",
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );

  const startRound = async () => {
    dispatch({ type: "START_REQUESTED" });
    try {
      const data = await quizApi.startRound(selectedGenerations);
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
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card state={state}>
          <Outlet
            context={{
              state,
              dispatch,
              startRound,
              submitAnswer,
              selectedGenerations,
              setSelectedGenerations,
            }}
          />
        </Card>
      </div>
    </main>
  );
}

export default App;
