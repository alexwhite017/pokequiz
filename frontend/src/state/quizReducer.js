export const initialState = {
  status: "idle",
  round: null,
  sessionScore: 0,
  streak: 0,
  nameLength: 0,
  nameSoFar: "",
  hints: [],
  guess: "",
  wrongGuesses: [],
  result: null,
  error: null,
};

export function quizReducer(state, action) {
  switch (action.type) {
    case "START_REQUESTED":
      return {
        ...initialState,
        status: "loading",
        sessionScore: state.sessionScore,
        streak: state.streak,
      };

    case "ROUND_STARTED":
      return {
        ...state,
        status: "playing",
        round: action.payload,
        nameSoFar: action.payload.nameSoFar,
      };
    case "HINT_REVEALED":
      return {
        ...state,
        hints: [...state.hints, action.payload],
      };
    case "GUESS_CHANGED":
      return { ...state, guess: action.payload };

    case "WRONG_GUESS_CONTINUED":
      return {
        ...state,
        status: "playing",
        guess: "",
        hints: [...state.hints, action.payload.hint],
        wrongGuesses: [...state.wrongGuesses, action.payload.guess],
        nameSoFar: action.payload.nameSoFar,
      };
    case "ANSWER_SUBMITTED":
      return { ...state, status: "submitting" };
    case "ANSWER_REVEALED":
      return {
        ...state,
        status: "revealed",
        result: action.payload,
        sessionScore: state.sessionScore + action.payload.score,
        streak: action.payload.correct ? state.streak + 1 : 0,
      };
    case "ERROR":
      return { ...state, status: "error", error: action.payload };

    case "RESET":
      return initialState;

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
