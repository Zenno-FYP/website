import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Clock, Cpu, Code2, FileCode, Activity } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxiosError } from "axios";
import { fetchToolUsageDetail, ToolUsageDetailResponse } from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface AppLanguagesDetailPageProps {
  theme: "light" | "dark";
  onBack: () => void;
}

const APP_COLOR_PALETTE = [
  "#5B6FD8",
  "#4ECDC4",
  "#FB542B",
  "#FF6B9D",
  "#FFD93D",
  "#9B59B6",
  "#25D366",
  "#0078D4",
  "#00ED64",
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function appColor(name: string): string {
  return APP_COLOR_PALETTE[hashString(name) % APP_COLOR_PALETTE.length];
}

const LANG_COLORS: Record<string, string> = {
  JSON: "#F7DF1E",
  Python: "#3776AB",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  YAML: "#CB171E",
  Markdown: "#083FA1",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Java: "#007396",
  Go: "#00ADD8",
  Rust: "#CE4833",
  "C++": "#00599C",
  SQL: "#336791",
};

function langColor(name: string): string {
  return LANG_COLORS[name] ?? "#5B6FD8";
}

/** Stable colors for server-defined category names */
const CATEGORY_COLORS: Record<string, string> = {
  Development: "#5B6FD8",
  Browser: "#4285F4",
  Design: "#F24E1E",
  Communication: "#7C3AED",
  Productivity: "#9B59B6",
  Other: "#6B7280",
};

function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? APP_COLOR_PALETTE[hashString(category) % APP_COLOR_PALETTE.length];
}

function formatLoc(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

const PREVIEW_LIMIT = 5;

export function AppLanguagesDetailPage({ theme, onBack }: AppLanguagesDetailPageProps) {
  const firebaseUser = useFirebaseUser();
  const [data, setData] = useState<ToolUsageDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appsExpanded, setAppsExpanded] = useState(false);
  const [languagesExpanded, setLanguagesExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchToolUsageDetail()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof AxiosError ? handleApiError(err) : "Could not load analytics. Try again later.";
          setError(message);
          console.error("fetchToolUsageDetail:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser?.uid]);

  const gridBorder =
    theme === "dark" ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50";

  const apps = data?.top_apps.apps ?? [];
  const summary = data?.language_distribution.summary;
  const languages = data?.language_distribution.languages ?? [];
  const daily = data?.daily_app_usage ?? [];
  const categories = (data?.category_breakdown ?? []).filter((c) => c.hours > 0);

  const visibleApps = appsExpanded ? apps : apps.slice(0, PREVIEW_LIMIT);
  const visibleLanguages = languagesExpanded ? languages : languages.slice(0, PREVIEW_LIMIT);
  const hasMoreApps = apps.length > PREVIEW_LIMIT;
  const hasMoreLanguages = languages.length > PREVIEW_LIMIT;

  const pieData = categories.map((c) => ({
    name: c.category,
    hours: c.hours,
  }));

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className={`rounded-xl backdrop-blur-xl transition-all ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-white/60 bg-white/50 text-gray-900 hover:bg-white/70"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className={`text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Apps & Languages Analytics
            </h1>
            <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Last 7 days of active time in apps from synced activity; languages from your project code snapshots
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading…</p>
      )}
      {error && (
        <p className={theme === "dark" ? "text-red-400" : "text-red-600"}>{error}</p>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className={`rounded-2xl border p-5 shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${gridBorder}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] shadow-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`mb-0.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Active time (7d)
                  </p>
                  <p className={`text-2xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {data.top_apps.total_usage_hours.toFixed(1)}h
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-5 shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${gridBorder}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] shadow-md">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`mb-0.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Apps used
                  </p>
                  <p className={`text-2xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {data.unique_apps_count}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-5 shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${gridBorder}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] shadow-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`mb-0.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Lines of code
                  </p>
                  <p className={`text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatLoc(summary?.total_lines_of_code ?? 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`rounded-2xl border p-5 shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${gridBorder}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] shadow-md">
                  <FileCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className={`mb-0.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Languages
                  </p>
                  <p className={`text-2xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {summary?.total_languages_used ?? 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-[#5B6FD8]"}`} />
              <h2 className={`text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Application usage
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className={`rounded-3xl border p-6 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
                <div className="mb-4">
                  <h3 className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Usage by category
                  </h3>
                  <p className={`mt-0.5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Grouped from app names (rules on the server). Uncategorized time falls under Other.
                  </p>
                </div>
                {pieData.length === 0 ? (
                  <p className={`py-12 text-center text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                    No app usage recorded for this period.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="hours"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={2}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={categoryColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value: number) => [`${Number(value).toFixed(1)}h`, "Time"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card className={`rounded-3xl border p-6 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Total app hours by day
                    </h3>
                    <p className={`mt-0.5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Sum of all apps, all projects
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium tabular-nums ${
                      data.top_apps.usage_increase_from_yesterday_percent >= 0
                        ? theme === "dark"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-100 text-green-800"
                        : theme === "dark"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.top_apps.usage_increase_from_yesterday_percent >= 0 ? "+" : ""}
                    {data.top_apps.usage_increase_from_yesterday_percent.toFixed(0)}% vs yesterday
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={daily}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#ffffff15" : "#00000015"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day_name"
                      stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                      width={36}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="total_hours" fill="#5B6FD8" name="Hours" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {apps.length === 0 ? (
                <Card className={`rounded-2xl border p-8 text-center ${gridBorder}`}>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    No per-app breakdown available yet.
                  </p>
                </Card>
              ) : (
                visibleApps.map((app) => {
                  const color = appColor(app.name);
                  const up = app.change_percent >= 0;
                  return (
                    <Card
                      key={app.name}
                      className={`rounded-2xl border p-5 shadow-lg backdrop-blur-2xl transition-all hover:shadow-xl ${gridBorder}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-lg"
                          style={{
                            backgroundColor: theme === "dark" ? `${color}28` : `${color}18`,
                          }}
                        >
                          <div className="h-7 w-7 rounded-lg" style={{ backgroundColor: color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                {app.name}
                              </h3>
                              <span
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium tabular-nums ${
                                  up
                                    ? theme === "dark"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-green-100 text-green-800"
                                    : theme === "dark"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {app.change_percent >= 0 ? "+" : ""}
                                {app.change_percent.toFixed(0)}% vs prior week
                              </span>
                            </div>
                            <div className={`text-2xl font-semibold tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {app.duration_hours.toFixed(1)}h
                            </div>
                          </div>
                          <p className={`mb-3 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {app.percent_of_total.toFixed(1)}% of your active time this week
                          </p>
                          <div className={`h-2.5 overflow-hidden rounded-full ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}`}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, app.percent_of_total)}%`,
                                backgroundColor: color,
                                boxShadow: `0 0 10px ${color}40`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
              {hasMoreApps && (
                <div className="flex justify-center pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAppsExpanded((e) => !e)}
                    className={`gap-1.5 rounded-xl ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-white/10 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {appsExpanded ? (
                      <>
                        Show less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View more ({apps.length - PREVIEW_LIMIT} more)
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-[#5B6FD8]"}`} />
              <h2 className={`text-2xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Programming languages
              </h2>
            </div>

            <Card className={`rounded-3xl border p-6 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
              <div className="mb-4">
                <h3 className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  From your projects
                </h3>
                <p className={`mt-0.5 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {summary?.total_files ?? 0} files · top languages by lines of code
                </p>
              </div>
              {languages.length === 0 ? (
                <p className={`py-8 text-center text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                  No language data from projects yet.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleLanguages.map((lang) => {
                      const c = langColor(lang.name);
                      return (
                        <div
                          key={lang.name}
                          className={`rounded-xl p-4 transition-all ${
                            theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-white/60 hover:bg-white/80"
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg shadow-md"
                              style={{
                                backgroundColor: theme === "dark" ? `${c}28` : `${c}18`,
                              }}
                            >
                              <Code2 className="h-5 w-5" style={{ color: c }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                {lang.name}
                              </p>
                              <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {lang.percent.toFixed(1)}% · {lang.files} files
                              </p>
                            </div>
                          </div>
                          <div className={`mb-2 h-2 overflow-hidden rounded-full ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200"}`}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, lang.percent)}%`,
                                backgroundColor: c,
                                boxShadow: `0 0 8px ${c}40`,
                              }}
                            />
                          </div>
                          <p className={`text-xs tabular-nums ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {lang.loc.toLocaleString()} lines
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {hasMoreLanguages && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setLanguagesExpanded((e) => !e)}
                        className={`gap-1.5 rounded-xl ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-white/10 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {languagesExpanded ? (
                          <>
                            Show less
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            View more ({languages.length - PREVIEW_LIMIT} more)
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
