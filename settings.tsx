import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth, useAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, DatabaseBackup, LogOut, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><SettingsPage /></RequireAuth>,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const user = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [notif, setNotif] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);

  return (
    <AppLayout title="Settings" subtitle="Personalize your workspace and account">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile */}
        <Card className="border-border/60"><CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <User className="size-4 text-primary" /><p className="font-semibold">Profile</p>
          </div>
          {user && (
            <div className="text-center">
              <img src={user.avatar} alt="" className="size-20 rounded-full bg-muted mx-auto" />
              <p className="font-semibold mt-3">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              <Button variant="outline" className="mt-4 w-full">Edit Profile</Button>
            </div>
          )}
        </CardContent></Card>

        {/* Appearance & Language */}
        <Card className="border-border/60 lg:col-span-2"><CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold flex items-center gap-2">{theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle clinical light theme or low-light dark mode.</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
          <div className="border-t border-border/60 pt-5">
            <Label>Language</Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ta">தமிழ் · Tamil</SelectItem>
                <SelectItem value="hi">हिन्दी · Hindi</SelectItem>
                <SelectItem value="te">తెలుగు · Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent></Card>

        {/* Notifications */}
        <Card className="border-border/60 lg:col-span-2"><CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4"><Bell className="size-4 text-primary" /><p className="font-semibold">Notifications</p></div>
          <div className="space-y-4">
            <ToggleRow label="In-app notifications" desc="Show toasts and badge alerts." v={notif} onChange={setNotif} />
            <ToggleRow label="Email alerts" desc="Critical lab results and emergencies." v={email} onChange={setEmail} />
            <ToggleRow label="SMS alerts" desc="Appointment reminders via SMS." v={sms} onChange={setSms} />
          </div>
        </CardContent></Card>

        {/* Backup */}
        <Card className="border-border/60"><CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4"><DatabaseBackup className="size-4 text-primary" /><p className="font-semibold">Backup</p></div>
          <p className="text-xs text-muted-foreground mb-3">Last backup: today at 03:00 AM</p>
          <Button variant="outline" className="w-full" onClick={() => toast.success("Backup started")}>Run Backup Now</Button>
        </CardContent></Card>

        {/* Logout */}
        <Card className="border-destructive/30 lg:col-span-3"><CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Sign out of MediCare AI</p>
            <p className="text-xs text-muted-foreground mt-0.5">You'll need to enter your credentials again.</p>
          </div>
          <Button variant="destructive" onClick={() => { logout(); navigate({ to: "/login", replace: true }); }}>
            <LogOut className="size-4 mr-1.5" />Logout
          </Button>
        </CardContent></Card>
      </div>
    </AppLayout>
  );
}

function ToggleRow({ label, desc, v, onChange }: { label: string; desc: string; v: boolean; onChange: (b: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div><p className="font-medium text-sm">{label}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
      <Switch checked={v} onCheckedChange={onChange} />
    </div>
  );
}
