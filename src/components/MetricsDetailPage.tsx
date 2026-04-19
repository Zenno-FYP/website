import { useEffect, useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDurationHours } from "@/utils/durationFormat";
import {
  ArrowLeft,
  Zap,
  Clock,
  Keyboard,
  AlertCircle,
  MousePointer2,
  Hourglass,
  ChevronDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxiosError } from "axios";
import {
  fetchPerformanceMetricsDetail,
  PerformanceMetricsDetailResponse,
  PerformanceMetric,
  DetailPeriod,
  DailyBehaviorMetrics,
} from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface MetricsDetailPageProps {
  theme: "light" | "dark";
  onBack: () => void;
}

const PERIOD_OPTIONS: { value: DetailPeriod; label: string; compare: string }[] = [
  { value: "week",    label: "This week",     compare: "vs prior week"    },
  { value: "month",   label: "Last month",    compare: "vs prior month"   },
  { value: "90days",  label: "Last 90 days",  compare: "vs prior 90 days" },
  { value: "6months", label: "Last 6 months", compare: "vs prior 6 months"},
];

type TrendFilter = "all" | "flow" | "debugging" | "research" | "communication" | "distracted";

const TREND_FILTERS: { key: TrendFilter; label: string; color: string }[] = [
  { key: "all",           label: "All",           color: "#5B6FD8" },
  { key: "flow",          label: "Flow",          color: "#5B6FD8" },
  { key: "debugging",     label: "Debugging",     color: "#FF6B6B" },
  { key: "research",      label: "Research",      color: "#4ECDC4" },
  { key: "communication", label: "Communication", color: "#FFD93D" },
  { key: "distracted",    label: "Distracted",    color: "#FF6B9D" },
];

interface BreakdownRow {
  label: string;
  sublabel: string;
  kpm: number;
  cpm: number;
  correction: number;
  activeHours: number;
  idleHours: number;
}

// ── Chart data grouping (KPM / CPM averaged per period unit) ─────────────────
interface ChartPoint { day: string; KPM: number; CPM: number; }

/**
 * Duration-weighted mean of a numeric field over a set of days.
 *
 * KPM/CPM are rates (per minute), so a plain arithmetic mean would weight
 * a 30-min coding day equally with an 8-hour day. We weight by `active_hours`
 * to match the backend's per-window aggregation in dashboard.service.ts.
 */
function weightedAvgByActiveHours(
  days: DailyBehaviorMetrics[],
  pick: (d: DailyBehaviorMetrics) => number,
): number {
  let weight = 0;
  let weighted = 0;
  for (const d of days) {
    const w = d.active_hours;
    if (w <= 0) continue;
    weight += w;
    weighted += pick(d) * w;
  }
  return weight > 0 ? weighted / weight : 0;
}

function groupChartData(daily: DailyBehaviorMetrics[], period: DetailPeriod): ChartPoint[] {
  if (period === "week") {
    return daily.map((d) => ({ day: d.day_name, KPM: d.typing_intensity_kpm, CPM: d.mouse_click_rate_cpm }));
  }
  if (period === "month" || period === "90days") {
    const rows: ChartPoint[] = [];
    for (let i = 0; i < daily.length; i += 7) {
      const chunk = daily.slice(i, i + 7);
      rows.push({
        day: `Wk ${Math.floor(i / 7) + 1}`,
        KPM: weightedAvgByActiveHours(chunk, (d) => d.typing_intensity_kpm),
        CPM: weightedAvgByActiveHours(chunk, (d) => d.mouse_click_rate_cpm),
      });
    }
    return rows;
  }
  // 6months → group by calendar month
  const monthMap = new Map<string, DailyBehaviorMetrics[]>();
  for (const d of daily) {
    const mk = d.date.substring(0, 7);
    if (!monthMap.has(mk)) monthMap.set(mk, []);
    monthMap.get(mk)!.push(d);
  }
  const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from(monthMap.entries()).map(([mk, days]) => ({
    day: mNames[parseInt(mk.split("-")[1]) - 1],
    KPM: weightedAvgByActiveHours(days, (d) => d.typing_intensity_kpm),
    CPM: weightedAvgByActiveHours(days, (d) => d.mouse_click_rate_cpm),
  }));
}

function groupDailySeries(daily: DailyBehaviorMetrics[], period: DetailPeriod): BreakdownRow[] {
  if (period === "week") {
    return daily.map((d) => ({
      label: d.day_name, sublabel: d.date,
      kpm: d.typing_intensity_kpm, cpm: d.mouse_click_rate_cpm,
      correction: d.correction_rate_percent,
      activeHours: d.active_hours, idleHours: d.idle_hours,
    }));
  }

  if (period === "month" || period === "90days") {
    const rows: BreakdownRow[] = [];
    for (let i = 0; i < daily.length; i += 7) {
      const chunk = daily.slice(i, i + 7);
      // KPM, CPM, and correction% are all rates → duration-weighted.
      // active_hours and idle_hours are absolute totals → plain sum.
      rows.push({
        label: `Wk ${Math.floor(i / 7) + 1}`,
        sublabel: `${chunk[0].date} – ${chunk[chunk.length - 1].date}`,
        kpm: weightedAvgByActiveHours(chunk, (d) => d.typing_intensity_kpm),
        cpm: weightedAvgByActiveHours(chunk, (d) => d.mouse_click_rate_cpm),
        correction: weightedAvgByActiveHours(chunk, (d) => d.correction_rate_percent),
        activeHours: chunk.reduce((s, d) => s + d.active_hours, 0),
        idleHours: chunk.reduce((s, d) => s + d.idle_hours, 0),
      });
    }
    return rows;
  }

  // 6months: group by calendar month
  const monthMap = new Map<string, DailyBehaviorMetrics[]>();
  for (const d of daily) {
    const mk = d.date.substring(0, 7);
    if (!monthMap.has(mk)) monthMap.set(mk, []);
    monthMap.get(mk)!.push(d);
  }
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from(monthMap.entries()).map(([mk, days]) => {
    const [year, mon] = mk.split("-");
    return {
      label: `${monthNames[parseInt(mon) - 1]} ${year}`,
      sublabel: `${days.length} days`,
      kpm: weightedAvgByActiveHours(days, (d) => d.typing_intensity_kpm),
      cpm: weightedAvgByActiveHours(days, (d) => d.mouse_click_rate_cpm),
      correction: weightedAvgByActiveHours(days, (d) => d.correction_rate_percent),
      activeHours: days.reduce((s, d) => s + d.active_hours, 0),
      idleHours: days.reduce((s, d) => s + d.idle_hours, 0),
    };
  });
}

function breakdownTitle(period: DetailPeriod) {
  if (period === "week")   return "Daily breakdown";
  if (period === "6months") return "Monthly breakdown";
  return "Weekly breakdown";
}

function formatMouseDistance(px: number): string {
  if (px >= 1_000_000) return `${(px / 1_000_000).toFixed(2)}M px`;
  if (px >= 1000)      return `${(px / 1000).toFixed(1)}k px`;
  return `${Math.round(px)} px`;
}

export function MetricsDetailPage({ theme, onBack }: MetricsDetailPageProps) {
  const firebaseUser = useFirebaseUser();
  const [period, setPeriod] = useState<DetailPeriod>("week");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [data, setData] = useState<PerformanceMetricsDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset filter when period changes
  useEffect(() => { setTrendFilter("all"); }, [period]);

  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPerformanceMetricsDetail(period)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof AxiosError ? handleApiError(err) : "Could not load metrics.");
          console.error("fetchPerformanceMetricsDetail:", err);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [firebaseUser?.uid, period]);

  const selectedPeriod = PERIOD_OPTIONS.find((p) => p.value === period)!;
  const summary = data?.performance_summary;
  const daily = data?.daily_series ?? [];

  const trendData = useMemo(() =>
    (data?.usage_trend_graph ?? []).map((d) => ({
      name: d.day_name,
      flow_hours: d.flow_hours,
      debugging_hours: d.debugging_hours,
      research_hours: d.research_hours,
      communication_hours: d.communication_hours,
      distracted_hours: d.distracted_hours,
    })),
    [data?.usage_trend_graph],
  );

  const showLine = (key: Exclude<TrendFilter, "all">) =>
    trendFilter === "all" || trendFilter === key;

  const breakdownRows = useMemo(() => groupDailySeries(daily, period), [daily, period]);
  const chartData     = useMemo(() => groupChartData(daily, period),   [daily, period]);

  const totalIdleHours = daily.reduce((s, d) => s + d.idle_hours, 0);
  const totalMousePx = daily.reduce((s, d) => s + d.total_mouse_movement_distance, 0);

  const metricsConfig: {
    key: keyof NonNullable<PerformanceMetricsDetailResponse["performance_summary"]>;
    label: string | null;
    unit: string | null;
    icon: typeof Keyboard;
    gradient: string;
    bgGradient: string;
  }[] = [
    { key: "avg_typing_intensity", label: "Typing Intensity", unit: "KPM",  icon: Keyboard,    gradient: "from-[#5B6FD8] to-[#7C4DFF]", bgGradient: "from-[#5B6FD8]/10 to-[#7C4DFF]/5"  },
    { key: "daily_active_average", label: null,                unit: null,   icon: Clock,       gradient: "from-[#FFD93D] to-[#FFC93D]", bgGradient: "from-[#FFD93D]/10 to-[#FFC93D]/5"  },
    { key: "avg_mouse_click_rate", label: "Mouse Click Rate",  unit: "CPM",  icon: Zap,         gradient: "from-[#4ECDC4] to-[#44A6A0]", bgGradient: "from-[#4ECDC4]/10 to-[#44A6A0]/5"  },
    { key: "avg_corrections",      label: "Correction Rate",   unit: "%",    icon: AlertCircle, gradient: "from-[#FF6B9D] to-[#FF8FA3]", bgGradient: "from-[#FF6B9D]/10 to-[#FF8FA3]/5"  },
  ];

  const getMetric = (key: keyof NonNullable<PerformanceMetricsDetailResponse["performance_summary"]>): PerformanceMetric | undefined => summary?.[key];

  const dark = theme === "dark";
  const gridBorder = dark ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50";
  const summaryCardShell = `flex h-full min-h-[200px] flex-col gap-0 overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-2xl relative ${dark ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50"}`;
  const totalLabel = period === "week" ? "Week total" : period === "month" ? "Month total" : `${selectedPeriod.label} total`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon" className={`rounded-xl backdrop-blur-xl transition-all ${dark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white/50 hover:bg-white/70 border-white/60 text-gray-900"}`}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className={`text-3xl ${dark ? "text-white" : "text-gray-900"}`}>Performance metrics</h1>
            <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {selectedPeriod.label} overview — {selectedPeriod.compare}
            </p>
          </div>
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${dark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white/70 hover:bg-white border-gray-200 text-gray-800"}`}
          >
            {selectedPeriod.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className={`absolute right-0 top-full mt-2 w-40 rounded-2xl border shadow-2xl z-50 overflow-hidden ${dark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"}`}>
              {PERIOD_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => { setPeriod(opt.value); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${opt.value === period ? "text-[#5B6FD8] font-semibold bg-[#5B6FD8]/10" : dark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && <p className={dark ? "text-gray-400" : "text-gray-600"}>Loading…</p>}
      {error   && <p className={dark ? "text-red-400"  : "text-red-600"}>{error}</p>}

      {!loading && !error && summary && (
        <>
          {/* Summary metric cards */}
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metricsConfig.map((config) => {
              const metric = getMetric(config.key);
              const value = metric?.value ?? 0;
              const change = metric?.change_percent ?? 0;
              const isDuration = config.key === "daily_active_average";
              const fmt = isDuration ? formatDurationHours(value) : null;
              const displayValue = isDuration ? fmt!.text : `${value.toFixed(1)}`;
              const displayUnit = config.unit ?? "";
              const displayLabel = config.label ?? (fmt?.label ? `${fmt.label} / day` : "Active time / day");
              const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
              return (
                <Card key={config.key} className={summaryCardShell}>
                  <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${config.bgGradient} blur-3xl opacity-50`} />
                  <div className="relative z-10 flex h-full min-h-0 flex-col">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} shadow-md`}>
                        <config.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] ${trend === "up" ? dark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700" : trend === "down" ? dark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700" : dark ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-700"}`}>
                        <span className="font-medium">{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-1">
                      <div className="flex items-baseline gap-1">
                        <p className={`text-3xl tabular-nums ${dark ? "text-white" : "text-gray-900"}`}>{displayValue}</p>
                        {displayUnit && <span className={`text-xs font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}>{displayUnit}</span>}
                      </div>
                      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>{displayLabel}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Idle time card */}
            <Card className={summaryCardShell}>
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-amber-500/25 to-orange-600/20 blur-3xl opacity-70" />
              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md ring-2 ${dark ? "ring-amber-300/25" : "ring-orange-900/15"}`}>
                    <Hourglass className="h-7 w-7 text-amber-50 drop-shadow-sm" strokeWidth={2.25} />
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${dark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>{totalLabel}</span>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <p className={`text-3xl tabular-nums ${dark ? "text-white" : "text-gray-900"}`}>{totalIdleHours < 1 ? Math.round(totalIdleHours * 60) : totalIdleHours.toFixed(1)}</p>
                    <span className={`text-xs font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}>{totalIdleHours < 1 ? "min" : "hrs"}</span>
                  </div>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Idle time</p>
                </div>
              </div>
            </Card>

            {/* Mouse movement card */}
            <Card className={summaryCardShell}>
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-600/25 blur-3xl opacity-60" />
              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                    <MousePointer2 className="h-7 w-7 text-white" />
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${dark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>{totalLabel}</span>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <p className={`text-2xl font-semibold tabular-nums leading-tight sm:text-3xl ${dark ? "text-white" : "text-gray-900"}`}>{formatMouseDistance(totalMousePx)}</p>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>Mouse movement</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Developer Trends chart with filter badges */}
          {trendData.length > 0 && (
            <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${gridBorder}`}>
              <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div>
                  <h3 className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Developer Trends</h3>
                  <p className={`text-sm mt-0.5 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                    Context type breakdown — {selectedPeriod.label.toLowerCase()}
                  </p>
                </div>
                {/* Filter badges — same pattern as dashboard DeveloperTrendsCard */}
                <div className="flex items-center gap-2 flex-wrap">
                  {TREND_FILTERS.map((f) => (
                    <Badge
                      key={f.key}
                      variant="outline"
                      className={`rounded-full cursor-pointer transition-all text-xs ${
                        trendFilter === f.key
                          ? `border-[${f.color}] bg-[${f.color}]/10`
                          : dark
                            ? "border-gray-600 text-gray-400 bg-gray-800/50"
                            : "border-gray-300 text-gray-500 bg-gray-50"
                      }`}
                      style={trendFilter === f.key ? { borderColor: f.color, color: f.color, backgroundColor: `${f.color}18` } : {}}
                      onClick={() => setTrendFilter(f.key)}
                    >
                      ● {f.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#ffffff15" : "#00000015"} vertical={false} />
                  <XAxis dataKey="name" stroke={dark ? "#9ca3af" : "#6b7280"} style={{ fontSize: "11px" }} />
                  <YAxis stroke={dark ? "#9ca3af" : "#6b7280"} style={{ fontSize: "11px" }} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: dark ? "#1f2937" : "#ffffff", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }} formatter={(v: number) => `${v.toFixed(2)}h`} labelFormatter={() => ""} />
                  <Legend />
                  {showLine("flow")          && <Line type="monotone" dataKey="flow_hours"          stroke="#5B6FD8" strokeWidth={2} dot={false} name="Flow"          />}
                  {showLine("debugging")     && <Line type="monotone" dataKey="debugging_hours"     stroke="#FF6B6B" strokeWidth={2} dot={false} name="Debugging"     />}
                  {showLine("research")      && <Line type="monotone" dataKey="research_hours"      stroke="#4ECDC4" strokeWidth={2} dot={false} name="Research"      />}
                  {showLine("communication") && <Line type="monotone" dataKey="communication_hours" stroke="#FFD93D" strokeWidth={2} dot={false} name="Communication" />}
                  {showLine("distracted")    && <Line type="monotone" dataKey="distracted_hours"    stroke="#FF6B9D" strokeWidth={2} dot={false} name="Distracted"    />}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Daily typing & click intensity bar chart */}
          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${gridBorder}`}>
            <div className="mb-4">
              <h3 className={`text-lg ${dark ? "text-white" : "text-gray-900"}`}>Typing & click intensity</h3>
              <p className={`text-sm mt-0.5 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                {period === "week" ? "Daily averages" : period === "6months" ? "Monthly averages" : "Weekly averages"} — KPM & CPM
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#ffffff15" : "#00000015"} vertical={false} />
                <XAxis dataKey="day" stroke={dark ? "#9ca3af" : "#6b7280"} style={{ fontSize: "12px" }} />
                <YAxis stroke={dark ? "#9ca3af" : "#6b7280"} style={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ backgroundColor: dark ? "#1f2937" : "#ffffff", border: "none", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }} />
                <Legend />
                <Bar dataKey="KPM" fill="#5B6FD8" radius={[6, 6, 0, 0]} name="Typing (KPM)" />
                <Bar dataKey="CPM" fill="#4ECDC4" radius={[6, 6, 0, 0]} name="Clicks (CPM)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Grouped breakdown table */}
          <Card className={`relative overflow-hidden rounded-3xl border p-0 shadow-lg backdrop-blur-2xl ${gridBorder}`}>
            <div className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${dark ? "bg-gradient-to-br from-[#5B6FD8]/20 via-[#4ECDC4]/10 to-transparent" : "bg-gradient-to-br from-[#5B6FD8]/15 via-[#4ECDC4]/10 to-transparent"}`} />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-[#FF6B9D]/10 to-transparent blur-3xl" />
            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className={`text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>{breakdownTitle(period)}</h3>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tabular-nums ${dark ? "border-white/10 bg-white/5 text-gray-300" : "border-gray-200 bg-white/60 text-gray-600"}`}>
                  {breakdownRows.length} {period === "6months" ? "months" : period === "week" ? "days" : "weeks"}
                </span>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${dark ? "border-white/10 bg-black/25" : "border-gray-200/90 bg-white/50"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] border-collapse text-sm">
                    <thead>
                      <tr className={`border-b ${dark ? "border-white/10 bg-gray-950/50 text-gray-400" : "border-gray-200/90 bg-gray-50/90 text-gray-600"}`}>
                        <th className="whitespace-nowrap px-4 py-3.5 pl-5 text-left text-xs font-semibold uppercase tracking-wider">Period</th>
                        {[
                          { label: "KPM",    color: "#5B6FD8" },
                          { label: "CPM",    color: "#4ECDC4" },
                          { label: "Corr. %",color: "#FF6B9D" },
                          { label: "Active", color: "#FFD93D" },
                          { label: "Idle",   color: "#f97316" },
                        ].map((h) => (
                          <th key={h.label} className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                            <span className="inline-flex items-center justify-center gap-2">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: h.color }} />
                              {h.label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${dark ? "divide-white/[0.07]" : "divide-gray-100"}`}>
                      {breakdownRows.map((row, i) => (
                        <tr key={i} className={`transition-colors ${dark ? i % 2 === 0 ? "bg-transparent hover:bg-white/[0.04]" : "bg-white/[0.02] hover:bg-white/[0.05]" : i % 2 === 0 ? "bg-transparent hover:bg-gray-50/90" : "bg-gray-50/40 hover:bg-gray-50"}`}>
                          <td className="px-4 py-3 pl-5 text-left align-middle">
                            <div className="flex flex-col gap-0.5">
                              <span className={`font-medium ${dark ? "text-white" : "text-gray-900"}`}>{row.label}</span>
                              <span className={`text-xs tabular-nums ${dark ? "text-gray-500" : "text-gray-500"}`}>{row.sublabel}</span>
                            </div>
                          </td>
                          <td className={`px-3 py-3 text-center tabular-nums ${dark ? "text-gray-200" : "text-gray-800"}`}>{row.kpm.toFixed(1)}</td>
                          <td className={`px-3 py-3 text-center tabular-nums ${dark ? "text-gray-200" : "text-gray-800"}`}>{row.cpm.toFixed(1)}</td>
                          <td className={`px-3 py-3 text-center tabular-nums ${dark ? "text-gray-200" : "text-gray-800"}`}>{row.correction.toFixed(1)}</td>
                          <td className={`px-3 py-3 text-center tabular-nums ${dark ? "text-gray-200" : "text-gray-800"}`}>{row.activeHours < 1 ? `${Math.round(row.activeHours * 60)}m` : `${row.activeHours.toFixed(1)}h`}</td>
                          <td className={`px-4 py-3 pr-5 text-center tabular-nums ${dark ? "text-gray-200" : "text-gray-800"}`}>{row.idleHours < 1 ? `${Math.round(row.idleHours * 60)}m` : `${row.idleHours.toFixed(1)}h`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
