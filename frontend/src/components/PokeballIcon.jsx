export function PokeballIcon({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-accent/15 animate-pulse-glow" />
      <div className="relative size-full overflow-hidden rounded-full border-[3px] border-fg bg-card">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-accent" />
        <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-fg" />
        <div className="absolute top-1/2 left-1/2 size-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-fg bg-card" />
      </div>
    </div>
  );
}
