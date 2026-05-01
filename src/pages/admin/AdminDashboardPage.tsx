import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminStats,
  fetchAdminUsers,
  type AdminStats,
  type AdminUserRow,
} from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";
import type { SiteTheme } from "@/hooks/useSiteTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Monitor,
  TrendingUp,
  MessageSquareWarning,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AdminOutletContext = { theme?: SiteTheme };

const CHART_VERIFIED = "#34d399";
const CHART_UNVERIFIED = "#f59e0b";
const CHART_BAR_PRIMARY = "#7C4DFF";
const CHART_BAR_ACCENT = "#22d3ee";

const PIE_HOST_PX = 240;
const BAR_HOST_PX = 280;

/** Measure chart width; height is fixed in CSS so Recharts always gets a real box (avoid 927×17 collapse). */
function useChartHostWidth(stats: AdminStats | null) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!stats) {
      setWidth(0);
      return;
    }

    const el = ref.current;
    if (!el) {
      return;
    }

    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.floor(r.width));
      setWidth((prev) => (prev === w ? prev : w));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stats]);

  return { ref, width };
}

function VerificationMixChart({
  width,
  height,
  stats,
  isDark,
}: {
  width: number;
  height: number;
  stats: AdminStats;
  isDark: boolean;
}) {
  const r = Math.min(width, height) / 2 - 8;
  const outerR = Math.max(28, r * 0.9);
  const innerR = outerR * 0.56;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <PieChart width={width} height={height} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
      <Pie
        data={[
          { name: "Verified", value: stats.verifiedUsers, fill: CHART_VERIFIED },
          { name: "Unverified", value: stats.unverifiedUsers, fill: CHART_UNVERIFIED },
        ]}
        dataKey="value"
        nameKey="name"
        cx={cx}
        cy={cy}
        innerRadius={innerR}
        outerRadius={outerR}
        paddingAngle={2}
        strokeWidth={0}
        isAnimationActive={false}
      />
      <Tooltip
        formatter={(value: number, name: string) => [`${value}`, name]}
        contentStyle={
          isDark
            ? { background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e5e7eb" }
            : { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#111827" }
        }
        labelStyle={{ color: isDark ? "#9ca3af" : "#6b7280" }}
      />
    </PieChart>
  );
}

function ActivitySnapshotChart({
  width,
  height,
  stats,
  isDark,
}: {
  width: number;
  height: number;
  stats: AdminStats;
  isDark: boolean;
}) {
  const data = [
    { name: "Desktop (1h)", value: stats.usersActiveDesktopLastHour },
    { name: "Signups (7d)", value: stats.newUsersLast7Days },
    { name: "Open reports", value: stats.openChatReports },
  ];

  return (
    <BarChart width={width} height={height} data={data} margin={{ top: 12, right: 12, left: 4, bottom: 8 }} barCategoryGap="18%">
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
      <XAxis
        dataKey="name"
        tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 11 }}
        axisLine={{ stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }}
        tickLine={false}
        interval={0}
      />
      <YAxis
        allowDecimals={false}
        width={36}
        tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip
        formatter={(value: number) => [value, "Count"]}
        contentStyle={
          isDark
            ? { background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e5e7eb" }
            : { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#111827" }
        }
        labelStyle={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
      />
      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
        <Cell fill={CHART_BAR_ACCENT} />
        <Cell fill={CHART_BAR_PRIMARY} />
        <Cell fill="#fb7185" />
      </Bar>
    </BarChart>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  footnote,
  href,
  isDark,
  iconColor,
  glowClass,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  footnote?: string;
  href?: string;
  isDark: boolean;
  iconColor?: string;
  glowClass?: string;
}) {
  const defaultColor = "#7C4DFF";
  const bgColor = iconColor || defaultColor;
  const glow = glowClass || (isDark ? "from-[#5B6FD8]/20 to-[#7C4DFF]/10" : "from-[#5B6FD8]/15 to-[#7C4DFF]/8");

  const inner = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-8 sm:p-10 shadow-lg backdrop-blur-xl transition-colors duration-200",
        isDark
          ? "border-white/10 bg-gradient-to-br from-[#16161f]/95 to-[#121218]/90 shadow-black/25"
          : "border-gray-200/90 bg-white/75 shadow-gray-400/10",
        href && isDark && "cursor-pointer hover:border-purple-500/40 hover:shadow-purple-900/15",
        href && !isDark && "cursor-pointer hover:border-[#5B6FD8]/35 hover:shadow-[#5B6FD8]/10",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity",
          glow
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
          <p className={cn("mt-3 text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl", isDark ? "text-white" : "text-gray-900")}>
            {value}
          </p>
          {footnote ? (
            <p className={cn("mt-2 text-xs leading-relaxed", isDark ? "text-gray-500" : "text-gray-600")}>{footnote}</p>
          ) : null}
        </div>
        <div 
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md ring-2 ring-white/40"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2.35} aria-hidden />
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className={cn(
          "block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2",
          isDark ? "focus-visible:ring-offset-[#0a0a0f]" : "focus-visible:ring-offset-white",
        )}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

function formatSync(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export function AdminDashboardPage() {
  const outlet = useOutletContext<AdminOutletContext>();
  const theme: SiteTheme = outlet?.theme ?? "dark";
  const isDark = theme === "dark";

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "true" | "false">("all");
  const [loading, setLoading] = useState(true);

  const pieHost = useChartHostWidth(stats);
  const barHost = useChartHostWidth(stats);

  const loadStats = useCallback(async () => {
    const s = await fetchAdminStats();
    setStats(s);
  }, []);

  const loadUsers = useCallback(async () => {
    const r = await fetchAdminUsers({ page, limit, verified: verifiedFilter });
    setUsers(r.items);
    setTotalUsers(r.total);
    setTotalPages(r.totalPages);
  }, [page, limit, verifiedFilter]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([loadStats(), loadUsers()])
      .catch(() => {
        if (!cancelled) toast.error("Could not load dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadStats, loadUsers]);

  const verifiedPct =
    stats && stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0;

  const cardClass = cn(
    "overflow-hidden rounded-2xl",
    isDark ? "border-white/10 bg-[#121218]/75 shadow-xl backdrop-blur-xl" : "border-gray-200/90 bg-white/80 shadow-lg shadow-gray-400/5 backdrop-blur-xl",
  );

  /** Recharts draws slightly outside the SVG box; `overflow-hidden` on the card clips the whole chart. */
  const chartCardClass = cn(
    "rounded-2xl border",
    isDark ? "border-white/10 bg-[#121218]/75 shadow-xl backdrop-blur-xl" : "border-gray-200/90 bg-white/80 shadow-lg shadow-gray-400/5 backdrop-blur-xl",
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-16 sm:gap-20 lg:gap-24"
    >
      {/* Page intro */}
      <header className="space-y-3">
        <h1 className={cn("text-2xl font-semibold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-gray-900")}>
          Overview
        </h1>
        <p className={cn("max-w-2xl text-sm leading-relaxed sm:text-base", isDark ? "text-gray-400" : "text-gray-600")}>
          Key metrics for your workspace — totals, verification, desktop activity, growth, and open moderation items.
        </p>
      </header>

      {loading && !stats ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500/40 border-t-purple-500" />
        </div>
      ) : stats ? (
        <div className="flex flex-col" style={{ gap: '32px' }}>
        <section className="flex flex-col" aria-label="Key metrics">
          <motion.div 
            initial="hidden" animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid sm:grid-cols-2 xl:grid-cols-4"
            style={{ gap: '32px' }}
          >
            <StatCard 
              label="Total users" 
              value={stats.totalUsers} 
              icon={Users} 
              footnote="All registered accounts" 
              isDark={isDark} 
              iconColor="#2563eb" 
              glowClass={isDark ? "from-blue-600/20 to-blue-600/10" : "from-blue-600/15 to-blue-600/8"}
            />
            <StatCard 
              label="Verified" 
              value={stats.verifiedUsers} 
              icon={UserCheck} 
              footnote={`${verifiedPct}% of total`} 
              isDark={isDark} 
              iconColor="#059669" 
              glowClass={isDark ? "from-emerald-600/20 to-emerald-600/10" : "from-emerald-600/15 to-emerald-600/8"}
            />
            <StatCard 
              label="Unverified" 
              value={stats.unverifiedUsers} 
              icon={UserX} 
              footnote="Awaiting or incomplete verification" 
              isDark={isDark} 
              iconColor="#f97316" 
              glowClass={isDark ? "from-orange-500/20 to-orange-500/10" : "from-orange-500/15 to-orange-500/8"}
            />
            <StatCard
              label="Desktop active (last hour)"
              value={stats.usersActiveDesktopLastHour}
              icon={Monitor}
              footnote="Users with recent agent sync"
              isDark={isDark}
              iconColor="#0891b2"
              glowClass={isDark ? "from-cyan-600/20 to-cyan-600/10" : "from-cyan-600/15 to-cyan-600/8"}
            />
          </motion.div>
        </section>

        <section className="flex flex-col" aria-label="Charts">
          {/* Two columns with a wide gutter: signups + verification | reports + activity */}
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-2" style={{ gap: '32px' }}>
            <div className="flex min-w-0 flex-col" style={{ gap: '32px' }}>
            <StatCard 
              label="New signups (7 days)" 
              value={stats.newUsersLast7Days} 
              icon={TrendingUp} 
              footnote="Rolling window" 
              isDark={isDark} 
              iconColor="#9333ea" 
              glowClass={isDark ? "from-purple-600/20 to-purple-600/10" : "from-purple-600/15 to-purple-600/8"}
            />
            <Card className={chartCardClass}>
              <CardHeader className={cn("px-6 pb-2 pt-6", isDark ? "border-b border-white/10" : "border-b border-gray-200/90")}>
                <CardTitle className={cn("text-base font-semibold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                  Verification mix
                </CardTitle>
                <CardDescription className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>
                  Share of verified vs unverified accounts ({stats.totalUsers} total).
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 px-4 pb-6 pt-2">
                {stats.totalUsers > 0 ? (
                  <>
                    <div
                      ref={pieHost.ref}
                      data-chart-host="verification-pie"
                      className="relative w-full min-w-0 shrink-0"
                      style={{ height: PIE_HOST_PX, minHeight: PIE_HOST_PX, boxSizing: "border-box" }}
                    >
                      {pieHost.width > 48 ? (
                        <VerificationMixChart
                          width={pieHost.width}
                          height={PIE_HOST_PX}
                          stats={stats}
                          isDark={isDark}
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-full items-center justify-center rounded-lg border border-dashed text-xs",
                            isDark ? "border-white/15 text-gray-500" : "border-gray-200 text-gray-500",
                          )}
                        >
                          {pieHost.width === 0 ? "Preparing chart…" : `Chart width too small (${pieHost.width}px).`}
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm mt-2",
                        isDark ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_VERIFIED }} />
                        Verified ({stats.verifiedUsers})
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CHART_UNVERIFIED }} />
                        Unverified ({stats.unverifiedUsers})
                      </span>
                    </div>
                  </>
                ) : (
                  <p className={cn("py-16 text-center text-sm", isDark ? "text-gray-500" : "text-gray-500")}>No users yet.</p>
                )}
              </CardContent>
            </Card>
            </div>

            <div className="flex min-w-0 flex-col" style={{ gap: '32px' }}>
            <StatCard
              label="Open chat reports"
              value={stats.openChatReports}
              icon={MessageSquareWarning}
              footnote="Needs review"
              href="/admin/chat-reports?status=open"
              isDark={isDark}
              iconColor="#e11d48"
              glowClass={isDark ? "from-rose-600/20 to-rose-600/10" : "from-rose-600/15 to-rose-600/8"}
            />
            <Card className={chartCardClass}>
              <CardHeader className={cn("px-6 pb-2 pt-6", isDark ? "border-b border-white/10" : "border-b border-gray-200/90")}>
                <CardTitle className={cn("text-base font-semibold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                  Activity snapshot
                </CardTitle>
                <CardDescription className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>
                  Desktop presence, recent growth, and open moderation queue.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-6 pt-2 sm:px-4">
                <div
                  ref={barHost.ref}
                  data-chart-host="activity-bar"
                  className="relative w-full min-w-0"
                  style={{ height: BAR_HOST_PX, minHeight: BAR_HOST_PX, boxSizing: "border-box" }}
                >
                  {barHost.width > 48 ? (
                    <ActivitySnapshotChart
                      width={barHost.width}
                      height={BAR_HOST_PX}
                      stats={stats}
                      isDark={isDark}
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-full items-center justify-center rounded-lg border border-dashed text-xs",
                        isDark ? "border-white/15 text-gray-500" : "border-gray-200 text-gray-500",
                      )}
                    >
                      {barHost.width === 0 ? "Preparing chart…" : `Chart width too small (${barHost.width}px).`}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </section>
        </div>
      ) : null}

      <div className="h-12 sm:h-16 lg:h-24 shrink-0" aria-hidden="true" />

      <section aria-label="User directory">
        <Card className={cardClass}>
          <CardHeader
            className={cn(
              "flex flex-col gap-6 px-8 pb-8 pt-10 sm:flex-row sm:items-end sm:justify-between lg:px-10 lg:pt-12",
              isDark ? "border-b border-white/10" : "border-b border-gray-200/90",
            )}
          >
            <div className="space-y-1.5">
              <CardTitle className={cn("text-xl font-semibold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                Users
              </CardTitle>
              <CardDescription className={cn("text-sm leading-relaxed", isDark ? "text-gray-500" : "text-gray-600")}>
                Paginated directory. Message content is never shown here. Filter by verification if needed.
              </CardDescription>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Select
                value={verifiedFilter}
                onValueChange={(v) => {
                  setVerifiedFilter(v as "all" | "true" | "false");
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-10 w-[180px] rounded-xl",
                    isDark ? "border-white/10 bg-white/5 text-gray-200" : "border-gray-200 bg-white/90 text-gray-900",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? "border-white/10 bg-[#1a1a24] text-gray-100" : "border-gray-200 bg-white text-gray-900"}>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Verified only</SelectItem>
                  <SelectItem value="false">Unverified only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-0">
            <div className="overflow-x-auto px-1 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow className={cn("hover:bg-transparent", isDark ? "border-white/10" : "border-gray-200")}>
                    <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Name</TableHead>
                    <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Email</TableHead>
                    <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Status</TableHead>
                    <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Role</TableHead>
                    <TableHead className={cn("h-12 px-6 font-medium whitespace-nowrap", isDark ? "text-gray-400" : "text-gray-600")}>
                      Last desktop sync
                    </TableHead>
                    <TableHead className={cn("h-12 px-6 font-medium whitespace-nowrap", isDark ? "text-gray-400" : "text-gray-600")}>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow
                      key={u.id}
                      className={cn(isDark ? "border-white/10 hover:bg-white/[0.04]" : "border-gray-200 hover:bg-gray-50/90")}
                    >
                      <TableCell className={cn("px-6 py-4 font-medium", isDark ? "text-white" : "text-gray-900")}>{u.name || "—"}</TableCell>
                      <TableCell className={cn("max-w-[220px] truncate px-6 py-4", isDark ? "text-gray-300" : "text-gray-700")}>{u.email}</TableCell>
                      <TableCell className={cn("px-6 py-4", isDark ? "text-gray-300" : "text-gray-700")}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            u.isVerified
                              ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300 dark:ring-emerald-500/25"
                              : "bg-amber-500/12 text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-200 dark:ring-amber-500/20"
                          }`}
                        >
                          {u.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </TableCell>
                      <TableCell className={cn("px-6 py-4", isDark ? "text-gray-300" : "text-gray-700")}>{u.role}</TableCell>
                      <TableCell className={cn("whitespace-nowrap px-6 py-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                        {formatSync(u.activity_sync_at)}
                      </TableCell>
                      <TableCell className={cn("whitespace-nowrap px-6 py-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                        {formatSync(u.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!users.length ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className={cn("px-6 py-16 text-center text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                        No users match this filter.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>

            <div
              className={cn(
                "flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
                isDark ? "border-t border-white/10" : "border-t border-gray-200/90",
              )}
            >
              <span className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>
                {totalUsers === 0
                  ? "0 users"
                  : `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, totalUsers)} of ${totalUsers}`}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className={cn(
                    "h-9 rounded-lg",
                    isDark
                      ? "border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
                  )}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  className={cn(
                    "h-9 rounded-lg",
                    isDark
                      ? "border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
                  )}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
