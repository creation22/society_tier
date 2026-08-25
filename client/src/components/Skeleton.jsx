import { cn } from '../utils/cn.js';

export default function Skeleton({ variant = 'rect', className = '' }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 animate-pulse',
        variant === 'card' && 'rounded-2xl',
        className
      )}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(110deg,transparent,transparent_10px,rgba(15,23,42,0.04)_10px,rgba(15,23,42,0.04)_20px)]" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="mb-4 h-3 w-1/3" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
