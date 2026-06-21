import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity, AlertTriangle, ArrowUpRight, Bot, Calendar, CreditCard,
  HeartPulse, Stethoscope, TrendingUp, Users,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
});

const KPIS = [
  { label: "Today's Patients", value: 248, delta: "+12%", icon: Users, tint: "primary" },
  { label: "Today's Appointments", value: 86, delta: "+4%", icon: Calendar, tint: "chart-2" },
  { label: "Doctors Available", value: 32, delta: "+2", icon: Stethoscope, tint: "chart-5" },
  { label: "Emergency Cases", value: 6, delta: "+1", icon: HeartPulse, tint: "destructive" },
  { label: "AI Conversations", value: 412, delta: "+38%", icon: Bot, tint: "chart-4" },
  { label: "Revenue (Today)", value: "₹4.82L", delta: "+9.4%", icon: TrendingUp, tint: "success" },
  { label: "Pending Bills", value: 23, delta: "−5", icon: CreditCard, tint: "warning" },
];

const APPT_BY_DAY = [
  { day: "Mon", confirmed: 64, completed: 58, cancelled: 6 },
  { day: "Tue", confirmed: 72, completed: 65, cancelled: 7 },
  { day: "Wed", confirmed: 81, completed: 70, cancelled: 11 },
  { day: "Thu", confirmed: 69, completed: 61, cancelled: 8 },
  { day: "Fri", confirmed: 88, completed: 79, cancelled: 9 },
  { day: "Sat", confirmed: 94, completed: 84, cancelled: 10 },
  { day: "Sun", confirmed: 52, completed: 49, cancelled: 3 },
];

const DEPT = [
  { name: "Cardiology", value: 124 },
  { name: "Pediatrics", value: 98 },
  { name: "Orthopedic", value: 76 },
  { name: "Gynecology", value: 88 },
  { name: "Neurology", value: 54 },
  { name: "General Medicine", value: 162 },
];

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)"];

const ACTIVITIES = [
  { icon: Users, color: "primary", title: "New patient registered", desc: "Arun Kumar · P001", time: "2m ago" },
  { icon: Calendar, color: "chart-2", title: "Appointment confirmed", desc: "Lakshmi Devi → Dr. Rajesh", time: "8m ago" },
  { icon: AlertTriangle, color: "destructive", title: "Emergency triaged", desc: "Chest pain · Room ER-3", time: "14m ago" },
  { icon: CreditCard, color: "warning", title: "Invoice generated", desc: "INV-002 · ₹3,540", time: "22m ago" },
  { icon: Bot, color: "chart-4", title: "AI consultation completed", desc: "P3 · Fever follow-up", time: "31m ago" },
  { icon: Stethoscope, color: "success", title: "Doctor checked in", desc: "Dr. Meena · Gynecology", time: "44m ago" },
];

function Dashboard() {
  return (
    <AppLayout title="Dashboard" subtitle="Overview of today's hospital activity">
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-6">
        {KPIS.map((k, i) => (
          <Card key={k.label} className="shadow-[var(--shadow-card)] border-border/60 hover:-translate-y-0.5 transition-transform animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`size-10 rounded-xl grid place-items-center`}
                     style={{ background: `color-mix(in oklab, var(--${k.tint}) 15%, transparent)`, color: `var(--${k.tint})` }}>
                  <k.icon className="size-5" />
                </div>
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <ArrowUpRight className="size-3" />{k.delta}
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold leading-none">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)] border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold">Appointment Statistics</p>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <Badge variant="outline" className="gap-1"><Activity className="size-3" /> Weekly</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={APPT_BY_DAY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="confirmed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cancelled" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border/60">
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-1">Department Statistics</p>
            <p className="text-xs text-muted-foreground mb-2">Patients this week</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DEPT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {DEPT.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {DEPT.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                  <span className="size-2 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="truncate text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activities + revenue trend */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)] border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Revenue Trend</p>
              <Badge variant="outline">7 Day</Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={APPT_BY_DAY.map(d => ({ day: d.day, revenue: d.completed * 1850 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4, fill: "var(--chart-1)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Recent Activities</p>
              <Link to="/sla" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="size-8 rounded-full grid place-items-center shrink-0"
                       style={{ background: `color-mix(in oklab, var(--${a.color}) 15%, transparent)`, color: `var(--${a.color})` }}>
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
