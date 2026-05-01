import { useEffect, useState } from "react";

export type SiteTheme = "light" | "dark";

export function readSiteTheme(): SiteTheme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

/**
 * Tracks the same theme as the main app (`localStorage.theme`).
 * Stays in sync when the user toggles theme — App dispatches `zenno-theme`.
 */
export function useSiteTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>(readSiteTheme);

  useEffect(() => {
    const onTheme = (e: Event) => {
      const ce = e as CustomEvent<SiteTheme>;
      if (ce.detail === "light" || ce.detail === "dark") setTheme(ce.detail);
    };
    window.addEventListener("zenno-theme", onTheme);
    return () => window.removeEventListener("zenno-theme", onTheme);
  }, []);

  return theme;
}
