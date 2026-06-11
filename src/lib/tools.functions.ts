import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const ToolKey = z.enum(["email", "meetings", "tasks", "research"]);

const SHARED_TAIL = `\n\nFormat the output in clean markdown with clear headings and bullet lists. Keep it concise and ready for professional use. End with this exact line on its own:\n\n> _This response was generated using AI and should be reviewed for accuracy and suitability before professional use._`;

const SYSTEMS: Record<z.infer<typeof ToolKey>, string> = {
  email: `You are Snow Flow's Smart Email Generator. Write a single professional email tailored to the user's brief. Always include sections:\n- **Subject**\n- **Body** (well-paragraphed)\n- **Call to Action**\n- **Closing**\nMatch the requested tone exactly.${SHARED_TAIL}`,
  meetings: `You are Snow Flow's Meeting Notes Summarizer. From the user's raw notes/transcript, produce:\n- **Executive Summary** (2-3 sentences)\n- **Key Discussion Points** (bullets)\n- **Decisions Made**\n- **Action Items** — each as: **Task** — Owner — Deadline\nNever invent owners or deadlines that aren't implied; mark them _TBD_ instead.${SHARED_TAIL}`,
  tasks: `You are Snow Flow's Task Planner & Scheduler. Build a structured plan from the user's tasks:\n- A **Daily** or **Weekly** plan with concrete time blocks\n- **Priority** per task using the Eisenhower Matrix (Urgent x Important: Do / Schedule / Delegate / Eliminate)\n- Estimated completion times\n- 2-3 short **Productivity Recommendations**${SHARED_TAIL}`,
  research: `You are Snow Flow's Research Assistant. For the user's topic produce:\n- **Summary**\n- **Key Insights** (bullets)\n- **Important Statistics** (only if confidently known — otherwise omit)\n- **Recommendations**\n- **Plain-language explanation** for non-experts\nFlag anything that requires verification.${SHARED_TAIL}`,
};

export const runTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      tool: ToolKey,
      prompt: z.string().min(1).max(8000),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(apiKey);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEMS[data.tool],
      prompt: data.prompt,
    });
    return { text };
  });
