import { useCallback, useEffect, useState } from "react";
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

type AdminOutletContext = { theme?: SiteTheme };

function StatCard({
  label,
  value,
  icon: Icon,
  footnote,
  href,
  isDark,
  gradientClass,
  glowClass,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  footnote?: string;
  href?: string;
  isDark: boolean;
  gradientClass?: string;
  glowClass?: string;
}) {
  const defaultGradient = "from-[#5B6FD8] to-[#7C4DFF]";
  const grad = gradientClass || defaultGradient;
  const glow = glowClass || (isDark ? "from-[#5B6FD8]/20 to-[#7C4DFF]/10" : "from-[#5B6FD8]/15 to-[#7C4DFF]/8");

  const inner = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 shadow-lg backdrop-blur-xl transition-colors duration-200",
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
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ring-2 ring-white/40", grad)}>
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
        <section className="flex flex-col gap-8" aria-label="Key metrics">
          <motion.div 
            initial="hidden" animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <StatCard 
              label="Total users" 
              value={stats.totalUsers} 
              icon={Users} 
              footnote="All registered accounts" 
              isDark={isDark} 
              gradientClass="from-blue-600 to-indigo-600" 
              glowClass={isDark ? "from-blue-600/20 to-indigo-600/10" : "from-blue-600/15 to-indigo-600/8"}
            />
            <StatCard 
              label="Verified" 
              value={stats.verifiedUsers} 
              icon={UserCheck} 
              footnote={`${verifiedPct}% of total`} 
              isDark={isDark} 
              gradientClass="from-emerald-600 to-teal-600" 
              glowClass={isDark ? "from-emerald-600/20 to-teal-600/10" : "from-emerald-600/15 to-teal-600/8"}
            />
            <StatCard 
              label="Unverified" 
              value={stats.unverifiedUsers} 
              icon={UserX} 
              footnote="Awaiting or incomplete verification" 
              isDark={isDark} 
              gradientClass="from-orange-500 to-red-600" 
              glowClass={isDark ? "from-orange-500/20 to-red-600/10" : "from-orange-500/15 to-red-600/8"}
            />
            <StatCard
              label="Desktop active (last hour)"
              value={stats.usersActiveDesktopLastHour}
              icon={Monitor}
              footnote="Users with recent agent sync"
              isDark={isDark}
              gradientClass="from-cyan-600 to-blue-600"
              glowClass={isDark ? "from-cyan-600/20 to-blue-600/10" : "from-cyan-600/15 to-blue-600/8"}
            />
            <StatCard 
              label="New signups (7 days)" 
              value={stats.newUsersLast7Days} 
              icon={TrendingUp} 
              footnote="Rolling window" 
              isDark={isDark} 
              gradientClass="from-purple-600 to-fuchsia-600" 
              glowClass={isDark ? "from-purple-600/20 to-fuchsia-600/10" : "from-purple-600/15 to-fuchsia-600/8"}
            />
            <StatCard
              label="Open chat reports"
              value={stats.openChatReports}
              icon={MessageSquareWarning}
              footnote="Needs review"
              href="/admin/chat-reports?status=open"
              isDark={isDark}
              gradientClass="from-rose-600 to-red-600"
              glowClass={isDark ? "from-rose-600/20 to-red-600/10" : "from-rose-600/15 to-red-600/8"}
            />
          </motion.div>
        </section>
      ) : null}

      <div className="h-12 sm:h-16 lg:h-24 shrink-0" aria-hidden="true" />

      <section aria-label="User directory">
        <Card className={cardClass}>
          <CardHeader
            className={cn(
              "flex flex-col gap-5 px-6 pb-6 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
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
              <span className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Verified</span>
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
