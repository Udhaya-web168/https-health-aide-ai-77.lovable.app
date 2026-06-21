import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SLA } from "@/lib/sla";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/sla")({
  head: () => ({
    meta: [
      { title: "SLA & Analytics — MediCare AI Hospital" },
      { name: "description", content: "Tickets, response times, SLA breach %, AI usage and active users." },
    ],
  }),
  component: () => <RequireAuth><SlaPage /></RequireAuth>,
});

const tickets = [
  { priority: "P1", count: 6, breach: 1 },
  { priority: "P2", count: 18, breach: 2 },
  { priority: "P3", count: 47, breach: 4 },
  { priority: "P4", count: 92, breach: 3 },
];

const aiUsage = [
  { name: "ChatGPT", value: 312, color: "var(--color-chart-1)" },
  { name: "Gemini", value: 489, color: "var(--color-chart-2)" },
];

function SlaPage() {
  const totalTickets = tickets.reduce((a, b) => a + b.count, 0);
  const totalBreach = tickets.reduce((a, b) => a + b.breach, 0);
  const breachPct = ((totalBreach / totalTickets) * 100).toFixed(1);

  const kpis = [
    { label: "Total Tickets", value: totalTickets },
    { label: "Avg Response", value: "47s" },
    { label: "Avg Resolution", value: "3h 12m" },
    { label: "SLA Breach %", value: `${breachPct}%` },
    { label: "AI Requests", value: aiUsage.reduce((a, b) => a + b.value, 0) },
    { label: "Active Users", value: 86 },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">SLA & Analytics</h1>
        <p className="text-muted-foreground text-sm">Service-level performance and AI usage overview.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)] border-border/60">
          <CardHeader><CardTitle className="text-base">Tickets by Priority</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tickets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="priority" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="breach" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border/60">
          <CardHeader><CardTitle className="text-base">AI Model Usage</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aiUsage} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                    {aiUsage.map((a) => <Cell key={a.name} fill={a.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              {aiUsage.map(a => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm" style={{ background: a.color }} /> {a.name} ({a.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/60">
        <CardHeader><CardTitle className="text-base">SLA Priority Matrix</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(["P1","P2","P3","P4"] as const).map((p) => {
            const s = SLA[p];
            return (
              <div key={p} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{p}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">Response</p>
                <p className="font-medium mb-2">{s.response}</p>
                <p className="text-xs text-muted-foreground">Resolution</p>
                <p className="font-medium">{s.resolution}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
