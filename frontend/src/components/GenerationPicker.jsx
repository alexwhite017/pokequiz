const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function GenerationPicker({ selected, onChange }) {
  function toggle(gen) {
    if (selected.includes(gen)) {
      onChange(selected.filter((g) => g !== gen));
    } else {
      onChange([...selected, gen].sort());
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted">Generations</p>
      <div className="grid grid-cols-3 gap-2">
        {ALL_GENS.map((gen) => {
          const isSelected = selected.includes(gen);
          return (
            <button
              key={gen}
              type="button"
              onClick={() => toggle(gen)}
              className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-card-elevated text-muted hover:text-fg"
              }`}
            >
              Gen {gen}
            </button>
          );
        })}
      </div>
    </div>
  );
}
