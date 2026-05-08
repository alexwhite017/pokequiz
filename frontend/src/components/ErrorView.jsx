export function ErrorView({ error, dispatch }) {
  return (
    <div className="py-4 text-center">
      <p className="mb-4 text-sm text-incorrect">Error: {error}</p>
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
