import type { LucideIcon } from "lucide-react";
import { Chrome, Code, Terminal } from "lucide-react";

/**
 * Category colors — same as DeveloperTrendsCard / MetricsDetailPage (`TREND_FILTERS`)
 * and the mobile analytics screens.
 */
export const CATEGORY_COLORS = {
  flow: "#5B6FD8",
  debugging: "#FF6B6B",
  research: "#4ECDC4",
  communication: "#FFD93D",
  distracted: "#FF6B9D",
} as const;

/** TopAppUsageCard / mobile `APP_COLOR_PALETTE` — hash pick for app rows */
const APP_STYLE_PALETTE: { color: string; linearGradient: string }[] = [
  { color: "#5B6FD8", linearGradient: "linear-gradient(to bottom right, #5B6FD8, #7C4DFF)" },
  { color: "#4ECDC4", linearGradient: "linear-gradient(to bottom right, #4ECDC4, #44A6A0)" },
  { color: "#FB542B", linearGradient: "linear-gradient(to bottom right, #FB542B, #FF8C42)" },
  { color: "#FF6B9D", linearGradient: "linear-gradient(to bottom right, #FF6B9D, #FF8FA3)" },
  { color: "#FFD93D", linearGradient: "linear-gradient(to bottom right, #FFD93D, #FFC93D)" },
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAppRowVisual(appName: string): { color: string; linearGradient: string } {
  return APP_STYLE_PALETTE[hashString(appName) % APP_STYLE_PALETTE.length];
}

/** Mirrors TopAppUsageCard `getAppIcon` / mobile `_appIcon` */
export function getAppIconForName(appName: string): LucideIcon {
  const n = appName.toLowerCase();
  if (n.includes("code") || n.includes("vscode") || n.includes("vs ")) return Code;
  if (n.includes("chrome") || n.includes("firefox") || n.includes("edge") || n.includes("brave")) return Chrome;
  if (n.includes("terminal") || n.includes("cmd") || n.includes("powershell")) return Terminal;
  return Code;
}

/** Language share bars — distinct, dashboard-adjacent (not category colors) */
export const LANGUAGE_MOCK = [
  { name: "TypeScript", value: 62, bar: "#5B6FD8" },
  { name: "Python", value: 24, bar: "#4ECDC4" },
  { name: "Go", value: 14, bar: "#7C4DFF" },
] as const;
