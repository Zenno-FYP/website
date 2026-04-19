import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Search, UsersRound } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { fetchPeersSearch, type PeerCard } from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { AxiosError } from "axios";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface PeersPageProps {
  theme: "light" | "dark";
  onBack: () => void;
  onSelectPeer?: (userId: string) => void;
}

function panelClass(theme: "light" | "dark"): string {
  return `rounded-3xl border shadow-lg backdrop-blur-2xl ${
    theme === "dark"
      ? "border-white/10 bg-gray-800/50"
      : "border-white/60 bg-white/50"
  }`;
}

export function PeersPage({ theme, onBack, onSelectPeer }: PeersPageProps) {
  const firebaseUser = useFirebaseUser();
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [peers, setPeers] = useState<PeerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPeersSearch(q);
      setPeers(list);
    } catch (err: unknown) {
      const message = err instanceof AxiosError ? handleApiError(err) : "Could not load peers.";
      setError(message);
      console.error("fetchPeersSearch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(committedQuery);
  }, [load, committedQuery, firebaseUser?.uid]);

  // Debounce typed input → committed query so search-as-you-type does not
  // fire a request on every keystroke. Enter still commits immediately via
  // `onSearch` below.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === committedQuery) return;
    const t = window.setTimeout(() => setCommittedQuery(trimmed), 350);
    return () => window.clearTimeout(t);
  }, [query, committedQuery]);

  const onSearch = () => {
    setCommittedQuery(query.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className={`group flex items-center gap-2 rounded-xl ${
            theme === "dark"
              ? "text-gray-300 hover:bg-white/10 hover:text-white"
              : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
          }`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to dashboard
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] shadow-lg`}
        >
          <UsersRound className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Find peers
          </h1>
          <p className={`mt-0.5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Search by name, bio, skills, project names, or apps you use. Leave empty to browse everyone.
          </p>
        </div>
      </div>

      <Card className={`${panelClass(theme)} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. TypeScript, VS Code, backend, react…"
              className={`h-11 rounded-xl pl-10 pr-10 ${
                theme === "dark"
                  ? "border-white/15 bg-white/10 text-white placeholder:text-gray-500"
                  : "border-gray-200 bg-white/90 text-gray-900"
              }`}
            />
            {loading && (
              <Loader2
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                aria-label="Searching"
              />
            )}
          </div>
          <Button
            type="button"
            onClick={onSearch}
            disabled={loading}
            className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </div>
      </Card>

      {error && <p className={theme === "dark" ? "text-red-400" : "text-red-600"}>{error}</p>}

      {loading && !peers.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 animate-pulse ${
                theme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-white/60"
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-full shrink-0 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                <div className="flex-1 space-y-2 py-1">
                  <div className={`h-4 rounded w-2/5 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                  <div className={`h-3 rounded w-4/5 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                  <div className={`h-3 rounded w-3/5 ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                  <div className="flex gap-1.5 pt-1">
                    {[40, 56, 48].map((w) => (
                      <div key={w} className={`h-5 rounded-full ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}`} style={{ width: w }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && peers.length === 0 ? (
        <div
          className={`text-center py-16 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <UsersRound className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No matches yet</p>
          <p className="text-sm mt-1 opacity-80">
            Try another keyword, or invite teammates to Zenno.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {peers.map((p) => (
          <Card
            key={p.user_id}
            role={onSelectPeer ? "button" : undefined}
            tabIndex={onSelectPeer ? 0 : undefined}
            onClick={onSelectPeer ? () => onSelectPeer(p.user_id) : undefined}
            onKeyDown={
              onSelectPeer
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectPeer(p.user_id);
                    }
                  }
                : undefined
            }
            className={`${panelClass(theme)} overflow-hidden p-5 transition-all hover:shadow-xl ${
              onSelectPeer ? "cursor-pointer" : ""
            } ${theme === "dark" ? "hover:border-white/20" : "hover:border-white/80"}`}
          >
            <div className="flex gap-4">
              <Avatar className="h-16 w-16 shrink-0 ring-2 ring-[#5B6FD8]/30">
                <AvatarImage src={p.profilePhoto ?? undefined} alt={p.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-lg text-white">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className={`truncate text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {p.name}
                </h2>
                <p
                  className={`mt-1 line-clamp-2 text-sm leading-relaxed ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {p.bio.trim() || "No bio yet — skills and projects still help you find them."}
                </p>
              </div>
            </div>

            {p.top_skills.length > 0 ? (
              <div className="mt-4">
                <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.top_skills.map((s) => (
                    <Badge
                      key={s}
                      className="rounded-lg border-0 bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] px-2 py-0.5 text-xs font-normal text-white"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {p.top_projects.length > 0 ? (
              <div className="mt-3">
                <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Projects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.top_projects.map((name) => (
                    <Badge
                      key={name}
                      variant="outline"
                      className={
                        theme === "dark"
                          ? "border-white/15 bg-white/5 text-gray-300"
                          : "border-gray-200 bg-white/80 text-gray-700"
                      }
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {p.top_apps.length > 0 ? (
              <div className="mt-3">
                <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Apps
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.top_apps.map((name) => (
                    <Badge
                      key={name}
                      variant="secondary"
                      className={`text-xs font-normal ${theme === "dark" ? "bg-white/10 text-gray-300" : ""}`}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
