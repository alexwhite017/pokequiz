export function LoadingView() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block size-6 animate-spin-slow rounded-full border-2 border-border-strong border-t-accent" />
      <p className="mt-3 text-sm text-muted">Loading…</p>
    </div>
  );
}
