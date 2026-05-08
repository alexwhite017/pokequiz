import { useReducer } from "react";
import { quizApi } from "./api/quiz";
import { quizReducer, initialState } from "./state/quizReducer";
import { Card } from "./components/Card";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const [selectedGenerations, setSelectedGenerations] = useLocalStorage(
    "pokemon-quiz:generations",
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );

  const navigate = useNavigate();

  const goHome = () => {
    dispatch({ type: "RESET" });
    navigate("/");
  };

  const startRound = async () => {
    dispatch({ type: "START_REQUESTED" });
    try {
      const data = await quizApi.startRound(selectedGenerations);
      dispatch({
        type: "ROUND_STARTED",
        payload: {
          id: data.round_id,
          maxHints: data.max_hints,
          nameSoFar: data.name_so_far,
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
          payload: {
            guess: data.guess,
            hint: data.hint,
            nameSoFar: data.name_so_far,
          },
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
      <div className="w-full max-w-xl">
        <Card state={state} onTitleClick={goHome}>
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
