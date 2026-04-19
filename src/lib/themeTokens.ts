/**
 * Centralized theme tokens.
 *
 * The Zenno web app uses a `theme: 'light' | 'dark'` prop pattern across most
 * components instead of CSS variables. The same dark/light class strings were
 * previously repeated in dozens of places (cards, glass surfaces, text colors,
 * buttons, etc.). This module pulls those strings into a single place so:
 *   - Visual changes only need to happen once.
 *   - Components stay readable.
 *   - Light/dark drift is impossible (each token has both variants).
 *
 * Usage:
 *   const t = themeTokens(theme);
 *   <div className={t.surface.glass} />
 *   <p className={t.text.primary}>Hello</p>
 *
 * Or pull a single token:
 *   <div className={cardSurface(theme)} />
 */

export type Theme = "light" | "dark";

export interface ThemeTokens {
  surface: {
    /** Page background (full screen). */
    page: string;
    /** Frosted glass card / panel surface. */
    glass: string;
    /** Dropdown / popover surface. */
    dropdown: string;
    /** Inset / quiet surface (e.g. list item background). */
    muted: string;
  };
  border: {
    base: string;
    strong: string;
    subtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  button: {
    /** Default ghost / icon button. */
    ghost: string;
    /** Primary brand button. */
    primary: string;
    /** Destructive (logout, delete) button. */
    danger: string;
  };
  hover: {
    surface: string;
    listItem: string;
  };
  focus: {
    /** Visible focus ring for keyboard accessibility. */
    ring: string;
  };
}

const DARK: ThemeTokens = {
  surface: {
    page: "bg-[#0a0a0f]",
    glass: "bg-white/5 border-white/10 backdrop-blur-xl",
    dropdown: "bg-[#121218]/95 border-white/10 backdrop-blur-2xl",
    muted: "bg-white/[0.02]",
  },
  border: {
    base: "border-white/10",
    strong: "border-white/20",
    subtle: "border-white/5",
  },
  text: {
    primary: "text-white",
    secondary: "text-gray-300",
    muted: "text-gray-400",
    accent: "text-purple-400",
  },
  button: {
    ghost: "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200",
    primary:
      "bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-90",
    danger: "text-red-400 hover:bg-red-500/10",
  },
  hover: {
    surface: "hover:bg-white/10",
    listItem: "hover:bg-white/5 focus:bg-white/5",
  },
  focus: {
    ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]",
  },
};

const LIGHT: ThemeTokens = {
  surface: {
    page: "bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]",
    glass: "bg-white/40 border-white/30 backdrop-blur-xl",
    dropdown: "bg-white/95 border-gray-200 backdrop-blur-2xl",
    muted: "bg-white/40",
  },
  border: {
    base: "border-gray-200",
    strong: "border-gray-300",
    subtle: "border-gray-200/50",
  },
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    muted: "text-gray-500",
    accent: "text-[#5B6FD8]",
  },
  button: {
    ghost:
      "bg-white/40 hover:bg-white/60 border border-white/30 text-gray-700",
    primary:
      "bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-90",
    danger: "text-red-600 hover:bg-red-50",
  },
  hover: {
    surface: "hover:bg-gray-100",
    listItem: "hover:bg-gray-100/80 focus:bg-gray-100/80",
  },
  focus: {
    ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6FD8] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  },
};

export function themeTokens(theme: Theme): ThemeTokens {
  return theme === "dark" ? DARK : LIGHT;
}

/** Convenience helpers for the most common single-token lookups. */
export const cardSurface = (theme: Theme): string => themeTokens(theme).surface.glass;
export const textPrimary = (theme: Theme): string => themeTokens(theme).text.primary;
export const textMuted = (theme: Theme): string => themeTokens(theme).text.muted;
export const ghostButton = (theme: Theme): string => themeTokens(theme).button.ghost;
export const focusRing = (theme: Theme): string => themeTokens(theme).focus.ring;
