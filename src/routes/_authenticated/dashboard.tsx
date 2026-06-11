import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageCircle, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Snow Flow" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: DashboardPage,
});

const TOOLS = [
  {
    to: "/tools/email",
    label: "Smart Email Generator",
    description: "Draft polished, on-tone emails in seconds.",
    icon: Mail,
    accent: "from-rose-500/15 to-pink-500/5",
  },
  {
    to: "/tools/meetings",
    label: "Meeting Summarizer",
    description: "Turn raw notes into summaries and action items.",
    icon: FileText,
    accent: "from-pink-500/15 to-fuchsia-500/5",
  },
  {
    to: "/tools/tasks",
    label: "Task Planner",
    description: "Prioritize with the Eisenhower Matrix and time-block your day.",
    icon: ListChecks,
    accent: "from-fuchsia-500/15 to-rose-500/5",
  },
  {
    to: "/tools/research",
    label: "Research Assistant",
    description: "Get briefs, key insights, and plain-language explanations.",
    icon: Search,
    accent: "from-pink-400/15 to-rose-400/5",
  },
] as const;

function DashboardPage() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Snow Flow</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Good to see you. What shall we work on?
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Pick a dedicated tool to get a focused, structured result — or open Chat for a free-form
              conversation with your assistant.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${t.accent} p-6 transition-all hover:border-primary/40 hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-background/80 text-primary shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">{t.label}</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="size-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">Need something else?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open the unified chat — Snow Flow detects your intent and handles emails, summaries, planning, and
                  research in one conversation.
                </p>
              </div>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                Open chat <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-[11px] text-muted-foreground">
            AI-generated outputs. Review before professional use.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
