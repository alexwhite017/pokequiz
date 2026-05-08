const API_URL = import.meta.env.VITE_API_URL ?? "http://pokemon-quiz.test";

async function request(path, options = {}) {
  const hasBody = Boolean(options.body);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(hasBody && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error ?? data?.message ?? `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

export const quizApi = {
  startRound: () => request("/api/quiz/rounds", { method: "POST" }),

  revealHint: (roundId) =>
    request(`/api/quiz/rounds/${roundId}/hints`, { method: "POST" }),

  submitAnswer: (roundId, guess) =>
    request(`/api/quiz/rounds/${roundId}/answer`, {
      method: "POST",
      body: JSON.stringify({ guess }),
    }),
};
