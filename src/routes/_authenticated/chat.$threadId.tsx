import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ThreadSidebar } from "@/components/chat/thread-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { AppShell } from "@/components/app-shell";
import { getThreadMessages } from "@/lib/threads.functions";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThreadPage,
  errorComponent: ({ error }) => (
    <div className="flex h-screen items-center justify-center text-sm text-destructive">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Conversation not found.
    </div>
  ),
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const fetchMessages = useServerFn(getThreadMessages);

  const { data, isLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => fetchMessages({ data: { threadId } }),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-full">
          <ThreadSidebar />
          <div className="flex-1" />
        </div>
      </AppShell>
    );
  }
  if (!data || !data.thread) throw notFound();

  return (
    <AppShell>
      <div className="flex h-full">
        <ThreadSidebar />
        <ChatWindow threadId={threadId} initialMessages={data.messages} />
      </div>
    </AppShell>
  );
}
