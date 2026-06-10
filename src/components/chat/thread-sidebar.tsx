import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppWordmark } from "@/components/app-logo";
import { listThreads, createThread, deleteThread } from "@/lib/threads.functions";
import { supabase } from "@/integrations/supabase/client";

export function ThreadSidebar() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const del = useServerFn(deleteThread);

  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: () => list(),
  });

  const createMut = useMutation({
    mutationFn: () => create(),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create chat"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      if (id === activeId) navigate({ to: "/chat" });
    },
  });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <AppWordmark />
      </div>
      <div className="px-3 pb-2">
        <Button
          onClick={() => createMut.mutate()}
          disabled={createMut.isPending}
          className="w-full justify-start gap-2"
          variant="default"
        >
          <Plus className="size-4" />
          New conversation
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {threads.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No conversations yet
          </p>
        ) : (
          <ul className="space-y-0.5">
            {threads.map((t) => {
              const active = t.id === activeId;
              return (
                <li key={t.id} className="group relative">
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                    )}
                  >
                    <span className="truncate">{t.title || "Untitled"}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label="Delete conversation"
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Delete this conversation?")) deleteMut.mutate(t.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
