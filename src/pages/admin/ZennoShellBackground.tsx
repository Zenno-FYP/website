import type { SiteTheme } from "@/hooks/useSiteTheme";

/** Matches `MainLayout` animated background (dark + light). */
export function ZennoShellBackground({ theme }: { theme: SiteTheme }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {theme === "dark" && (
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      )}
      <div
        className={
          theme === "dark"
            ? "absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent"
            : ""
        }
      />
      <div
        className={`absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl animate-pulse ${
          theme === "dark"
            ? "bg-gradient-to-br from-purple-600/15 to-blue-600/8"
            : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
        }`}
      />
      <div
        className={`absolute bottom-0 right-1/4 h-96 w-96 rounded-full blur-3xl animate-pulse ${
          theme === "dark"
            ? "bg-gradient-to-br from-purple-600/15 to-[#7C4DFF]/8"
            : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
        }`}
        style={{ animationDelay: "2s" }}
      />
      {theme === "dark" && (
        <div className="absolute top-0 right-0 h-full w-full">
          <div className="absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-1/3 rotate-12 bg-gradient-to-br from-purple-600/5 to-transparent blur-2xl" />
        </div>
      )}
    </div>
  );
}
