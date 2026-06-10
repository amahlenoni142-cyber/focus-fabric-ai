import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, ListChecks, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { AppWordmark } from "@/components/app-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowDesk — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan your day, and research topics with an AI assistant built for work.",
      },
      { property: "og:title", content: "FlowDesk — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan your day, and research topics with an AI assistant built for work.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Mail, title: "Smart Email Generator", desc: "Professional drafts tuned to tone and audience." },
  { icon: ListChecks, title: "Meeting Notes Summarizer", desc: "Decisions, action items, owners, and deadlines." },
  { icon: Calendar, title: "Task Planner", desc: "Eisenhower priorities and time-blocked daily plans." },
  { icon: BookOpen, title: "Research Assistant", desc: "Summaries, insights, and plain-language explanations." },
  { icon: MessageSquare, title: "Workplace Q&A", desc: "Productivity, comms, planning, and admin help." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <AppWordmark />
        <Link
          to="/chat"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Open app
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20 text-center sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            AI-powered workplace assistant
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Get more done at work, in less time.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            FlowDesk drafts emails, summarizes meetings, plans your day, and researches anything — all in one clean chat.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Get started <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-4.5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FlowDesk</span>
          <span>AI-generated content. Review before professional use.</span>
        </div>
      </footer>
    </div>
  );
}

