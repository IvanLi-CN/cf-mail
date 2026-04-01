import {
  KeyRound,
  Mailbox,
  PanelLeft,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { SessionUser, VersionInfo } from "@/lib/contracts";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Mailbox;
  adminOnly?: boolean;
};

const navItems = [
  { to: "/mailboxes", label: "邮箱", icon: Mailbox },
  { to: "/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/users", label: "用户", icon: UserRound, adminOnly: true },
] satisfies readonly NavItem[];

export const AppShell = ({
  user,
  version,
  onLogout,
  children,
}: PropsWithChildren<{
  user: SessionUser;
  version?: VersionInfo | null;
  onLogout: () => void;
}>) => (
  <div className="min-h-screen">
    <div className="mx-auto grid min-h-screen max-w-[1480px] lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-border lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <div className="space-y-4">
            <Link to="/mailboxes" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                <PanelLeft className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-[0.18em] text-foreground uppercase">
                  CF Mail
                </span>
                <span className="block text-xs text-muted-foreground">
                  Temporary inbox control plane
                </span>
              </span>
            </Link>
            <div className="rounded-xl border border-border bg-card px-3 py-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {user.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Role · {user.role}
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems
              .filter((item) => !item.adminOnly || user.role === "admin")
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-white/5 hover:text-foreground",
                      isActive && "border-border bg-secondary text-foreground",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
          </nav>

          <div className="mt-auto space-y-3 border-t border-border pt-4">
            <Button variant="outline" className="w-full" onClick={onLogout}>
              退出登录
            </Button>
            <div className="space-y-1 text-xs leading-5 text-muted-foreground">
              <p>Version {version?.version ?? "dev"}</p>
              <p>{version?.commitSha ?? "local"}</p>
              <p>{version?.branch ?? "main"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Dashboard
              </p>
              <p className="text-sm text-foreground">
                Manage inbox lifecycle, messages, and API access.
              </p>
            </div>
            <div className="hidden items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 md:flex">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-secondary-foreground">
                {user.role}
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  </div>
);
