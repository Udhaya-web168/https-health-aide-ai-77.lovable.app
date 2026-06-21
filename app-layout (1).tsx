import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity, BarChart3, Calendar, CreditCard, FileText, HeartPulse,
  LayoutDashboard, LogOut, MessageSquare, Moon, Settings, Shield, Stethoscope,
  Sun, Users, UserCog, Bell, Search,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { useAuth } from "./require-auth";
import { logout } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { to: "/emergency", label: "Emergency", icon: HeartPulse },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/admin", label: "Admin", icon: Shield },
  { to: "/sla", label: "SLA Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static z-40 inset-y-0 left-0 w-64 shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}>
        <Link to="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-sidebar-border">
          <div className="size-10 rounded-xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]"
               style={{ background: "var(--gradient-primary)" }}>
            <HeartPulse className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold leading-tight">MediCare AI</p>
            <p className="text-[11px] text-muted-foreground leading-tight">Hospital Management</p>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-2.5">
              <img src={user.avatar} alt="" className="size-9 rounded-full bg-background" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="size-8" onClick={handleLogout} title="Logout">
                <LogOut className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4 md:px-8 h-16">
          <button
            className="md:hidden -ml-2 p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-foreground" />
              <span className="block w-5 h-0.5 bg-foreground" />
              <span className="block w-5 h-0.5 bg-foreground" />
            </div>
          </button>
          <div className="min-w-0">
            {title && <h1 className="text-base md:text-lg font-bold truncate leading-tight">{title}</h1>}
            {subtitle && <p className="text-xs text-muted-foreground truncate leading-tight">{subtitle}</p>}
          </div>
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="Search patients, doctors, appointments…"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/60 border border-transparent focus:bg-background focus:border-border focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex-1 lg:hidden" />
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-2.5 py-1 text-[11px] font-medium">
              <Activity className="size-3" /> Live
            </span>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
