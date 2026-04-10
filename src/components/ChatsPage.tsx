import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, Search, Send, MessageCircle, Loader2 } from "lucide-react";
import {
  fetchChatConversations,
  fetchChatMessages,
  getBackendOriginForSocket,
  markChatRead,
  openChatWithUser,
  type ChatConversationSummary,
  type ChatMessageItem,
} from "@/services/api";
import { useFirebaseUser, useUser } from "@/stores/useAuthHooks";
import { AxiosError } from "axios";
import { handleApiError } from "@/services/errorHandler";

interface ChatsPageProps {
  theme: "light" | "dark";
  onBack: () => void;
  initialPeerUserId?: string | null;
  onConsumedInitialPeer?: () => void;
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatConvTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return formatMessageTime(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ChatsPage({ theme, onBack, initialPeerUserId, onConsumedInitialPeer }: ChatsPageProps) {
  const firebaseUser = useFirebaseUser();
  const profileUser = useUser();
  const myId = profileUser?._id ?? "";

  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const openingPeerRef = useRef(false);
  const selectedConvRef = useRef<string | null>(null);
  const myIdRef = useRef<string>("");

  selectedConvRef.current = selectedConvId;
  myIdRef.current = myId;

  const loadConversations = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const list = await fetchChatConversations();
      setConversations(list);
    } catch (e: unknown) {
      const msg = e instanceof AxiosError ? handleApiError(e) : "Could not load conversations.";
      setListError(msg);
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations, firebaseUser?.uid]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoadingMessages(true);
      try {
        const rows = await fetchChatMessages(conversationId);
        setMessages(rows);
        await markChatRead(conversationId);
        void loadConversations();
        socketRef.current?.emit("mark_read", { conversationId });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMessages(false);
      }
    },
    [loadConversations],
  );

  useEffect(() => {
    if (!selectedConvId || !myId) return;
    void loadMessages(selectedConvId);
  }, [selectedConvId, myId, loadMessages]);

  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;
    const origin = getBackendOriginForSocket();

    void (async () => {
      const token = await firebaseUser.getIdToken();
      if (cancelled || !token) return;
      const socket = io(`${origin}/chat`, {
        auth: { token },
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;
      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));

      socket.on(
        "chat:new_message",
        (payload: { conversation_id: string; message: ChatMessageItem }) => {
          void fetchChatConversations().then(setConversations).catch(console.error);
          if (selectedConvRef.current === payload.conversation_id) {
            setMessages((m) => {
              if (m.some((x) => x.id === payload.message.id)) return m;
              return [...m, payload.message];
            });
            if (payload.message.sender_id !== myIdRef.current) {
              socket.emit("mark_read", { conversationId: payload.conversation_id });
            }
          }
        },
      );
    })();

    return () => {
      cancelled = true;
      setSocketConnected(false);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (!initialPeerUserId || !firebaseUser || openingPeerRef.current) return;
    openingPeerRef.current = true;
    void (async () => {
      try {
        const convId = await openChatWithUser(initialPeerUserId);
        await loadConversations();
        setSelectedConvId(convId);
        onConsumedInitialPeer?.();
      } catch (e) {
        console.error(e);
      } finally {
        openingPeerRef.current = false;
      }
    })();
  }, [initialPeerUserId, firebaseUser, loadConversations, onConsumedInitialPeer]);

  const filtered = conversations.filter((c) =>
    c.other_user.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const selectedConv = conversations.find((c) => c.id === selectedConvId) ?? null;

  const handleSendMessage = () => {
    const text = messageText.trim();
    if (!text || !selectedConv || !socketConnected) return;
    setSendError(null);
    const recipientUserId = selectedConv.other_user.id;
    socketRef.current.emit(
      "send_message",
      { recipientUserId, text },
      (resp: { ok?: boolean; error?: string }) => {
        if (resp && resp.ok === false) {
          setSendError(resp.error ?? "Could not send message.");
        }
      },
    );
    setMessageText("");
  };

  const panelMuted = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 pointer-events-none z-0">
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
            theme === "dark" ? "bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent" : ""
          }`}
        />
      </div>

      <div
        className={`relative z-10 flex h-full w-full flex-col shadow-2xl backdrop-blur-2xl ${
          theme === "dark" ? "bg-[#121218]/95" : "bg-white/95"
        }`}
      >
        <div
          className={`flex-shrink-0 border-b px-8 py-4 backdrop-blur-xl ${
            theme === "dark" ? "border-white/10 bg-[#0f0f14]/50" : "border-gray-200 bg-white/50"
          }`}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className={`rounded-xl transition-all ${
              theme === "dark"
                ? "text-gray-300 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`flex w-96 flex-col border-r ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
            <div className={`border-b p-4 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
              <h2 className={`mb-4 font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Inbox</h2>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <Input
                  placeholder="Search people…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`rounded-xl pl-10 ${
                    theme === "dark"
                      ? "border-white/10 bg-white/5 text-white placeholder:text-gray-400"
                      : "border-gray-200 bg-gray-50 placeholder:text-gray-500"
                  }`}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {loadingList && !conversations.length ? (
                  <div className={`flex justify-center py-8 ${panelMuted}`}>
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : null}
                {listError ? <p className="px-2 py-4 text-sm text-red-500">{listError}</p> : null}
                {!loadingList && filtered.length === 0 ? (
                  <p className={`px-3 py-6 text-sm ${panelMuted}`}>
                    {conversations.length === 0
                      ? "No conversations yet. Message someone from their profile."
                      : "No matches."}
                  </p>
                ) : null}
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedConvId(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedConvId(c.id);
                      }
                    }}
                    className={`mb-1 cursor-pointer rounded-xl p-3 shadow-sm transition-all ${
                      selectedConvId === c.id
                        ? theme === "dark"
                          ? "border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/10 shadow-md"
                          : "border border-purple-300 bg-gradient-to-br from-purple-100 to-blue-50 shadow-md"
                        : theme === "dark"
                          ? "hover:bg-white/5 hover:shadow-md"
                          : "hover:bg-gray-50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={c.other_user.profilePhoto ?? undefined} alt={c.other_user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white">
                          {c.other_user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className={`truncate font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {c.other_user.name}
                          </p>
                          <p className={`shrink-0 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {formatConvTime(c.last_message_at)}
                          </p>
                        </div>
                        <p className={`truncate text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          {c.last_message_text || "Say hello…"}
                        </p>
                      </div>
                      {c.unread_count > 0 ? (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B6FD8]">
                          <span className="text-[10px] text-white">{c.unread_count > 9 ? "9+" : c.unread_count}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {selectedConv ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div
                className={`flex flex-shrink-0 items-center justify-between border-b p-4 ${
                  theme === "dark" ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.other_user.profilePhoto ?? undefined} alt={selectedConv.other_user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white">
                      {selectedConv.other_user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={theme === "dark" ? "text-white" : "text-gray-900"}>{selectedConv.other_user.name}</h3>
                    <p className={`text-xs ${panelMuted}`}>Direct message</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {loadingMessages ? (
                  <div className={`flex h-full items-center justify-center ${panelMuted}`}>
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const sent = message.sender_id === myId;
                        return (
                          <div key={message.id} className={`flex ${sent ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-md rounded-2xl px-4 py-2 shadow-sm ${
                                sent
                                  ? "rounded-br-md bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white"
                                  : theme === "dark"
                                    ? "rounded-bl-md bg-white/10 text-white"
                                    : "rounded-bl-md bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="mb-1 text-sm">{message.body}</p>
                              <p
                                className={`text-xs ${
                                  sent ? "text-white/70" : theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {formatMessageTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className={`flex-shrink-0 border-t p-4 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                {sendError ? <p className="mb-2 text-sm text-red-500">{sendError}</p> : null}
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Type a message…"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`flex-1 rounded-xl ${
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-gray-400"
                        : "border-gray-200 bg-gray-50 placeholder:text-gray-500"
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || !socketConnected}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5B6FD8] text-white shadow-lg hover:from-[#6B3FEE] hover:to-[#4A5FC7]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!socketConnected && firebaseUser ? (
                  <p className={`mt-2 text-xs ${panelMuted}`}>Connecting to chat…</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div
                  className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                    theme === "dark" ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  <MessageCircle className={`h-12 w-12 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                </div>
                <h3 className={`mb-2 ${panelMuted}`}>Select a conversation</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Choose someone from your inbox or message them from their profile.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
