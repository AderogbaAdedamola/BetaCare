export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse motion-reduce:animate-none rounded-md bg-line/70 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4">
      <SkeletonLine className="h-4 w-2/3 mb-2" />
      <SkeletonLine className="h-3 w-1/3" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}