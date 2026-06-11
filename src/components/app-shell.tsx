import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, ListChecks, Search, MessageCircle, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppWordmark } from "@/components/app-logo";
import { supabase } from "@/integrations/supabase/client";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tools/email", label: "Email", icon: Mail },
  { to: "/tools/meetings", label: "Meetings", icon: FileText },
  { to: "/tools/tasks", label: "Tasks", icon: ListChecks },
  { to: "/tools/research", label: "Research", icon: Search },
  { to: "/chat", label: "Chat", icon: MessageCircle },
] as const;

export function AppShell({ children, contentClassName }: { children: ReactNode; contentClassName?: string }) {
  return (
    <div className="flex h-screen w-full bg-background">
      <PrimaryNav />
      <main className={cn("flex-1 overflow-hidden", contentClassName)}>{children}</main>
    </div>
  );
}

function PrimaryNav() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-5 pb-4">
        <AppWordmark />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              item.to === "/chat"
                ? pathname.startsWith("/chat")
                : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
