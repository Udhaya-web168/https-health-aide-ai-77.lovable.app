import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { getCurrentUser, type AuthUser } from "@/lib/auth";

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getCurrentUser());
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return user;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate({ to: "/login", search: { redirect: path } as never, replace: true });
    } else {
      setAuthed(true);
    }
    setReady(true);
  }, [navigate, path]);

  if (!ready || !authed) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
