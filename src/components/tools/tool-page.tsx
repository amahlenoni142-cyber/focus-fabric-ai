import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { runTool } from "@/lib/tools.functions";

export type ToolKey = "email" | "meetings" | "tasks" | "research";

export function ToolPage({
  tool,
  title,
  description,
  icon,
  children,
  buildPrompt,
  canSubmit,
  submitLabel = "Generate",
}: {
  tool: ToolKey;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  buildPrompt: () => string;
  canSubmit: boolean;
  submitLabel?: string;
}) {
  const fn = useServerFn(runTool);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const prompt = buildPrompt();
      const res = await fn({ data: { tool, prompt } });
      return res.text;
    },
    onSuccess: (text) => setOutput(text),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Generation failed"),
  });

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: form */}
      <div className="flex w-full max-w-md flex-col border-r border-border bg-card/40">
        <header className="border-b border-border px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">{children}</div>
        </div>
        <div className="border-t border-border px-6 py-4">
          <Button
            onClick={() => mutation.mutate()}
            disabled={!canSubmit || mutation.isPending}
            className="w-full gap-2"
          >
            <Sparkles className="size-4" />
            {mutation.isPending ? "Generating…" : submitLabel}
          </Button>
        </div>
      </div>

      {/* Right: output */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <header className="flex items-center justify-between border-b border-border px-8 py-4">
          <h2 className="text-sm font-medium text-muted-foreground">Result</h2>
          {output && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {mutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse" />
              Snow Flow is working on it…
            </div>
          ) : output ? (
            <article className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-base prose-h2:text-[15px] prose-h3:text-sm prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground prose-a:text-primary">
              <ReactMarkdown>{output}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                Fill in the details on the left and Snow Flow will generate a polished, ready-to-use draft here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
