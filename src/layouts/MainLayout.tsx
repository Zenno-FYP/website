import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useFirebaseUser, useLogout, useUser } from "@/stores/useAuthHooks";
import { fetchChatConversations, type ChatConversationSummary } from "@/services/api";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  MessageCircle,
  Bot,
  Settings,
  Sparkles,
  LogOut,
  UserCircle,
  UsersRound,
  Loader2,
  TrendingUp,
  Target,
} from "lucide-react";

interface MainLayoutProps {
  theme: "light" | "dark";
  onThemeChange: (t: "light" | "dark") => void;
}

export function MainLayout({ theme, onThemeChange }: MainLayoutProps) {
  const navigate = useNavigate();
  const firebaseUser = useFirebaseUser();
  const profileUser = useUser();
  const logout = useLogout();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [headerRecentChats, setHeaderRecentChats] = useState<ChatConversationSummary[]>([]);
  const [headerChatsLoading, setHeaderChatsLoading] = useState(false);

  const loadHeaderChats = useCallback(async () => {
    if (!firebaseUser) return;
    setHeaderChatsLoading(true);
    try {
      const list = await fetchChatConversations();
      setHeaderRecentChats(list.slice(0, 8));
    } catch {
      setHeaderRecentChats([]);
    } finally {
      setHeaderChatsLoading(false);
    }
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`min-h-screen relative transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0a0a0f]"
          : "bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {theme === "dark" && (
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        )}
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent"
              : ""
          }`}
        />
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            theme === "dark"
              ? "bg-gradient-to-br from-purple-600/15 to-blue-600/8"
              : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            theme === "dark"
              ? "bg-gradient-to-br from-purple-600/15 to-[#7C4DFF]/8"
              : "bg-gradient-to-br from-purple-400/8 to-purple-300/4"
          }`}
          style={{ animationDelay: "2s" }}
        />
        {theme === "dark" && (
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 to-transparent rotate-12 transform translate-x-1/3 -translate-y-1/3 blur-2xl" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav
          className={`backdrop-blur-2xl fixed top-0 left-0 right-0 z-40 shadow-sm transition-colors duration-500 ${
            theme === "dark"
              ? "bg-[#0f0f14]/90 border-b border-white/10"
              : "bg-white/80 border-b border-white/40"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#0f0f14]/50 via-transparent to-[#0f0f14]/50"
                : "bg-gradient-to-r from-white/50 via-transparent to-white/50"
            }`}
          />
          <div className="px-8 py-4 relative z-10">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                </div>
              </div>

              <div className="flex-1" />

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Messages Dropdown */}
                <DropdownMenu onOpenChange={(open) => { if (open) void loadHeaderChats(); }}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`relative w-10 h-10 rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                          : "bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50"
                      }`}
                    >
                      <MessageCircle
                        className={`w-5 h-5 transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 group-hover:text-purple-400"
                            : "text-gray-600 group-hover:text-[#5B6FD8]"
                        }`}
                      />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    collisionPadding={8}
                    className={`w-80 rounded-xl shadow-2xl border backdrop-blur-2xl z-50 ${
                      theme === "dark"
                        ? "bg-[#121218]/95 border-white/10"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <DropdownMenuLabel
                      className={`px-4 py-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Recent Chats
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <div className="max-h-96 overflow-y-auto px-2 py-1">
                      {headerChatsLoading ? (
                        <div
                          className={`flex items-center justify-center gap-2 py-6 text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading…
                        </div>
                      ) : headerRecentChats.length === 0 ? (
                        <p
                          className={`px-3 py-4 text-center text-sm ${
                            theme === "dark" ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          No recent chat
                        </p>
                      ) : (
                        headerRecentChats.map((c) => (
                          <DropdownMenuItem
                            key={c.id}
                            onClick={() =>
                              navigate("/chats", {
                                state: { initialPeerUserId: c.other_user.id },
                              })
                            }
                            className={`p-3 cursor-pointer my-1.5 rounded-lg shadow-sm ${
                              theme === "dark"
                                ? "hover:bg-white/10 focus:bg-white/10 hover:shadow-md"
                                : "hover:bg-gray-100 focus:bg-gray-100 hover:shadow-md bg-white/50"
                            }`}
                          >
                            <div className="flex flex-1 min-w-0 items-center gap-3">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage
                                  src={c.other_user.profilePhoto ?? undefined}
                                  alt={c.other_user.name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-sm text-white">
                                  {c.other_user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate font-medium ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {c.other_user.name}
                                </p>
                                <p
                                  className={`truncate text-xs ${
                                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {c.last_message_text || "Say hello…"}
                                </p>
                              </div>
                              {c.unread_count > 0 ? (
                                <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-[#5B6FD8] px-1 text-[10px] text-white">
                                  {c.unread_count > 9 ? "9+" : c.unread_count}
                                </span>
                              ) : null}
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <DropdownMenuItem
                      onClick={() => navigate("/chats")}
                      className={`p-3 cursor-pointer mx-2 my-1 rounded-lg justify-center ${
                        theme === "dark"
                          ? "hover:bg-white/10 focus:bg-white/10 text-purple-400"
                          : "hover:bg-gray-100 focus:bg-gray-100 text-[#5B6FD8]"
                      }`}
                    >
                      <span className="text-sm">View all chats</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications — unchanged, copied verbatim */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`relative w-10 h-10 rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                          : "bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50"
                      }`}
                    >
                      <Bell
                        className={`w-5 h-5 transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 group-hover:text-purple-400"
                            : "text-gray-600 group-hover:text-[#5B6FD8]"
                        }`}
                      />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={`w-80 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
                      theme === "dark"
                        ? "bg-gray-900/95 border-white/10"
                        : "bg-white/95 border-gray-200/50"
                    }`}
                  >
                    <DropdownMenuLabel
                      className={`text-base px-4 py-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <div className="max-h-96 overflow-y-auto">
                      <DropdownMenuItem
                        className={`px-4 py-3 cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/5 focus:bg-white/5"
                            : "hover:bg-gray-100/80 focus:bg-gray-100/80"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-0.5 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              New productivity milestone!
                            </p>
                            <p
                              className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              You've coded 40+ hours this week
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`px-4 py-3 cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/5 focus:bg-white/5"
                            : "hover:bg-gray-100/80 focus:bg-gray-100/80"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-0.5 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Zenno Agent suggestion
                            </p>
                            <p
                              className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Try optimizing your morning workflow
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              5 hours ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`px-4 py-3 cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/5 focus:bg-white/5"
                            : "hover:bg-gray-100/80 focus:bg-gray-100/80"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FFC93D] flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-0.5 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              TypeScript usage increased
                            </p>
                            <p
                              className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              +18% compared to last month
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              1 day ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`px-4 py-3 cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/5 focus:bg-white/5"
                            : "hover:bg-gray-100/80 focus:bg-gray-100/80"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#FF8FA3] flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-0.5 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              New message from Sarah
                            </p>
                            <p
                              className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Check out the new design mockups
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`px-4 py-3 cursor-pointer ${
                          theme === "dark"
                            ? "hover:bg-white/5 focus:bg-white/5"
                            : "hover:bg-gray-100/80 focus:bg-gray-100/80"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium mb-0.5 ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Weekly goal achieved
                            </p>
                            <p
                              className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              You completed all your tasks!
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              3 days ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <DropdownMenuItem
                      className={`px-4 py-2.5 cursor-pointer text-center justify-center ${
                        theme === "dark"
                          ? "text-purple-400 hover:bg-white/5 focus:bg-white/5"
                          : "text-[#5B6FD8] hover:bg-gray-100/80 focus:bg-gray-100/80"
                      }`}
                    >
                      <span className="text-sm font-medium">View all notifications</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Divider */}
                <div
                  className={`w-px h-6 mx-1 ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-300"
                  }`}
                />

                {/* User Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`relative rounded-xl backdrop-blur-xl transition-all duration-300 group flex items-center gap-2 px-2 py-1.5 ${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                          : "bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50"
                      }`}
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarImage
                          src={
                            profileUser?.profilePhoto ??
                            firebaseUser?.photoURL ??
                            undefined
                          }
                          alt={
                            profileUser?.name ??
                            firebaseUser?.displayName ??
                            "Account"
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white text-xs">
                          {(
                            profileUser?.name ||
                            firebaseUser?.displayName ||
                            "?"
                          )
                            .split(/\s+/)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    collisionPadding={8}
                    className={`w-56 rounded-xl shadow-2xl border backdrop-blur-2xl z-50 ${
                      theme === "dark"
                        ? "bg-[#121218]/95 border-white/10"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <DropdownMenuLabel
                      className={theme === "dark" ? "text-white" : "text-gray-900"}
                    >
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === "dark"
                          ? "hover:bg-white/10 focus:bg-white/10"
                          : "hover:bg-gray-100 focus:bg-gray-100"
                      }`}
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        Profile
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/peers")}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === "dark"
                          ? "hover:bg-white/10 focus:bg-white/10"
                          : "hover:bg-gray-100 focus:bg-gray-100"
                      }`}
                    >
                      <UsersRound className="mr-2 h-4 w-4" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        Find peers
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsSettingsOpen(true)}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === "dark"
                          ? "hover:bg-white/10 focus:bg-white/10"
                          : "hover:bg-gray-100 focus:bg-gray-100"
                      }`}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span
                        className={
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        Settings
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator
                      className={theme === "dark" ? "bg-white/10" : "bg-gray-200"}
                    />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className={`cursor-pointer rounded-lg mx-2 my-1 ${
                        theme === "dark"
                          ? "hover:bg-red-500/10 focus:bg-red-500/10 text-red-400"
                          : "hover:bg-red-50 focus:bg-red-50 text-red-600"
                      }`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="px-8 py-6 pt-24">
          <Outlet context={{ theme }} />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={onThemeChange}
      />

      {/* Toast Notifications */}
      <Toaster theme={theme} position="top-right" richColors />
    </div>
  );
}
