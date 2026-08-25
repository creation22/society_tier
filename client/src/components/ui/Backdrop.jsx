import { cn } from '../../utils/cn.js';

/**
 * Layered premium backdrop: mesh gradients + grid + optional noise + floating orbs.
 * Drop inside a relative parent; use `dark` for inverted sections.
 *
 * @param {boolean} [props.grid=true]    Render the fine grid layer.
 * @param {boolean} [props.noise=true]   Render the film-grain layer.
 * @param {boolean} [props.dark=false]   Use the dark mesh variant.
 * @param {boolean} [props.orbs=true]    Render soft floating orbs.
 */
export default function Backdrop({ grid = true, noise = true, dark = false, orbs = true, className }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className={cn('absolute inset-0', dark ? 'bg-mesh-dark' : 'bg-mesh')} />
      {grid && (
        <div
          className={cn(
            'absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]',
            dark ? 'bg-grid-soft-dark' : 'bg-grid-soft'
          )}
        />
      )}
      {orbs && !dark && (
        <>
          <div className="animate-bob absolute -right-24 top-10 h-72 w-72 rounded-full bg-ink/5 blur-3xl" />
          <div className="animate-bob absolute -left-24 top-40 h-64 w-64 rounded-full bg-ink/[0.04] blur-3xl [animation-delay:1.5s]" />
        </>
      )}
      {noise && <div className="bg-noise absolute inset-0" />}
    </div>
  );
}
