/**
 * The fade-and-lift every dashboard page enters with.
 *
 * Uses a CSS animation with a visible resting state (see .animate-enter).
 * Content remains readable in hidden tabs and when animations do not run.
 * The wrapper is a server component and requires no browser-side JavaScript.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-enter">{children}</div>;
}
