export function NameDisplay({ nameSoFar }) {
  const chars = nameSoFar.split("");

  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
      {chars.map((char, i) => {
        const isLetter = /[a-z]/i.test(char) || char === "_";
        const isRevealed = char !== "_";

        const base =
          "inline-flex h-9 items-center justify-center font-mono text-base font-bold uppercase sm:h-11 sm:text-xl md:h-12 md:text-2xl";
        const widthClass = isLetter ? "w-5 sm:w-7 md:w-9" : "w-2 sm:w-3 md:w-4";
        const stateClass = !isLetter
          ? "text-muted"
          : isRevealed
            ? "border-b-2 border-accent text-fg animate-pop"
            : "border-b-2 border-border-strong text-transparent";

        return (
          <span key={i} className={`${base} ${widthClass} ${stateClass}`}>
            {isRevealed ? char : "_"}
          </span>
        );
      })}
    </div>
  );
}
