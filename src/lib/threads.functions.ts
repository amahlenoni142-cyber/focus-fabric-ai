import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
export type StoredMessage = { id: string; role: "user" | "assistant"; content: string };

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .insert({ user_id: context.userId, title: "New conversation" })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ threadId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { data: thread, error: tErr } = await context.supabase
      .from("threads")
      .select("id, title")
      .eq("id", data.threadId)
      .maybeSingle();
    if (tErr) throw new Error(tErr.message);
    if (!thread) return { thread: null, messages: [] as StoredMessage[] };

    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const messages: StoredMessage[] = (rows ?? [])
      .filter((r) => r.role === "user" || r.role === "assistant")
      .map((r) => ({ id: r.id, role: r.role as "user" | "assistant", content: r.content }));
    return { thread, messages };
  });
