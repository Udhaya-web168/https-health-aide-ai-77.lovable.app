import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse, Lock, Mail, ShieldCheck, Stethoscope, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getCurrentUser, DEMO_USERS } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MediCare AI Hospital" },
      { name: "description", content: "Sign in to MediCare AI Hospital Management System." },
    ],
  }),
  component: LoginPage,
});

const ROLE_ICONS = {
  admin: ShieldCheck,
  doctor: Stethoscope,
  receptionist: UserCog,
} as const;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) navigate({ to: "/", replace: true });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = login(email, password);
      setLoading(false);
      if (!u) {
        toast.error("Invalid credentials. Try a demo account below.");
        return;
      }
      toast.success(`Welcome, ${u.name}`);
      navigate({ to: "/", replace: true });
    }, 350);
  }

  function quickLogin(em: string, pw: string) {
    setEmail(em); setPassword(pw);
    setTimeout(() => {
      const u = login(em, pw);
      if (u) { toast.success(`Welcome, ${u.name}`); navigate({ to: "/", replace: true }); }
    }, 100);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand side */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 text-primary-foreground"
           style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }} />
        <div className="relative flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
            <HeartPulse className="size-6" />
          </div>
          <div>
            <p className="font-bold text-lg">MediCare AI</p>
            <p className="text-xs opacity-80">Hospital Management System</p>
          </div>
        </div>
        <div className="relative space-y-6 max-w-md animate-fade-in">
          <h1 className="text-4xl font-bold leading-tight">Care that's intelligent, organized and always on.</h1>
          <p className="text-white/85">From patient intake to AI-assisted triage and billing — MediCare AI gives your hospital one calm, professional cockpit.</p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { v: "12k+", l: "Patients" },
              { v: "180+", l: "Doctors" },
              { v: "99.9%", l: "Uptime" },
            ].map(s => (
              <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur px-3 py-3 text-center">
                <p className="text-2xl font-bold">{s.v}</p>
                <p className="text-[11px] opacity-80">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs opacity-70">© 2026 MediCare AI Hospital. All rights reserved.</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="size-10 rounded-xl grid place-items-center text-primary-foreground"
                 style={{ background: "var(--gradient-primary)" }}>
              <HeartPulse className="size-5" />
            </div>
            <div>
              <p className="font-bold">MediCare AI</p>
              <p className="text-[11px] text-muted-foreground">Hospital Management</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Enter your credentials to access the dashboard.</p>

          <Card className="p-6 shadow-[var(--shadow-card)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@medicare.com" required className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required className="pl-9" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Card>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground text-center mb-3">Demo accounts — one-click sign in</p>
            <div className="grid gap-2">
              {DEMO_USERS.map(d => {
                const Icon = ROLE_ICONS[d.user.role];
                return (
                  <button key={d.email} type="button" onClick={() => quickLogin(d.email, d.password)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-left transition-all">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">{d.user.role}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{d.email} · {d.password}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">Sign in →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
