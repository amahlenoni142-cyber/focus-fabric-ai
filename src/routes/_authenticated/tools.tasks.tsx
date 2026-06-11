import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Field } from "@/components/tools/tool-page";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/tools/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — Snow Flow" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Daily");
  const [hours, setHours] = useState("8");
  const canSubmit = tasks.trim().length > 0;

  return (
    <AppShell>
      <ToolPage
        tool="tasks"
        title="Task Planner & Scheduler"
        description="Eisenhower priorities + time-blocking for your day or week."
        icon={<ListChecks className="size-4" />}
        canSubmit={canSubmit}
        submitLabel="Build my plan"
        buildPrompt={() =>
          `Plan these tasks.\n\nHorizon: ${horizon}\nAvailable hours per day: ${hours}\n\nTasks:\n${tasks}`
        }
      >
        <Field label="Planning horizon">
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Available hours per day">
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["4", "6", "8", "10"].map((h) => (
                <SelectItem key={h} value={h}>
                  {h} hours
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tasks" hint="One per line. Add context, deadlines, or estimates if you have them.">
          <Textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={"- Finalize Q3 board deck (due Friday)\n- Review pull requests\n- 1:1 with Sam\n- Draft offer letter"}
            rows={14}
            className="font-mono text-xs"
          />
        </Field>
      </ToolPage>
    </AppShell>
  );
}
