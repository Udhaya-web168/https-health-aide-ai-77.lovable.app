import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, Bot, CalendarPlus, Mic, MicOff, Plus, Search, Send,
  Sparkles, Stethoscope, Trash2, Volume2, MapPin, MessageSquare,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/require-auth";
import { classifyPriority, isEmergency, SLA, type Priority } from "@/lib/sla";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><AssistantPage /></RequireAuth>,
});

type Msg = { role: "user" | "assistant"; content: string; ts: number; priority?: Priority; emergency?: boolean };
type Model = "chatgpt" | "gemini";
type Chat = { id: string; title: string; messages: Msg[]; createdAt: number };

const SUGGESTIONS = [
  { icon: "🤒", text: "I have fever for two days." },
  { icon: "💊", text: "What is paracetamol generally used for?" },
  { icon: "🩺", text: "What are warning signs of high blood pressure?" },
  { icon: "🥗", text: "Healthy diet tips for diabetes patients?" },
];

function renderMarkdown(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = escaped
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-foreground text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  const lines = html.split(/\n/);
  let out = ""; let inList = false;
  for (const line of lines) {
    const m = line.match(/^\s*[-•]\s+(.*)$/);
    const o = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (m || o) {
      if (!inList) { out += "<ul class='list-disc pl-5 space-y-1 my-2'>"; inList = true; }
      out += `<li>${(m?.[1]) ?? (o?.[2]) ?? ""}</li>`;
    } else {
      if (inList) { out += "</ul>"; inList = false; }
      if (line.trim() === "") out += "<div class='h-2'></div>";
      else out += `<p>${line}</p>`;
    }
  }
  if (inList) out += "</ul>";
  return out;
}

const STORAGE = "medicare:chats";

function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
}
function saveChats(c: Chat[]) { if (typeof window !== "undefined") localStorage.setItem(STORAGE, JSON.stringify(c)); }

function AssistantPage() {
  const user = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("gemini");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const loaded = loadChats();
    setChats(loaded);
    setActiveId(loaded[0]?.id ?? null);
  }, []);
  useEffect(() => { saveChats(chats); }, [chats]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeId, chats, streamingText, loading]);

  const active = useMemo(() => chats.find(c => c.id === activeId) ?? null, [chats, activeId]);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  function newChat(): Chat {
    const c: Chat = { id: `c-${Date.now()}`, title: "New conversation", messages: [], createdAt: Date.now() };
    setChats(prev => [c, ...prev]);
    setActiveId(c.id);
    return c;
  }

  function deleteChat(id: string) {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    let chat = active;
    if (!chat) chat = newChat();
    const priority = classifyPriority(content);
    const emergency = isEmergency(content);
    const userMsg: Msg = { role: "user", content, ts: Date.now(), priority, emergency };
    const baseMsgs = [...chat.messages, userMsg];
    const title = chat.messages.length === 0 ? content.slice(0, 40) : chat.title;
    const id = chat.id;

    setChats(prev => prev.map(c => c.id === id ? { ...c, messages: baseMsgs, title } : c));
    setInput("");
    setLoading(true);
    setStreamingText("");

    if (emergency) {
      const banner: Msg = {
        role: "assistant", ts: Date.now(),
        content: "🚨 **Medical Emergency** — Please call emergency services or visit the nearest hospital immediately.\n\nWhile help arrives, stay calm. I'll share general guidance below — this is not a substitute for emergency care.",
      };
      setChats(prev => prev.map(c => c.id === id ? { ...c, messages: [...baseMsgs, banner] } : c));
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: baseMsgs.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error || "AI request failed"); setLoading(false); return; }
      const full = data.content as string;
      // Type-out animation
      let i = 0;
      const tick = () => {
        i += Math.max(2, Math.floor(full.length / 120));
        setStreamingText(full.slice(0, i));
        if (i < full.length) requestAnimationFrame(tick);
        else {
          setChats(prev => prev.map(c => c.id === id ? {
            ...c,
            messages: [...c.messages, { role: "assistant", content: full, ts: Date.now() }],
          } : c));
          setStreamingText("");
          setLoading(false);
          setTimeout(() => taRef.current?.focus(), 50);
        }
      };
      requestAnimationFrame(tick);
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  function toggleVoice() {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.continuous = false; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((x: any) => x[0].transcript).join("");
      setInput(t);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r;
    r.start(); setListening(true);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) { toast.error("Voice reply not supported"); return; }
    const u = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, "").slice(0, 800));
    u.rate = 1; u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  return (
    <AppLayout title="AI Assistant" subtitle="ChatGPT & Gemini-powered medical assistant">
      <div className="grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-10rem)]">
        {/* Sidebar — Chat History */}
        <aside className="hidden lg:flex flex-col border border-border/60 rounded-2xl bg-card overflow-hidden">
          <div className="p-3 border-b border-border/60">
            <Button onClick={newChat} className="w-full justify-start gap-2"><Plus className="size-4" /> New chat</Button>
          </div>
          <div className="p-2 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input placeholder="Search chats…" className="w-full h-8 pl-8 pr-3 rounded-md bg-muted/60 text-xs focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {chats.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">No chats yet</p>}
            {chats.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full group flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-colors ${
                  activeId === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}>
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="truncate flex-1">{c.title}</span>
                <Trash2 className="size-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteChat(c.id); }} />
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-border/60">
            <p className="text-[11px] text-muted-foreground mb-2">Model</p>
            <div className="grid grid-cols-2 gap-1">
              <Button size="sm" variant={model === "gemini" ? "default" : "outline"} onClick={() => setModel("gemini")}>Gemini</Button>
              <Button size="sm" variant={model === "chatgpt" ? "default" : "outline"} onClick={() => setModel("chatgpt")}>ChatGPT</Button>
            </div>
          </div>
        </aside>

        {/* Chat surface */}
        <div className="flex flex-col border border-border/60 rounded-2xl bg-card overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {!active || active.messages.length === 0 ? (
              <div className="max-w-2xl mx-auto pt-6 md:pt-12 animate-fade-in">
                <div className="text-center">
                  <div className="size-16 mx-auto rounded-2xl grid place-items-center text-primary-foreground mb-4 shadow-[var(--shadow-glow)]"
                       style={{ background: "var(--gradient-primary)" }}>
                    <Sparkles className="size-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{greeting}{user ? `, ${user.name.split(" ")[0]}` : ""}!</h2>
                  <p className="text-muted-foreground mt-1.5">How can I help you today?</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 mt-8">
                  {SUGGESTIONS.map(s => (
                    <button key={s.text} onClick={() => send(s.text)}
                      className="text-left p-4 rounded-xl border border-border/60 hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-start">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-sm">{s.text}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <ActionChip icon={CalendarPlus} label="Book Appointment" />
                  <ActionChip icon={Stethoscope} label="Find Doctor" />
                  <ActionChip icon={MapPin} label="Nearby Hospital" />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {active.messages.map((m, i) => (
                  <MessageRow key={i} m={m} user={user} onSpeak={speak} />
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <Avatar bot />
                    <div className="flex-1 pt-1">
                      {streamingText ? (
                        <div className="prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) }} />
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <span className="size-2 rounded-full bg-primary animate-bounce" />
                          <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:.15s]" />
                          <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:.3s]" />
                          <span className="ml-2 text-xs">Thinking…</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 p-3 md:p-4 bg-background/40">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2 bg-muted/60 rounded-2xl p-2 border border-border/60 focus-within:border-primary transition-colors">
                <Button size="icon" variant="ghost" className={`size-9 shrink-0 ${listening ? "text-destructive animate-pulse-ring" : ""}`} onClick={toggleVoice} aria-label="Voice input">
                  {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
                <Textarea
                  ref={taRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Message MediCare AI…"
                  className="resize-none min-h-[40px] max-h-32 border-0 bg-transparent focus-visible:ring-0 shadow-none p-2"
                  rows={1}
                />
                <Button size="icon" className="size-9 shrink-0 rounded-xl" disabled={loading || !input.trim()} onClick={() => send()} aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Information only. In an emergency, call your local emergency number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Avatar({ bot, user }: { bot?: boolean; user?: { avatar: string; name: string } | null }) {
  if (bot) return (
    <div className="size-9 shrink-0 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
      <Bot className="size-4" />
    </div>
  );
  if (user) return <img src={user.avatar} alt="" className="size-9 shrink-0 rounded-full bg-muted" />;
  return <div className="size-9 shrink-0 rounded-full bg-secondary" />;
}

function MessageRow({ m, user, onSpeak }: { m: Msg; user: { avatar: string; name: string } | null; onSpeak: (t: string) => void }) {
  return (
    <div className={`flex gap-3 animate-fade-in ${m.role === "user" ? "" : ""}`}>
      {m.role === "assistant" ? <Avatar bot /> : <Avatar user={user} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold">{m.role === "assistant" ? "MediCare AI" : user?.name?.split(" ")[0] || "You"}</p>
          {m.priority && <Badge variant="outline" className="text-[10px] py-0">{m.priority} · {SLA[m.priority].label}</Badge>}
          {m.emergency && <Badge className="bg-destructive text-destructive-foreground text-[10px] py-0 gap-1"><AlertTriangle className="size-2.5" /> Emergency</Badge>}
        </div>
        <div className={`text-sm leading-relaxed ${m.role === "assistant" && (m.content.startsWith("🚨") ? "bg-destructive/10 border border-destructive/30 rounded-xl p-3" : "")}`}>
          <div className="prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
        </div>
        {m.role === "assistant" && (
          <div className="flex gap-1 mt-2">
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onSpeak(m.content)}><Volume2 className="size-3 mr-1" />Read aloud</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionChip({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-border/60 hover:border-primary hover:bg-primary/5 text-xs font-medium transition-all"
      onClick={() => toast.info(`${label} — coming soon`)}>
      <Icon className="size-3.5 text-primary" />{label}
    </button>
  );
}
