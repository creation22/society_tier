export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse border-3 border-ink bg-ink/10 ${className}`}>
      <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(0,0,0,0.06)_8px,rgba(0,0,0,0.06)_16px)]" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border-3 border-ink bg-paper p-4 shadow-brutal">
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="mb-4 h-3 w-1/3" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
