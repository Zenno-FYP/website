import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface PageTransitionProps {
  /**
   * Forwarded to React Router's `<Outlet context={...} />`. Allows the
   * layout to keep providing `{ theme }` (etc.) to nested routes
   * exactly as before this wrapper was introduced.
   */
  context?: unknown;
  /**
   * Optional override slot. When provided we render `children` instead
   * of `<Outlet />`; useful in places that already render the page
   * element directly (e.g. the AuthPage step transitions).
   */
  children?: ReactNode;
}

/**
 * Wraps a routed page in a fade + small-slide transition.
 *
 * - Uses `AnimatePresence` keyed on the route `pathname` so the
 *   outgoing page can animate out before the new one mounts.
 * - Respects the user's `prefers-reduced-motion` setting; when active
 *   we skip motion entirely and just render the page.
 */
export function PageTransition({ context, children }: PageTransitionProps) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const content = children ?? <Outlet context={context} />;

  if (prefersReducedMotion) {
    return <>{content}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
