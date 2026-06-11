import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Field } from "@/components/tools/tool-page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/tools/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Snow Flow" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const canSubmit = notes.trim().length > 20;

  return (
    <AppShell>
      <ToolPage
        tool="meetings"
        title="Meeting Summarizer"
        description="Turn raw notes or a transcript into a clear summary with action items."
        icon={<FileText className="size-4" />}
        canSubmit={canSubmit}
        submitLabel="Summarize meeting"
        buildPrompt={() =>
          `Summarize the following meeting.\n\nMeeting: ${title || "(untitled)"}\nAttendees: ${attendees || "(unspecified)"}\n\nNotes / transcript:\n${notes}`
        }
      >
        <Field label="Meeting title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q3 Roadmap review" />
        </Field>
        <Field label="Attendees" hint="Comma separated. Helps assign action items.">
          <Input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="Alex (PM), Sam (Eng), Jordan (Design)" />
        </Field>
        <Field label="Notes or transcript" hint="Paste raw notes, bullets, or a transcript.">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste meeting notes here…"
            rows={14}
            className="font-mono text-xs"
          />
        </Field>
      </ToolPage>
    </AppShell>
  );
}
