import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from "@/services/api";
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  FolderPlus,
  BarChart3,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { NotificationListSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

function notifIcon(type: string) {
  switch (type) {
    case "chat_message":
      return { gradient: "from-[#FF6B9D] to-[#FF8FA3]", icon: <MessageCircle className="w-5 h-5 text-white" /> };
    case "new_project":
      return { gradient: "from-[#4ECDC4] to-[#44A6A0]", icon: <FolderPlus className="w-5 h-5 text-white" /> };
    case "daily_digest":
      return { gradient: "from-[#5B6FD8] to-[#7C4DFF]", icon: <BarChart3 className="w-5 h-5 text-white" /> };
    case "test":
      return { gradient: "from-emerald-500 to-teal-600", icon: <Bell className="w-5 h-5 text-white" /> };
    default:
      return { gradient: "from-purple-500 to-purple-600", icon: <Bell className="w-5 h-5 text-white" /> };
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationsPage() {
  const { theme } = useOutletContext<{ theme: "light" | "dark" }>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await fetchNotifications(p);
      setItems((prev) => (p === 1 ? data.items : [...prev, ...data.items]));
      setHasMore(data.hasMore);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
    } catch {
      toast.error("Could not update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })),
      );
    } catch {
      toast.error("Could not mark all as read.");
    }
  };

  const handleClick = (n: NotificationItem) => {
    if (!n.read_at) void handleMarkRead(n._id);
    if (n.type === "chat_message") {
      const conversationId = n.data?.conversationId;
      const senderUserId = n.data?.senderUserId;
      if (conversationId) {
        navigate("/chats", { state: { initialConversationId: conversationId } });
      } else if (senderUserId) {
        navigate("/chats", { state: { initialPeerUserId: senderUserId } });
      } else {
        navigate("/chats");
      }
    } else if (n.type === "new_project") {
      const projectName = n.data?.projectName;
      if (projectName) {
        navigate(`/projects/${encodeURIComponent(projectName)}`);
      } else {
        navigate("/dashboard");
      }
    } else if (n.type === "test") {
      navigate("/notifications");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back to dashboard"
            onClick={() => navigate("/dashboard")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 ${
              theme === "dark"
                ? "bg-white/5 hover:bg-white/10 border border-white/10 focus-visible:ring-offset-[#0a0a0f]"
                : "bg-white/40 hover:bg-white/60 border border-white/30 focus-visible:ring-offset-white"
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
          </button>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Notifications
          </h1>
        </div>
        <button
          onClick={() => void handleMarkAllRead()}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
            theme === "dark"
              ? "text-purple-400 hover:bg-white/5"
              : "text-[#5B6FD8] hover:bg-gray-100"
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {/* First-load skeleton: render shimmer placeholders instead of the
            small spinner so the page does not look empty before the first
            batch arrives. */}
        {loading && items.length === 0 && (
          <NotificationListSkeleton theme={theme} count={6} />
        )}

        <AnimatePresence initial={false}>
        {items.map((n) => {
          const ic = notifIcon(n.type);
          return (
            <motion.div
              key={n._id}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.22, ease: "easeOut" }}
              onClick={() => handleClick(n)}
              className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                theme === "dark"
                  ? `${!n.read_at ? "bg-white/[0.06] border-purple-500/20" : "bg-white/[0.02] border-white/5"} border hover:bg-white/10`
                  : `${!n.read_at ? "bg-[#5B6FD8]/[0.04] border-[#5B6FD8]/15" : "bg-white/40 border-gray-200/50"} border hover:bg-gray-50`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ic.gradient} flex items-center justify-center shrink-0`}>
                {ic.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {n.title}
                </p>
                <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {n.body}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {timeAgo(n.created_at)}
                  </span>
                  {!n.read_at && <span className="w-2 h-2 rounded-full bg-[#5B6FD8]" />}
                </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {loading && items.length > 0 && (
          <div className={`flex items-center justify-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className={`text-center py-16 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm mt-1">You'll see new activity, messages, and digest summaries here.</p>
          </div>
        )}

        {hasMore && !loading && (
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              void load(next);
            }}
            className={`w-full py-3 text-sm font-medium rounded-xl transition-all ${
              theme === "dark"
                ? "text-purple-400 hover:bg-white/5 border border-white/10"
                : "text-[#5B6FD8] hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
