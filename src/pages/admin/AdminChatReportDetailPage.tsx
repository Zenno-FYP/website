import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchAdminChatReportDetail,
  patchAdminChatReport,
  type AdminChatReportDetail,
} from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type { SiteTheme } from "@/hooks/useSiteTheme";
import { motion } from "motion/react";

type AdminOutletContext = { theme?: SiteTheme };

export function AdminChatReportDetailPage() {
  const outlet = useOutletContext<AdminOutletContext>();
  const theme: SiteTheme = outlet?.theme ?? "dark";
  const isDark = theme === "dark";

  const { reportId } = useParams<{ reportId: string }>();
  const [detail, setDetail] = useState<AdminChatReportDetail | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [patching, setPatching] = useState(false);

  const load = useCallback(async () => {
    if (!reportId) return;
    const d = await fetchAdminChatReportDetail(reportId);
    setDetail(d);
    setAdminNote(d.admin_note ?? "");
  }, [reportId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load()
      .catch(() => {
        if (!cancelled) toast.error("Could not load report.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function applyStatus(next: "dismissed" | "reviewed") {
    if (!reportId) return;
    setPatching(true);
    try {
      await patchAdminChatReport(reportId, {
        status: next,
        admin_note: adminNote.trim() || undefined,
      });
      toast.success(next === "dismissed" ? "Dismissed" : "Marked reviewed");
      await load();
    } catch {
      toast.error("Could not update report.");
    } finally {
      setPatching(false);
    }
  }

  if (!reportId) {
    return <p className={cn("text-gray-500", isDark ? "text-gray-400" : "text-gray-600")}>Invalid report.</p>;
  }

  if (loading || !detail) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className={cn("h-8 w-8 animate-spin", isDark ? "text-purple-400" : "text-purple-600")} />
      </div>
    );
  }

  const cardClass = cn(
    "rounded-2xl border p-8 sm:p-10 shadow-sm backdrop-blur-xl transition-all duration-200",
    isDark ? "border-white/10 bg-[#121218]/80" : "border-gray-200/90 bg-white/80"
  );
  
  const headingClass = cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-gray-500" : "text-gray-500");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-5xl"
    >
      <div>
        <Button variant="ghost" size="sm" className={cn("mb-4", isDark ? "text-gray-400 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")} asChild>
          <Link to="/admin/chat-reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Link>
        </Button>
        <h1 className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Report Details</h1>
        <p className={cn("mt-1 text-sm", isDark ? "text-gray-500" : "text-gray-600")}>
          Status: <span className={cn("font-medium", isDark ? "text-gray-300" : "text-gray-800")}>{detail.status}</span>
          {detail.resolved_at ? (
            <span className="ml-2">· Resolved {new Date(detail.resolved_at).toLocaleString()}</span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          <section className={cardClass}>
            <h2 className={headingClass}>Reporter</h2>
            <p className={cn("mt-2 font-medium", isDark ? "text-white" : "text-gray-900")}>{detail.reporter?.name ?? "—"}</p>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>{detail.reporter?.email}</p>
            
            <div className={cn("my-6 border-t", isDark ? "border-white/10" : "border-gray-200")} />
            
            <h2 className={headingClass}>Reason</h2>
            <p className={cn("mt-2 whitespace-pre-wrap", isDark ? "text-gray-200" : "text-gray-800")}>{detail.reason || "—"}</p>
          </section>

          <section className={cardClass}>
            <h2 className={headingClass}>Participants</h2>
            <ul className="mt-3 space-y-3">
              {detail.participants.map((p) => (
                <li key={p.id} className={cn("flex flex-col gap-0.5", isDark ? "text-gray-200" : "text-gray-800")}>
                  <span className="font-medium">{p.name}</span>
                  <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>{p.email}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <section className={cardClass}>
            <h2 className={headingClass}>
              Recent messages (last {detail.messages_preview_count})
            </h2>
            <div className="mt-5 space-y-4">
              {detail.messages_preview.map((m) => (
                <div key={m.id} className={cn("rounded-xl border p-4", isDark ? "border-white/5 bg-black/20" : "border-gray-100 bg-gray-50/50")}>
                  <p className={cn("text-xs font-medium", isDark ? "text-gray-500" : "text-gray-500")}>
                    {m.sender.name} <span className="mx-1 opacity-50">·</span> {new Date(m.created_at).toLocaleString()}
                  </p>
                  <p className={cn("mt-2 text-sm whitespace-pre-wrap leading-relaxed", isDark ? "text-gray-200" : "text-gray-800")}>{m.body}</p>
                </div>
              ))}
              {!detail.messages_preview.length ? (
                <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>No messages in preview.</p>
              ) : null}
            </div>
          </section>

          <section className={cn(cardClass, "space-y-4")}>
            <h2 className={headingClass}>Internal note & Actions</h2>
            <Textarea
              id="admin-chat-report-internal-note"
              name="adminInternalNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional note for other admins…"
              autoComplete="off"
              className={cn("min-h-[120px] rounded-xl resize-none", isDark ? "border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-600 focus-visible:ring-purple-500/50" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#5B6FD8]/50")}
            />
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {detail.status !== "open" ? (
                <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>This report is no longer open.</p>
              ) : <div />}
              
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={patching || detail.status !== "open"}
                  className={cn("rounded-xl border shadow-sm", isDark ? "border-white/10 hover:bg-white/10 text-white" : "border-gray-300 hover:bg-gray-100 text-gray-800")}
                  onClick={() => void applyStatus("dismissed")}
                >
                  Dismiss
                </Button>
                <Button
                  type="button"
                  disabled={patching || detail.status !== "open"}
                  className="rounded-xl shadow-md bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white hover:opacity-90 transition-opacity"
                  onClick={() => void applyStatus("reviewed")}
                >
                  Mark reviewed
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
