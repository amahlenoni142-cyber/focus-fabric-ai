import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/tools/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Snow Flow" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");

  const canSubmit = purpose.trim().length > 0;

  return (
    <AppShell>
      <ToolPage
        tool="email"
        title="Smart Email Generator"
        description="Draft a polished email tailored to your audience and tone."
        icon={<Mail className="size-4" />}
        canSubmit={canSubmit}
        submitLabel="Generate email"
        buildPrompt={() =>
          `Write an email.\n\nPurpose: ${purpose}\nRecipient type: ${recipient}\nTone: ${tone}\nKey points to include:\n${keyPoints || "(none)"}\n`
        }
      >
        <Field label="Purpose of the email" hint="What is this email trying to achieve?">
          <Textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Follow up with a client about a delayed deliverable"
            rows={3}
          />
        </Field>
        <Field label="Recipient">
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Client, Manager, Team…" />
        </Field>
        <Field label="Tone">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Apologetic">Apologetic</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
              <SelectItem value="Polite but firm">Polite but firm</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Key points" hint="Optional. Names, dates, context, asks.">
          <Textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="- Project was due Friday\n- Request a revised timeline by Wed"
            rows={5}
          />
        </Field>
      </ToolPage>
    </AppShell>
  );
}
