/**
 * Tiny class joiner — filters falsy values and joins with spaces.
 * Avoids pulling in clsx + tailwind-merge for this project.
 *
 * @param  {...(string|false|null|undefined)} args
 * @returns {string}
 */
export function cn(...args) {
  return args.flat().filter(Boolean).join(' ');
}
