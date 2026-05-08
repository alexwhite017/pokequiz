export function SpriteFrame({
  spriteUrl,
  silhouette = false,
  animateReveal = false,
}) {
  return (
    <div className="relative mx-auto h-44 w-44">
      <div className="absolute inset-0 rounded-full bg-linear-to-b from-card-elevated via-card-elevated/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={spriteUrl}
          alt={silhouette ? "Mystery Pokémon silhouette" : "Revealed Pokémon"}
          className={[
            "h-36 w-36 [image-rendering:pixelated]",
            silhouette ? "opacity-90 brightness-0" : "",
            animateReveal ? "animate-reveal" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
