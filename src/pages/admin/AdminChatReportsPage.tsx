import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminChatReports,
  type AdminChatReportListItem,
} from "@/services/adminApi";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type { SiteTheme } from "@/hooks/useSiteTheme";
import { useOutletContext } from "react-router-dom";
import { motion } from "motion/react";

const STATUSES = ["all", "open", "dismissed", "reviewed", "action_taken"] as const;

type AdminOutletContext = { theme?: SiteTheme };

export function AdminChatReportsPage() {
  const outlet = useOutletContext<AdminOutletContext>();
  const theme: SiteTheme = outlet?.theme ?? "dark";
  const isDark = theme === "dark";

  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "open";
  const safeStatus = STATUSES.includes(initialStatus as (typeof STATUSES)[number])
    ? initialStatus
    : "open";

  const [items, setItems] = useState<AdminChatReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>(safeStatus);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const r = await fetchAdminChatReports({
      page,
      limit,
      status: status === "all" ? undefined : status,
    });
    setItems(r.items);
    setTotal(r.total);
    setTotalPages(r.totalPages);
  }, [page, limit, status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load()
      .catch(() => {
        if (!cancelled) toast.error("Could not load chat reports.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  function onStatusChange(next: string) {
    setStatus(next);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (next === "open") nextParams.delete("status");
    else nextParams.set("status", next);
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-12 sm:gap-16"
    >
      <header className="space-y-3">
        <h1 className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Chat reports</h1>
        <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>Review reports submitted from web and mobile chat.</p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-600")}>Status</span>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className={cn("w-[180px]", isDark ? "border-white/10 bg-white/5 text-gray-200" : "border-gray-200 bg-white/90 text-gray-900")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={isDark ? "border-white/10 bg-[#1a1a24] text-gray-100" : "border-gray-200 bg-white text-gray-900"}>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="action_taken">Action taken</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className={cn("overflow-hidden rounded-2xl border shadow-sm backdrop-blur-xl", isDark ? "border-white/10 bg-[#121218]/80" : "border-gray-200/90 bg-white/80")}>
            <Table>
              <TableHeader>
                <TableRow className={cn("hover:bg-transparent", isDark ? "border-white/10" : "border-gray-200")}>
                  <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Reporter</TableHead>
                  <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Reason</TableHead>
                  <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Status</TableHead>
                  <TableHead className={cn("h-12 px-6 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Created</TableHead>
                  <TableHead className={cn("w-[120px]", isDark ? "text-gray-400" : "text-gray-600")} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id} className={cn(isDark ? "border-white/10 hover:bg-white/[0.04]" : "border-gray-200 hover:bg-gray-50/90")}>
                    <TableCell className={cn("px-6 py-4", isDark ? "text-gray-200" : "text-gray-900")}>
                      {row.reporter?.name || "—"}
                      <span className={cn("block text-xs", isDark ? "text-gray-500" : "text-gray-500")}>{row.reporter?.email}</span>
                    </TableCell>
                    <TableCell className={cn("max-w-[240px] truncate px-6 py-4", isDark ? "text-gray-400" : "text-gray-700")}>
                      {row.reason || "—"}
                    </TableCell>
                    <TableCell className={cn("px-6 py-4", isDark ? "text-gray-300" : "text-gray-800")}>{row.status}</TableCell>
                    <TableCell className={cn("px-6 py-4 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Button variant="outline" size="sm" className={cn("bg-transparent", isDark ? "border-white/20 hover:bg-white/10 text-gray-200" : "border-gray-300 hover:bg-gray-100 text-gray-800")} asChild>
                        <Link to={`/admin/chat-reports/${row.id}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!items.length ? (
                  <TableRow className={cn(isDark ? "border-white/10" : "border-gray-200")}>
                    <TableCell colSpan={5} className={cn("py-10 text-center", isDark ? "text-gray-500" : "text-gray-500")}>
                      No reports match this filter.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className={cn("flex items-center justify-between text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            <span>
              {total === 0
                ? "0 reports"
                : `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className={cn("bg-transparent h-9 rounded-lg", isDark ? "border-white/20 hover:bg-white/10 text-gray-200" : "border-gray-300 hover:bg-gray-100 text-gray-800")}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className={cn("bg-transparent h-9 rounded-lg", isDark ? "border-white/20 hover:bg-white/10 text-gray-200" : "border-gray-300 hover:bg-gray-100 text-gray-800")}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
