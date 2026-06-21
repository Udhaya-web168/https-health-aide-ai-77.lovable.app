import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Check, Clock, MapPin, Plus, User, X, UserCheck, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { APPOINTMENTS, DOCTORS, type Appointment, type ApptStatus } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><AppointmentsPage /></RequireAuth>,
});

const STATUS_STYLES: Record<ApptStatus, string> = {
  Confirmed: "bg-primary/15 text-primary",
  Waiting: "bg-warning/15 text-warning",
  Completed: "bg-success/15 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
};

function AppointmentsPage() {
  const [appts, setAppts] = useState<Appointment[]>(APPOINTMENTS);

  function updateStatus(id: string, status: ApptStatus) {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Marked ${status}`);
  }

  const male = appts.filter(a => a.gender === "Male");
  const female = appts.filter(a => a.gender === "Female");

  const stats = {
    total: appts.length,
    confirmed: appts.filter(a => a.status === "Confirmed").length,
    waiting: appts.filter(a => a.status === "Waiting").length,
    completed: appts.filter(a => a.status === "Completed").length,
    cancelled: appts.filter(a => a.status === "Cancelled").length,
  };

  return (
    <AppLayout title="Appointments" subtitle="Daily schedule, calendar and doctor-wise view">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { l: "Total", v: stats.total, c: "primary", i: CalendarDays },
          { l: "Confirmed", v: stats.confirmed, c: "primary", i: Check },
          { l: "Waiting", v: stats.waiting, c: "warning", i: Clock },
          { l: "Completed", v: stats.completed, c: "success", i: CalendarCheck },
          { l: "Cancelled", v: stats.cancelled, c: "destructive", i: X },
        ].map(s => (
          <Card key={s.l} className="border-border/60"><CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklab, var(--${s.c}) 15%, transparent)`, color: `var(--${s.c})` }}>
              <s.i className="size-5" />
            </div>
            <div><p className="text-xl font-bold leading-none">{s.v}</p><p className="text-xs text-muted-foreground mt-1">{s.l}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="male" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="male">Male ({male.length})</TabsTrigger>
            <TabsTrigger value="female">Female ({female.length})</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="doctor">Doctor-wise</TabsTrigger>
          </TabsList>
          <Button onClick={() => toast.info("Booking flow coming soon")}><Plus className="size-4 mr-1.5" />Book Appointment</Button>
        </div>

        <TabsContent value="male"><ApptList items={male} onUpdate={updateStatus} /></TabsContent>
        <TabsContent value="female"><ApptList items={female} onUpdate={updateStatus} /></TabsContent>

        <TabsContent value="calendar">
          <CalendarView appts={appts} />
        </TabsContent>

        <TabsContent value="doctor">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCTORS.map(d => {
              const list = appts.filter(a => a.doctor === d.name);
              return (
                <Card key={d.id} className="border-border/60"><CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={d.avatar} alt="" className="size-10 rounded-full bg-muted" />
                    <div><p className="font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.specialty}</p></div>
                  </div>
                  {list.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">No appointments today.</p>
                  ) : (
                    <div className="space-y-2">
                      {list.map(a => (
                        <div key={a.id} className="flex items-center justify-between text-sm border-l-2 border-primary pl-3">
                          <div><p className="font-medium">{a.patient}</p><p className="text-xs text-muted-foreground">{a.time} · {a.department}</p></div>
                          <Badge className={STATUS_STYLES[a.status]}>{a.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent></Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function ApptList({ items, onUpdate }: { items: Appointment[]; onUpdate: (id: string, s: ApptStatus) => void }) {
  if (items.length === 0) return <Card><CardContent className="p-10 text-center text-muted-foreground">No appointments.</CardContent></Card>;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((a, i) => (
        <Card key={a.id} className="border-border/60 hover:shadow-[var(--shadow-card)] transition-shadow animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center"><User className="size-5" /></div>
                <div><p className="font-semibold">{a.patient}</p><p className="text-xs text-muted-foreground">{a.id}</p></div>
              </div>
              <Badge className={STATUS_STYLES[a.status]}>{a.status}</Badge>
            </div>
            <div className="space-y-1.5 text-sm border-t border-border/60 pt-3">
              <p className="flex items-center gap-2 text-muted-foreground"><Clock className="size-3.5" />{a.time}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-3.5" />{a.department}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><UserCheck className="size-3.5" />{a.doctor}</p>
            </div>
            <div className="flex gap-1.5 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onUpdate(a.id, "Completed")}>Complete</Button>
              <Button size="sm" variant="ghost" onClick={() => onUpdate(a.id, "Cancelled")} className="text-destructive"><X className="size-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarView({ appts }: { appts: Appointment[] }) {
  const now = new Date();
  const year = now.getFullYear(); const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const monthName = now.toLocaleString("default", { month: "long" });
  const todayDate = now.getDate();
  const countByDay: Record<number, number> = {};
  appts.forEach(a => {
    const d = new Date(a.date).getDate();
    countByDay[d] = (countByDay[d] || 0) + 1;
  });

  return (
    <Card className="border-border/60"><CardContent className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold">{monthName} {year}</p>
        <Badge variant="outline">{appts.length} this month</Badge>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-xs">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center font-medium text-muted-foreground p-2">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={`aspect-square rounded-md border ${d === todayDate ? "border-primary bg-primary/10" : "border-border/60"} p-1.5 flex flex-col justify-between ${!d ? "opacity-0" : ""}`}>
            <span className={`text-xs ${d === todayDate ? "font-bold text-primary" : ""}`}>{d}</span>
            {d && countByDay[d] && <span className="text-[10px] bg-primary text-primary-foreground rounded px-1 self-end">{countByDay[d]}</span>}
          </div>
        ))}
      </div>
    </CardContent></Card>
  );
}
