"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageData {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: MessageData[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allMessages, setAllMessages] = useState<MessageData[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const organizeConversations = useCallback(
    (messages: MessageData[]) => {
      if (!user) return;
      const convMap = new Map<string, Conversation>();

      messages.forEach((msg) => {
        const isReceived = msg.receiverId === user.id;
        const otherUserId = isReceived ? msg.senderId : msg.receiverId;
        const otherUser = isReceived ? msg.sender : msg.receiver;

        if (!convMap.has(otherUserId)) {
          convMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUser.name,
            userAvatar: otherUser.avatar,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt,
            unreadCount: 0,
            messages: [],
          });
        }

        const conv = convMap.get(otherUserId)!;
        conv.messages.push(msg);

        if (new Date(msg.createdAt) > new Date(conv.lastMessageTime)) {
          conv.lastMessage = msg.content;
          conv.lastMessageTime = msg.createdAt;
        }

        if (isReceived && !msg.read) {
          conv.unreadCount++;
        }
      });

      const convArray = Array.from(convMap.values());
      convArray.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );

      setConversations(convArray);

      // Update selected conversation messages if still open
      if (selectedConv) {
        const updated = convArray.find((c) => c.userId === selectedConv.userId);
        if (updated) setSelectedConv(updated);
      } else if (convArray.length > 0) {
        setSelectedConv(convArray[0]);
      }
    },
    [user, selectedConv]
  );

  useEffect(() => {
    if (!user) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages?userId=${user!.id}`);
        if (res.ok) {
          const data = await res.json();
          setAllMessages(data);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [user]);

  useEffect(() => {
    if (allMessages.length > 0) {
      organizeConversations(allMessages);
    } else {
      setLoading(false);
    }
  }, [allMessages, organizeConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length]);

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConv || !user) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConv.userId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        const message = await res.json();
        setAllMessages((prev) => [...prev, message]);
        setNewMessage("");

        // Simulate auto-reply after 2 seconds
        const convUserId = selectedConv.userId;
        setTimeout(async () => {
          const replies = [
            "Merci pour ton message ! Je te reponds des que possible 😊",
            "Super ! On peut se voir cette semaine pour visiter ?",
            "Parfait, j'ai hate de te rencontrer !",
            "OK, je te confirme les details par email.",
            "Genial ! La villa est disponible aux dates demandees.",
            "Avec plaisir ! N'hesite pas si tu as d'autres questions.",
            "Top ! Je suis disponible demain matin si ca te va 👍",
            "Bienvenue a Bali ! Tu vas adorer la villa.",
          ];
          const randomReply =
            replies[Math.floor(Math.random() * replies.length)];

          try {
            const replyRes = await fetch("/api/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                senderId: convUserId,
                receiverId: user.id,
                content: randomReply,
              }),
            });
            if (replyRes.ok) {
              const replyMsg = await replyRes.json();
              setAllMessages((prev) => [...prev, replyMsg]);
            }
          } catch (err) {
            console.error("Error simulating reply:", err);
          }
        }, 2000);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  }

  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-5xl">🔐</div>
          <h2 className="font-display text-2xl font-bold text-white">
            Connexion requise
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Connectez-vous pour acceder aux messages
          </p>
          <button
            onClick={() => router.push("/login")}
            className="glow-button mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-41px)] flex-col bg-background">
      {/* Mobile header */}
      <div className="border-b border-white/[0.06] bg-surface/95 p-4 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          {selectedConv ? (
            <button onClick={() => setSelectedConv(null)}>
              <ArrowLeft className="h-5 w-5 text-white/50" />
            </button>
          ) : (
            <button onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-white/50" />
            </button>
          )}
          <h1 className="font-display text-lg font-bold text-white">
            {selectedConv ? selectedConv.userName : "Messages"}
          </h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ===== Conversations List ===== */}
        <div
          className={`w-full border-r border-white/[0.06] bg-surface lg:w-80 ${
            selectedConv ? "hidden lg:block" : "block"
          }`}
        >
          {/* Search */}
          <div className="border-b border-white/[0.06] p-4">
            <div className="hidden items-center gap-2 lg:flex">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h1 className="font-display text-lg font-bold text-white">
                Messages
              </h1>
            </div>
            <div className="relative mt-0 lg:mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <MessageSquare className="mx-auto mb-3 h-10 w-10 text-white/10" />
                <p className="text-sm text-white/40">Aucune conversation</p>
                <p className="mt-1 text-xs text-white/25">
                  Commence a discuter avec les proprietaires !
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedConv(conv)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                      selectedConv?.userId === conv.userId
                        ? "bg-primary/10 ring-1 ring-primary/20"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <Avatar className="h-11 w-11 shrink-0 border border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-sm font-bold text-primary">
                        {getInitials(conv.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {conv.userName}
                        </h3>
                        <span className="shrink-0 text-[10px] text-white/30">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-white/40">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== Chat Area ===== */}
        <div
          className={`flex flex-1 flex-col ${
            selectedConv ? "flex" : "hidden lg:flex"
          }`}
        >
          {selectedConv ? (
            <>
              {/* Chat header */}
              <div className="hidden items-center gap-3 border-b border-white/[0.06] bg-surface/95 p-4 backdrop-blur-lg lg:flex">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarFallback className="bg-primary/20 text-sm font-bold text-primary">
                    {getInitials(selectedConv.userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {selectedConv.userName}
                  </h2>
                  <p className="flex items-center gap-1.5 text-[10px] text-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                    En ligne
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto max-w-2xl space-y-3">
                  {/* Demo banner */}
                  <div className="mx-auto mb-4 max-w-xs rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-center">
                    <p className="text-[10px] text-primary">
                      🎭 Mode demo — Reponses automatiques
                    </p>
                  </div>

                  {selectedConv.messages.map((msg) => {
                    const isSent = msg.senderId === user.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex max-w-[75%] flex-col gap-1">
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              isSent
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-white"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-1 ${
                              isSent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="text-[10px] text-white/25">
                              {formatMessageTime(msg.createdAt)}
                            </span>
                            {isSent && (
                              <>
                                {msg.read ? (
                                  <CheckCheck className="h-3 w-3 text-primary" />
                                ) : (
                                  <Check className="h-3 w-3 text-white/25" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-white/[0.06] bg-surface/95 p-4 backdrop-blur-lg">
                <div className="mx-auto flex max-w-2xl gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ecris ton message..."
                    className="h-11 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Tes messages
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Selectionne une conversation pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
