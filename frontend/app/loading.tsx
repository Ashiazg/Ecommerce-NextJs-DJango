export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-border" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <div className="aspect-square bg-border" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 rounded bg-border" />
              <div className="h-5 w-3/4 rounded bg-border" />
              <div className="h-4 w-full rounded bg-border" />
              <div className="h-8 w-24 rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
