import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Field } from "@/components/tools/tool-page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/tools/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Snow Flow" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General professional");
  const [context, setContext] = useState("");
  const canSubmit = topic.trim().length > 0;

  return (
    <AppShell>
      <ToolPage
        tool="research"
        title="Research Assistant"
        description="Quick briefs with summary, insights, and plain-language explanations."
        icon={<Search className="size-4" />}
        canSubmit={canSubmit}
        submitLabel="Research topic"
        buildPrompt={() =>
          `Research the following topic for me.\n\nTopic: ${topic}\nAudience: ${audience}\n\nAdditional context / specific questions:\n${context || "(none)"}`
        }
      >
        <Field label="Topic">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. EU AI Act compliance for SMBs" />
        </Field>
        <Field label="Audience">
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Executive">Executive</SelectItem>
              <SelectItem value="General professional">General professional</SelectItem>
              <SelectItem value="Non-technical stakeholder">Non-technical stakeholder</SelectItem>
              <SelectItem value="Technical specialist">Technical specialist</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Specific questions" hint="Optional. Anything you specifically want covered.">
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="- What deadlines apply to a 50-person SaaS?\n- What are the penalties for non-compliance?"
            rows={6}
          />
        </Field>
      </ToolPage>
    </AppShell>
  );
}
