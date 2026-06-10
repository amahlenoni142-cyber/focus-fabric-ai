import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider, SYSTEM_PROMPT } from "@/lib/ai-gateway.server";

type Body = { messages?: UIMessage[]; threadId?: string };

function extractText(parts: UIMessage["parts"]): string {
  return parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = auth.slice(7);

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        if (!LOVABLE_API_KEY) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claimsData?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = claimsData.claims.sub;

        const { messages, threadId }: Body = await request.json();
        if (!Array.isArray(messages) || !threadId) {
          return new Response("Bad request", { status: 400 });
        }

        // Verify thread ownership
        const { data: thread, error: threadErr } = await supabase
          .from("threads")
          .select("id, title")
          .eq("id", threadId)
          .eq("user_id", userId)
          .maybeSingle();
        if (threadErr || !thread) return new Response("Thread not found", { status: 404 });

        // Persist the latest user message (the last one in the array)
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === "user") {
          const text = extractText(lastMsg.parts);
          if (text) {
            await supabase.from("messages").insert({
              thread_id: threadId,
              role: "user",
              content: text,
            });
            // Auto-title thread on first user message
            if (thread.title === "New conversation") {
              const title = text.slice(0, 60).replace(/\s+/g, " ").trim();
              await supabase
                .from("threads")
                .update({ title: title || "New conversation" })
                .eq("id", threadId);
            }
          }
        }

        const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ responseMessage }) => {
            const text = extractText(responseMessage.parts);
            if (text) {
              await supabase.from("messages").insert({
                thread_id: threadId,
                role: "assistant",
                content: text,
              });
            }
          },
        });
      },
    },
  },
});
