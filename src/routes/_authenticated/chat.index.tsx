import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { ThreadSidebar } from "@/components/chat/thread-sidebar";
import { listThreads, createThread } from "@/lib/threads.functions";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const qc = useQueryClient();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const threads = await list();
      if (threads.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
      } else {
        const t = await create();
        qc.invalidateQueries({ queryKey: ["threads"] });
        navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      }
    })();
  }, [list, create, navigate, qc]);

  return (
    <div className="flex h-screen">
      <ThreadSidebar />
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Opening your workspace…
      </div>
    </div>
  );
}
