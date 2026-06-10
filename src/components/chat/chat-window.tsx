import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { StoredMessage } from "@/lib/threads.functions";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/app-logo";

const QUICK_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: "Draft an email",
    prompt:
      "Help me draft a professional email. I want to follow up with a client about a delayed project deliverable. Tone: polite but firm.",
  },
  {
    label: "Summarize meeting notes",
    prompt:
      "Summarize these meeting notes into executive summary, decisions, and action items with owners and deadlines:\n\n[paste your notes here]",
  },
  {
    label: "Plan my day",
    prompt:
      "Build a daily schedule using time-blocking and Eisenhower priorities from these tasks:\n- ",
  },
  {
    label: "Research a topic",
    prompt:
      "Give me a summary, key insights, statistics, and plain-language explanation on the topic of: ",
  },
];

export function ChatWindow({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: StoredMessage[];
}) {
  const uiInitial = useMemo<UIMessage[]>(
    () =>
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      })),
    [initialMessages],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: async ({ messages, id }) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          const headers: Record<string, string> = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          return { body: { messages, threadId: id }, headers };
        },
      }),
    [],
  );

  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId,
    messages: uiInitial,
    transport,
    onError: (e) => toast.error(e.message || "Something went wrong"),
  });

  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setInput("");
    await sendMessage({ text: trimmed });
    requestAnimationFrame(() => taRef.current?.focus());
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {messages.length === 0 ? (
            <EmptyState onPick={(p) => setInput(p)} />
          ) : (
            <div className="space-y-7">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 animate-pulse" />
                  Thinking…
                </div>
              )}
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 px-6 py-4 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-card p-2 shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder="Ask for an email, summarize notes, plan tasks…"
              rows={1}
              className="min-h-[44px] max-h-48 resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0"
            />
            {isBusy ? (
              <Button type="button" size="icon" variant="secondary" onClick={() => stop()}>
                <Square className="size-4" />
              </Button>
            ) : (
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <ArrowUp className="size-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI-generated. Review before professional use.
          </p>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">
        <AppLogo size={20} />
      </div>
      <div className="prose prose-sm max-w-none flex-1 text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-base prose-h2:text-[15px] prose-h3:text-sm prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-[''] prose-code:after:content-[''] prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground prose-a:text-primary">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AppLogo size={44} />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
        How can I help you work today?
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Draft emails, summarize meetings, plan your day, or research a topic. Just describe what you need.
      </p>
      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => onPick(q.prompt)}
            className={cn(
              "rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:shadow-sm",
            )}
          >
            <span className="font-medium">{q.label}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">
              {q.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
