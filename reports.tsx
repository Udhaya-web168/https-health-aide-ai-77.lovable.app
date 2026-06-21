import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Activity, Brain, Download, FileImage, FlaskConical, HeartPulse, Search } from "lucide-react";
import { useState } from "react";
import { REPORTS } from "@/lib/hospital-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><ReportsPage /></RequireAuth>,
});

const ICONS = {
  "Blood Report": FlaskConical,
  "X-Ray": FileImage,
  "MRI": Brain,
  "ECG": Activity,
} as const;

const TINTS = {
  "Blood Report": "destructive",
  "X-Ray": "primary",
  "MRI": "chart-5",
  "ECG": "success",
} as const;

function ReportsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const list = REPORTS.filter(r =>
    (type === "all" || r.type === type) &&
    (!q || r.patient.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
  );

  function downloadPdf(r: typeof REPORTS[number]) {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<!doctype html><html><head><title>${r.id}</title>
      <style>body{font-family:system-ui;max-width:600px;margin:32px auto;padding:0 20px;color:#0f172a}
      h1{color:#2563eb}.muted{color:#64748b}</style></head>
      <body><h1>MediCare AI Hospital</h1><p class="muted">Medical Report · ${r.id}</p>
      <h2>${r.type}</h2>
      <p>Patient: <strong>${r.patient}</strong><br/>Doctor: ${r.doctor}<br/>Date: ${r.date}</p>
      <h3>Summary</h3><p>${r.summary}</p>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  }

  return (
    <AppLayout title="Medical Reports" subtitle="Blood reports, X-Ray, MRI, ECG and more">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient or report ID…" className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "Blood Report", "X-Ray", "MRI", "ECG"].map(t => (
            <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)}>
              {t === "all" ? "All" : t}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r, i) => {
          const Icon = ICONS[r.type];
          const tint = TINTS[r.type];
          return (
            <Card key={r.id} className="border-border/60 hover:shadow-[var(--shadow-card)] transition-shadow animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="size-12 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklab, var(--${tint}) 15%, transparent)`, color: `var(--${tint})` }}>
                    <Icon className="size-6" />
                  </div>
                  <Badge variant="outline">{r.id}</Badge>
                </div>
                <p className="font-semibold">{r.type}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{r.patient} · {r.date}</p>
                <p className="text-sm mt-3 line-clamp-2">{r.summary}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                  <p className="text-xs text-muted-foreground">{r.doctor}</p>
                  <Button size="sm" variant="outline" onClick={() => downloadPdf(r)}><Download className="size-3.5 mr-1.5" />PDF</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
