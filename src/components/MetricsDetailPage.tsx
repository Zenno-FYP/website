import { useEffect, useState } from "react";
import { Card } from "./ui/card";
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
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
} from "@/services/api";
import { handleApiError } from "@/services/errorHandler";
import { useFirebaseUser } from "@/stores/useAuthHooks";

interface MetricsDetailPageProps {
  theme: "light" | "dark";
  onBack: () => void;
}

function formatMouseDistance(px: number): string {
  if (px >= 1_000_000) {
    return `${(px / 1_000_000).toFixed(2)}M px`;
  }
  if (px >= 1000) {
    return `${(px / 1000).toFixed(1)}k px`;
  }
  return `${Math.round(px)} px`;
}

export function MetricsDetailPage({ theme, onBack }: MetricsDetailPageProps) {
  const firebaseUser = useFirebaseUser();
  const [data, setData] = useState<PerformanceMetricsDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPerformanceMetricsDetail()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof AxiosError ? handleApiError(err) : "Could not load metrics. Try again later.";
          setError(message);
          console.error("fetchPerformanceMetricsDetail:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser?.uid]);

  const summary = data?.performance_summary;
  const daily = data?.daily_series ?? [];

  const weekIdleHours = daily.reduce((s, d) => s + d.idle_hours, 0);
  const weekMousePx = daily.reduce((s, d) => s + d.total_mouse_movement_distance, 0);

  const chartData = daily.map((d) => ({
    day: d.day_name,
    KPM: d.typing_intensity_kpm,
    CPM: d.mouse_click_rate_cpm,
  }));

  const metricsConfig: {
    key: keyof NonNullable<PerformanceMetricsDetailResponse["performance_summary"]>;
    label: string | null;
    unit: string | null;
    icon: typeof Keyboard;
    gradient: string;
    bgGradient: string;
  }[] = [
    {
      key: "avg_typing_intensity",
      label: "Typing Intensity",
      unit: "KPM",
      icon: Keyboard,
      gradient: "from-[#5B6FD8] to-[#7C4DFF]",
      bgGradient: "from-[#5B6FD8]/10 to-[#7C4DFF]/5",
    },
    {
      key: "daily_active_average",
      label: null,
      unit: null,
      icon: Clock,
      gradient: "from-[#FFD93D] to-[#FFC93D]",
      bgGradient: "from-[#FFD93D]/10 to-[#FFC93D]/5",
    },
    {
      key: "avg_mouse_click_rate",
      label: "Mouse Click Rate",
      unit: "CPM",
      icon: Zap,
      gradient: "from-[#4ECDC4] to-[#44A6A0]",
      bgGradient: "from-[#4ECDC4]/10 to-[#44A6A0]/5",
    },
    {
      key: "avg_corrections",
      label: "Correction Rate",
      unit: "%",
      icon: AlertCircle,
      gradient: "from-[#FF6B9D] to-[#FF8FA3]",
      bgGradient: "from-[#FF6B9D]/10 to-[#FF8FA3]/5",
    },
  ];

  const getMetric = (
    key: keyof NonNullable<PerformanceMetricsDetailResponse["performance_summary"]>
  ): PerformanceMetric | undefined => {
    if (!summary) return undefined;
    return summary[key];
  };

  const gridBorder =
    theme === "dark" ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50";

  /** Shared shell so the 6 summary cards share one height in the grid (gap-0 overrides Card default gap-6) */
  const summaryCardShell = `flex h-full min-h-[200px] flex-col gap-0 overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-2xl relative ${
    theme === "dark" ? "border-white/10 bg-gray-800/50" : "border-white/60 bg-white/50"
  }`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className={`rounded-xl backdrop-blur-xl transition-all ${
              theme === "dark"
                ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                : "bg-white/50 hover:bg-white/70 border-white/60 text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1
              className={`text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Performance metrics
            </h1>
            <p
              className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              Last 7 days vs the prior 7 days — from your synced activity behavior
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

      {!loading && !error && summary && (
        <>
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

              let trend: "up" | "down" | "neutral";
              if (change > 0) trend = "up";
              else if (change < 0) trend = "down";
              else trend = "neutral";

              return (
                <Card key={config.key} className={summaryCardShell}>
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${config.bgGradient} blur-3xl opacity-50`}
                  />
                  <div className="relative z-10 flex h-full min-h-0 flex-col">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} shadow-md`}
                      >
                        <config.icon className="h-7 w-7 text-white" />
                      </div>
                      <div
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] ${
                          trend === "up"
                            ? theme === "dark"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-green-100 text-green-700"
                            : trend === "down"
                              ? theme === "dark"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-red-100 text-red-700"
                              : theme === "dark"
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="font-medium">
                          {change > 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-1">
                      <div className="flex items-baseline gap-1">
                        <p
                          className={`text-3xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {displayValue}
                        </p>
                        {displayUnit && (
                          <span
                            className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                          >
                            {displayUnit}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {displayLabel}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card className={summaryCardShell}>
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-amber-500/25 to-orange-600/20 blur-3xl opacity-70" />
              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md ring-2 ${
                      theme === "dark" ? "ring-amber-300/25" : "ring-orange-900/15"
                    }`}
                  >
                    <Hourglass className="h-7 w-7 text-amber-50 drop-shadow-sm" strokeWidth={2.25} />
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      theme === "dark" ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Week total
                  </span>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <p
                      className={`text-3xl tabular-nums ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {weekIdleHours < 1 ? Math.round(weekIdleHours * 60) : weekIdleHours.toFixed(1)}
                    </p>
                    <span
                      className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {weekIdleHours < 1 ? "min" : "hrs"}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Idle time
                  </p>
                </div>
              </div>
            </Card>

            <Card className={summaryCardShell}>
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-600/25 blur-3xl opacity-60" />
              <div className="relative z-10 flex h-full min-h-0 flex-col">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                    <MousePointer2 className="h-7 w-7 text-white" />
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      theme === "dark" ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Week total
                  </span>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <p
                    className={`text-2xl font-semibold tabular-nums leading-tight sm:text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {formatMouseDistance(weekMousePx)}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Mouse movement
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className={`p-6 rounded-3xl shadow-lg backdrop-blur-2xl border ${gridBorder}`}>
            <div className="mb-4">
              <h3
                className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Daily typing & click intensity
              </h3>
              <p
                className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Averages across your projects per day (KPM and CPM from activity behavior)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#ffffff15" : "#00000015"}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                />
                <Legend />
                <Bar dataKey="KPM" fill="#5B6FD8" radius={[6, 6, 0, 0]} name="Typing (KPM)" />
                <Bar dataKey="CPM" fill="#4ECDC4" radius={[6, 6, 0, 0]} name="Clicks (CPM)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card
            className={`relative overflow-hidden rounded-3xl border p-0 shadow-lg backdrop-blur-2xl ${gridBorder}`}
          >
            <div
              className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#5B6FD8]/20 via-[#4ECDC4]/10 to-transparent"
                  : "bg-gradient-to-br from-[#5B6FD8]/15 via-[#4ECDC4]/10 to-transparent"
              }`}
            />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-[#FF6B9D]/10 to-transparent blur-3xl" />
            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3
                  className={`text-lg font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Daily breakdown
                </h3>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tabular-nums ${
                    theme === "dark"
                      ? "border-white/10 bg-white/5 text-gray-300"
                      : "border-gray-200 bg-white/60 text-gray-600"
                  }`}
                >
                  {daily.length} days
                </span>
              </div>

              <div
                className={`overflow-hidden rounded-2xl border ${
                  theme === "dark"
                    ? "border-white/10 bg-black/25"
                    : "border-gray-200/90 bg-white/50"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <thead>
                      <tr
                        className={`border-b ${
                          theme === "dark"
                            ? "border-white/10 bg-gray-950/50 text-gray-400"
                            : "border-gray-200/90 bg-gray-50/90 text-gray-600"
                        }`}
                      >
                        <th className="whitespace-nowrap px-4 py-3.5 pl-5 text-left text-xs font-semibold uppercase tracking-wider">
                          Day
                        </th>
                        <th className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B6FD8]" />
                            KPM
                          </span>
                        </th>
                        <th className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ECDC4]" />
                            CPM
                          </span>
                        </th>
                        <th className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B9D]" />
                            Corr. %
                          </span>
                        </th>
                        <th className="whitespace-nowrap px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD93D]" />
                            Active
                          </span>
                        </th>
                        <th className="whitespace-nowrap px-4 py-3.5 pr-5 text-center text-xs font-semibold uppercase tracking-wider">
                          <span className="inline-flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            Idle
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${theme === "dark" ? "divide-white/[0.07]" : "divide-gray-100"}`}
                    >
                      {daily.map((row, i) => (
                        <tr
                          key={row.date}
                          className={`transition-colors ${
                            theme === "dark"
                              ? i % 2 === 0
                                ? "bg-transparent hover:bg-white/[0.04]"
                                : "bg-white/[0.02] hover:bg-white/[0.05]"
                              : i % 2 === 0
                                ? "bg-transparent hover:bg-gray-50/90"
                                : "bg-gray-50/40 hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 pl-5 text-left align-middle">
                            <div className="flex flex-col gap-0.5">
                              <span
                                className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                              >
                                {row.day_name}
                              </span>
                              <span
                                className={`text-xs tabular-nums ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                              >
                                {row.date}
                              </span>
                            </div>
                          </td>
                          <td
                            className={`px-3 py-3 text-center align-middle tabular-nums ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {row.typing_intensity_kpm.toFixed(1)}
                          </td>
                          <td
                            className={`px-3 py-3 text-center align-middle tabular-nums ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {row.mouse_click_rate_cpm.toFixed(1)}
                          </td>
                          <td
                            className={`px-3 py-3 text-center align-middle tabular-nums ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {row.correction_rate_percent.toFixed(1)}
                          </td>
                          <td
                            className={`px-3 py-3 text-center align-middle tabular-nums ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {row.active_hours < 1 ? `${Math.round(row.active_hours * 60)}m` : `${row.active_hours.toFixed(1)}h`}
                          </td>
                          <td
                            className={`px-4 py-3 pr-5 text-center align-middle tabular-nums ${
                              theme === "dark" ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {row.idle_hours < 1 ? `${Math.round(row.idle_hours * 60)}m` : `${row.idle_hours.toFixed(1)}h`}
                          </td>
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
