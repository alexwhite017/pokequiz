import { TYPE_COLORS } from "../utils/typeColors";

const HINT_LABELS = {
  stat_total: "Base Stat Total",
  type: "Type",
  generation: "Generation",
  image: "Silhouette",
};

export function HintsList({ hints }) {
  if (hints.length === 0) {
    return (
      <p className="text-center text-xs text-muted">
        No hints yet — make a guess to reveal one.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {hints.map((hint, i) => (
        <HintRow key={i} hint={hint} />
      ))}
    </div>
  );
}

function HintRow({ hint }) {
  const label = HINT_LABELS[hint.kind] ?? hint.kind;

  return (
    <div className="flex animate-fade-up items-center justify-between rounded-xl border border-border bg-card-elevated px-4 py-2.5">
      <span className="text-xs uppercase tracking-wider text-muted">
        {label}
      </span>
      <span>
        {hint.kind === "image" ? (
          <img
            src={hint.value}
            alt="Pokémon silhouette"
            className="h-16 w-16 brightness-0 [image-rendering:pixelated]"
          />
        ) : hint.kind === "type" ? (
          <TypeBadges types={hint.value} />
        ) : Array.isArray(hint.value) ? (
          <span className="text-sm font-medium capitalize">
            {hint.value.join(", ")}
          </span>
        ) : (
          <span className="font-mono text-sm font-medium capitalize">
            {hint.value}
          </span>
        )}
      </span>
    </div>
  );
}

function TypeBadges({ types }) {
  return (
    <div className="flex gap-1.5">
      {types.map((t) => {
        const colors = TYPE_COLORS[t] ?? { bg: "#888", text: "#fff" };
        return (
          <span
            key={t}
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: colors.bg, color: colors.text }}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}
