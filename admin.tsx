import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot, Building2, Calendar, CreditCard, FileText, Pill, ShieldAlert, Stethoscope, UserCog, Users,
} from "lucide-react";
import { APPOINTMENTS, BILLS, DEPARTMENTS, DOCTORS, PATIENTS, REPORTS } from "@/lib/hospital-data";
import { DEMO_USERS } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><AdminPage /></RequireAuth>,
});

const MEDICINES = [
  { name: "Paracetamol 500mg", stock: 1240, price: 12 },
  { name: "Amoxicillin 250mg", stock: 480, price: 38 },
  { name: "Atorvastatin 10mg", stock: 320, price: 65 },
  { name: "Metformin 500mg", stock: 600, price: 22 },
  { name: "Cetirizine 10mg", stock: 980, price: 8 },
];

const SLA_TICKETS = [
  { id: "T-501", title: "Lab result delay", priority: "P2", status: "Open", patient: "Mohammed Ali" },
  { id: "T-502", title: "Billing query", priority: "P3", status: "Resolved", patient: "Lakshmi Devi" },
  { id: "T-503", title: "Emergency triage", priority: "P1", status: "In Progress", patient: "Walk-in #ER-3" },
];

function AdminPage() {
  return (
    <AppLayout title="Admin Console" subtitle="Master data, configurations and oversight">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <Stat label="Patients" value={PATIENTS.length} icon={Users} tint="primary" />
        <Stat label="Doctors" value={DOCTORS.length} icon={Stethoscope} tint="chart-2" />
        <Stat label="Receptionists" value={1} icon={UserCog} tint="chart-5" />
        <Stat label="Appointments" value={APPOINTMENTS.length} icon={Calendar} tint="success" />
        <Stat label="Departments" value={DEPARTMENTS.length} icon={Building2} tint="warning" />
        <Stat label="Reports" value={REPORTS.length} icon={FileText} tint="chart-4" />
      </div>

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="ai">AI Usage</TabsTrigger>
          <TabsTrigger value="sla">SLA Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card><CardContent className="p-5">
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-3 px-3">User</th><th className="py-3 px-3">Email</th><th className="py-3 px-3">Role</th><th className="py-3 px-3">Status</th>
              </tr></thead>
              <tbody>
                {DEMO_USERS.map(u => (
                  <tr key={u.email} className="border-b border-border/60 last:border-0">
                    <td className="py-3 px-3 flex items-center gap-3">
                      <img src={u.user.avatar} className="size-9 rounded-full bg-muted" alt="" />
                      <span className="font-medium">{u.user.name}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-3 capitalize"><Badge variant="outline">{u.user.role}</Badge></td>
                    <td className="py-3 px-3"><Badge className="bg-success/15 text-success">Active</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEPARTMENTS.map(d => (
              <Card key={d} className="border-border/60"><CardContent className="p-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Building2 className="size-5" /></div>
                <div><p className="font-medium">{d}</p><p className="text-xs text-muted-foreground">{DOCTORS.filter(x => x.specialty.includes(d.split(" ")[0])).length || 1} doctors</p></div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medicines" className="mt-4">
          <Card><CardContent className="p-5">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-3 px-3">Medicine</th><th className="py-3 px-3 text-right">Stock</th><th className="py-3 px-3 text-right">Price</th><th className="py-3 px-3">Status</th>
              </tr></thead>
              <tbody>{MEDICINES.map(m => (
                <tr key={m.name} className="border-b border-border/60 last:border-0">
                  <td className="py-3 px-3 flex items-center gap-2"><Pill className="size-4 text-primary" />{m.name}</td>
                  <td className="py-3 px-3 text-right font-medium">{m.stock}</td>
                  <td className="py-3 px-3 text-right">₹{m.price}</td>
                  <td className="py-3 px-3"><Badge className={m.stock > 500 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}>{m.stock > 500 ? "In Stock" : "Low Stock"}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card><CardContent className="p-5">
              <div className="flex items-center gap-3"><Bot className="size-6 text-primary" /><div><p className="text-2xl font-bold">1,284</p><p className="text-xs text-muted-foreground">AI Conversations · 7d</p></div></div>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <p className="text-xs uppercase text-muted-foreground mb-2">Model split</p>
              <div className="space-y-1.5">
                <Bar label="Gemini" value={62} />
                <Bar label="ChatGPT" value={38} />
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-5">
              <p className="text-xs uppercase text-muted-foreground mb-2">Top intents</p>
              <ul className="text-sm space-y-1.5">
                <li className="flex justify-between"><span>Symptom triage</span><span className="text-muted-foreground">42%</span></li>
                <li className="flex justify-between"><span>Medicine info</span><span className="text-muted-foreground">28%</span></li>
                <li className="flex justify-between"><span>Appointment help</span><span className="text-muted-foreground">19%</span></li>
                <li className="flex justify-between"><span>Diet & lifestyle</span><span className="text-muted-foreground">11%</span></li>
              </ul>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="sla" className="mt-4">
          <Card><CardContent className="p-5">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-3 px-3">Ticket</th><th className="py-3 px-3">Title</th><th className="py-3 px-3">Patient</th><th className="py-3 px-3">Priority</th><th className="py-3 px-3">Status</th>
              </tr></thead>
              <tbody>{SLA_TICKETS.map(t => (
                <tr key={t.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 px-3 font-mono text-xs">{t.id}</td>
                  <td className="py-3 px-3">{t.title}</td>
                  <td className="py-3 px-3 text-muted-foreground">{t.patient}</td>
                  <td className="py-3 px-3"><Badge variant="outline" className={
                    t.priority === "P1" ? "border-destructive text-destructive" :
                    t.priority === "P2" ? "border-warning text-warning" : "border-primary text-primary"
                  }>{t.priority}</Badge></td>
                  <td className="py-3 px-3"><Badge className={
                    t.status === "Resolved" ? "bg-success/15 text-success" :
                    t.status === "Open" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
                  }>{t.status}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function Stat({ label, value, icon: Icon, tint }: any) {
  return (
    <Card className="border-border/60"><CardContent className="p-4 text-center">
      <div className="size-10 rounded-xl mx-auto grid place-items-center mb-2" style={{ background: `color-mix(in oklab, var(--${tint}) 15%, transparent)`, color: `var(--${tint})` }}>
        <Icon className="size-5" />
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </CardContent></Card>
  );
}
function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5"><span>{label}</span><span className="text-muted-foreground">{value}%</span></div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
