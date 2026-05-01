import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { fetchAdminStats } from "@/services/adminApi";
import { useFirebaseUser, useIsCheckingAuth } from "@/stores/useAuthHooks";
import { useSiteTheme } from "@/hooks/useSiteTheme";
import { LayoutDashboard, MessageSquareWarning, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { ZennoShellBackground } from "./ZennoShellBackground";

function AdminSpinner({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center transition-colors duration-500",
        theme === "dark"
          ? "bg-[#0a0a0f] text-gray-300"
          : "bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF] text-gray-600",
      )}
    >
      <ZennoShellBackground theme={theme} />
      <div className="relative z-10 h-8 w-8 animate-spin rounded-full border-2 border-purple-500/40 border-t-purple-500" />
    </div>
  );
}

export function AdminProtectedLayout() {
  const navigate = useNavigate();
  const theme = useSiteTheme();
  const isDark = theme === "dark";
  const isCheckingAuth = useIsCheckingAuth();
  const firebaseUser = useFirebaseUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!firebaseUser) {
      navigate("/auth", { replace: true });
      return;
    }

    let cancelled = false;
    void fetchAdminStats()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const ax = err as AxiosError<{ code?: string; message?: string }>;
        const status = ax.response?.status;
        const code = ax.response?.data?.code;

        if (status === 403 || code === "ADMIN_FORBIDDEN") {
          toast.error("You don’t have admin access. Ask a maintainer to set isAdmin on your user.");
          navigate("/dashboard", { replace: true });
          return;
        }

        if (status === 401 || ax.code === "ERR_NO_FIREBASE_USER") {
          navigate("/auth", { replace: true });
          return;
        }

        toast.error("Could not verify admin session.");
        navigate("/dashboard", { replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, isCheckingAuth, firebaseUser]);

  if (!ready) return <AdminSpinner theme={theme} />;

  return (
    <>
      <Toaster richColors position="top-center" />
      <div
        className={cn(
          "relative flex min-h-screen transition-colors duration-500",
          isDark ? "bg-[#0a0a0f] text-gray-100" : "bg-[#f8f9ff] text-gray-900",
        )}
      >
        <ZennoShellBackground theme={theme} />

        <div className="relative z-10 flex w-full">
          {/* Sidebar */}
          <aside
            className={cn(
              "hidden w-64 flex-col border-r shadow-sm backdrop-blur-xl sm:flex transition-colors duration-500",
              isDark ? "border-white/10 bg-[#0f0f14]/80" : "border-gray-200 bg-white/80",
            )}
          >
            <div className="flex h-16 shrink-0 items-center px-6">
              <Link
                to="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2",
                  isDark ? "ring-offset-[#0a0a0f]" : "ring-offset-white",
                )}
              >
                <div className="h-9 w-9 overflow-hidden rounded-lg shadow-md ring-1 ring-white/15">
                  <img src={logo} alt="Zenno" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-base font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                      Zenno
                    </span>
                    <span
                      className={cn(
                        "rounded bg-gradient-to-r px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        isDark
                          ? "from-[#5B6FD8]/25 to-[#7C4DFF]/25 text-purple-200 ring-1 ring-purple-500/35"
                          : "from-[#5B6FD8]/15 to-[#7C4DFF]/10 text-[#5B6FD8] ring-1 ring-purple-300/60",
                      )}
                    >
                      Admin
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              <p className={cn("px-3 py-2 text-xs font-semibold uppercase tracking-wider", isDark ? "text-gray-500" : "text-gray-400")}>
                Navigation
              </p>
              
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors h-auto",
                  isDark
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  Back to App
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className={cn(
                  "justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors h-auto mt-2",
                  isDark
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Link to="/admin">
                  <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  Dashboard
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className={cn(
                  "justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors h-auto",
                  isDark
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Link to="/admin/chat-reports">
                  <MessageSquareWarning className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  Chat Reports
                </Link>
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <header
              className={cn(
                "flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-8",
                isDark ? "border-white/10 bg-[#0f0f14]/90 backdrop-blur-md" : "border-gray-200 bg-white/90 backdrop-blur-md",
              )}
            >
              <Link
                to="/admin"
                className={cn(
                  "flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 sm:gap-3",
                  isDark ? "focus-visible:ring-offset-[#0f0f14]" : "focus-visible:ring-offset-white",
                )}
              >
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-white/15 sm:hidden">
                  <img src={logo} alt="Zenno" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className={cn("block truncate text-sm font-bold tracking-tight sm:text-base", isDark ? "text-white" : "text-gray-900")}>
                    Zenno Admin
                  </span>
                  <span className={cn("hidden text-xs font-medium sm:block", isDark ? "text-gray-500" : "text-gray-500")}>
                    Console
                  </span>
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={cn(
                    "h-9 gap-1.5 rounded-lg border px-3 font-medium shadow-sm",
                    isDark
                      ? "border-white/15 bg-white/5 text-gray-100 hover:bg-white/10 hover:text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <Link to="/admin/chat-reports" className="inline-flex items-center gap-1.5">
                    <MessageSquareWarning className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
                    <span className="hidden sm:inline">Chat reports</span>
                    <span className="sm:hidden">Reports</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn("h-9 shrink-0 px-3 font-medium", isDark ? "text-gray-300 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}
                >
                  <Link to="/dashboard">
                    <span className="hidden sm:inline">Back to app</span>
                    <span className="sm:hidden">App</span>
                  </Link>
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
                <Outlet context={{ theme }} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
