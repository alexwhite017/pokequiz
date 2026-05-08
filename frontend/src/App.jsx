import { useReducer } from 'react'
import { quizApi } from './api/quiz'
import { quizReducer, initialState } from './state/quizReducer'
import { TYPE_COLORS } from './utils/typeColors'

const HINT_LABELS = {
  type: 'Type',
  generation: 'Generation',
  stat_total: 'Base Stat Total',
  abilities: 'Abilities',
}

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startRound = async () => {
    dispatch({ type: 'START_REQUESTED' })
    try {
      const data = await quizApi.startRound()
      dispatch({
        type: 'ROUND_STARTED',
        payload: { id: data.round_id, spriteUrl: data.sprite_url, maxHints: data.max_hints },
      })
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message })
    }
  }

  const submitAnswer = async (event) => {
    event.preventDefault()
    if (!state.round || !state.guess.trim()) return
    dispatch({ type: 'ANSWER_SUBMITTED' })
    try {
      const data = await quizApi.submitAnswer(state.round.id, state.guess.trim())
      if (data.continued) {
        dispatch({
          type: 'WRONG_GUESS_CONTINUED',
          payload: { guess: data.guess, hint: data.hint },
        })
      } else {
        dispatch({ type: 'ANSWER_REVEALED', payload: data })
      }
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card
          state={state}
          dispatch={dispatch}
          startRound={startRound}
          submitAnswer={submitAnswer}
        />
      </div>
    </main>
  )
}

function Card({ state, dispatch, startRound, submitAnswer }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/40">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
          <h1 className="text-sm font-semibold tracking-tight">Pokémon Quiz</h1>
        </div>
        {(state.status === 'playing' || state.status === 'submitting') && state.round && (
          <p className="font-mono text-xs text-muted">
            {state.hints.length}/{state.round.maxHints} hints
          </p>
        )}
      </header>

      <div className="p-5 sm:p-7">
        {state.status === 'idle' && <IdleView startRound={startRound} />}
        {state.status === 'loading' && <LoadingView />}
        {(state.status === 'playing' || state.status === 'submitting') && state.round && (
          <PlayingView state={state} dispatch={dispatch} submitAnswer={submitAnswer} />
        )}
        {state.status === 'revealed' && state.result && (
          <RevealedView result={state.result} startRound={startRound} />
        )}
        {state.status === 'error' && (
          <ErrorView error={state.error} dispatch={dispatch} />
        )}
      </div>
    </div>
  )
}

function PokeballIcon({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-accent/15 animate-pulse-glow" />
      <div className="relative size-full overflow-hidden rounded-full border-[3px] border-fg bg-card">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-accent" />
        <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-fg" />
        <div className="absolute top-1/2 left-1/2 size-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-fg bg-card" />
      </div>
    </div>
  )
}

function IdleView({ startRound }) {
  return (
    <div className="animate-fade-up py-6 text-center">
      <div className="mb-6 flex justify-center">
        <PokeballIcon className="size-20" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Ready to play?</h2>
      <p className="mx-auto mb-7 max-w-xs text-sm text-muted">
        Identify the Pokémon. Wrong guesses reveal hints — score depends on how few you need.
      </p>
      <button
        onClick={startRound}
        className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
      >
        Start round
      </button>
    </div>
  )
}

function LoadingView() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block size-6 animate-spin-slow rounded-full border-2 border-border-strong border-t-accent" />
      <p className="mt-3 text-sm text-muted">Loading…</p>
    </div>
  )
}

function PlayingView({ state, dispatch, submitAnswer }) {
  return (
    <div className="space-y-6">
      <SpriteFrame spriteUrl={state.round.spriteUrl} silhouette />
      <HintsList hints={state.hints} />
      <WrongGuesses guesses={state.wrongGuesses} />
      <GuessForm state={state} dispatch={dispatch} onSubmit={submitAnswer} />
    </div>
  )
}

function SpriteFrame({ spriteUrl, silhouette = false, animateReveal = false }) {
  return (
    <div className="relative mx-auto h-44 w-44">
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-card-elevated via-card-elevated/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={spriteUrl}
          alt={silhouette ? 'Mystery Pokémon silhouette' : 'Revealed Pokémon'}
          className={[
            'h-36 w-36 [image-rendering:pixelated]',
            silhouette ? 'opacity-90 brightness-0' : '',
            animateReveal ? 'animate-reveal' : '',
          ].join(' ')}
        />
      </div>
    </div>
  )
}

function HintsList({ hints }) {
  if (hints.length === 0) {
    return (
      <p className="text-center text-xs text-muted">
        No hints yet — make a guess to reveal one.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {hints.map((hint, i) => (
        <HintRow key={i} hint={hint} />
      ))}
    </div>
  )
}

function HintRow({ hint }) {
  const label = HINT_LABELS[hint.kind] ?? hint.kind

  return (
    <div className="flex animate-fade-up items-center justify-between rounded-xl border border-border bg-card-elevated px-4 py-2.5">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <span>
        {hint.kind === 'type' ? (
          <TypeBadges types={hint.value} />
        ) : Array.isArray(hint.value) ? (
          <span className="text-sm font-medium capitalize">{hint.value.join(', ')}</span>
        ) : (
          <span className="font-mono text-sm font-medium capitalize">{hint.value}</span>
        )}
      </span>
    </div>
  )
}

function TypeBadges({ types }) {
  return (
    <div className="flex gap-1.5">
      {types.map((t) => {
        const colors = TYPE_COLORS[t] ?? { bg: '#888', text: '#fff' }
        return (
          <span
            key={t}
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: colors.bg, color: colors.text }}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

function WrongGuesses({ guesses }) {
  if (guesses.length === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
      <span className="text-muted">Tried:</span>
      {guesses.map((g, i) => (
        <span
          key={i}
          className="animate-shake rounded-full border border-incorrect/30 bg-incorrect/10 px-2 py-0.5 capitalize text-incorrect line-through"
        >
          {g}
        </span>
      ))}
    </div>
  )
}

function GuessForm({ state, dispatch, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={state.guess}
        onChange={(e) => dispatch({ type: 'GUESS_CHANGED', payload: e.target.value })}
        placeholder="Your guess…"
        autoFocus
        disabled={state.status === 'submitting'}
        className="flex-1 rounded-full border border-border-strong bg-card-elevated px-4 py-2.5 text-sm transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
      <button
        type="submit"
        disabled={state.status === 'submitting' || !state.guess.trim()}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Guess
      </button>
    </form>
  )
}

function RevealedView({ result, startRound }) {
  return (
    <div className="space-y-5 text-center">
      <SpriteFrame spriteUrl={result.sprite_url} animateReveal />

      <div>
        <p className="mb-1 text-xs uppercase tracking-wider text-muted">It was</p>
        <p className="animate-fade-up text-2xl font-bold capitalize tracking-tight">
          {result.name}
        </p>
      </div>

      <div
        className={`inline-flex animate-pop items-center gap-2 rounded-full px-4 py-1.5 ${
          result.correct
            ? 'bg-correct/15 text-correct'
            : 'bg-incorrect/15 text-incorrect'
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            result.correct ? 'bg-correct' : 'bg-incorrect'
          }`}
        />
        <span className="text-sm font-semibold">
          {result.correct ? `Correct · +${result.score} pts` : 'Better luck next time'}
        </span>
      </div>

      <button
        onClick={startRound}
        className="block w-full rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
      >
        Next Pokémon
      </button>
    </div>
  )
}

function ErrorView({ error, dispatch }) {
  return (
    <div className="py-4 text-center">
      <p className="mb-4 text-sm text-incorrect">Error: {error}</p>
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  )
}

export default App
