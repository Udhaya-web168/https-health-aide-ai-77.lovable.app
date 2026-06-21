import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, CreditCard, Download, FileText, Receipt, TrendingUp } from "lucide-react";
import { useState } from "react";
import { BILLS, type Bill } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><BillingPage /></RequireAuth>,
});

function BillingPage() {
  const [list, setList] = useState<Bill[]>(BILLS);
  const [view, setView] = useState<Bill | null>(null);

  const total = list.reduce((a, b) => a + b.consultation + b.medicine + b.lab, 0);
  const paid = list.filter(b => b.status === "Paid").reduce((a, b) => a + b.consultation + b.medicine + b.lab, 0);
  const pending = total - paid;

  function markPaid(id: string) {
    setList(prev => prev.map(b => b.id === id ? { ...b, status: "Paid" } : b));
    toast.success("Invoice marked as paid");
  }

  return (
    <AppLayout title="Billing & Invoices" subtitle="Manage invoices, payments and revenue">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Revenue" value={`₹${total.toLocaleString()}`} icon={TrendingUp} tint="primary" />
        <StatCard label="Paid" value={`₹${paid.toLocaleString()}`} icon={CheckCircle2} tint="success" />
        <StatCard label="Pending" value={`₹${pending.toLocaleString()}`} icon={Receipt} tint="warning" />
        <StatCard label="Invoices" value={list.length} icon={FileText} tint="chart-5" />
      </div>

      <Card className="border-border/60"><CardContent className="p-4 md:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-3 px-3 font-medium">Invoice</th>
                <th className="py-3 px-3 font-medium">Patient</th>
                <th className="py-3 px-3 font-medium hidden md:table-cell">Doctor</th>
                <th className="py-3 px-3 font-medium hidden lg:table-cell">Date</th>
                <th className="py-3 px-3 font-medium text-right">Amount</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b, i) => {
                const amount = b.consultation + b.medicine + b.lab;
                return (
                  <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="py-3 px-3 font-mono text-xs">{b.id}</td>
                    <td className="py-3 px-3 font-medium">{b.patient}</td>
                    <td className="py-3 px-3 hidden md:table-cell text-muted-foreground">{b.doctor}</td>
                    <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground">{b.date}</td>
                    <td className="py-3 px-3 text-right font-semibold">₹{amount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <Badge className={b.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}>{b.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setView(b)}><FileText className="size-3.5 mr-1" />View</Button>
                      {b.status === "Pending" && (
                        <Button size="sm" variant="outline" onClick={() => markPaid(b.id)}><CreditCard className="size-3.5 mr-1" />Pay</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent></Card>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent>
          {view && <InvoiceView b={view} />}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function StatCard({ label, value, icon: Icon, tint }: any) {
  return (
    <Card className="border-border/60"><CardContent className="p-4 flex items-center gap-3">
      <div className="size-10 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklab, var(--${tint}) 15%, transparent)`, color: `var(--${tint})` }}>
        <Icon className="size-5" />
      </div>
      <div><p className="text-xl font-bold leading-none">{value}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></div>
    </CardContent></Card>
  );
}

function InvoiceView({ b }: { b: Bill }) {
  const total = b.consultation + b.medicine + b.lab;
  function downloadPdf() {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<!doctype html><html><head><title>${b.id}</title>
      <style>body{font-family:system-ui;max-width:600px;margin:32px auto;color:#0f172a;padding:0 20px}
      h1{color:#2563eb}table{width:100%;border-collapse:collapse;margin-top:16px}
      td,th{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left}
      .total{font-weight:700;font-size:18px}.right{text-align:right}</style></head>
      <body><h1>MediCare AI Hospital</h1>
      <p>Invoice ${b.id} · ${b.date}</p>
      <p>Patient: <strong>${b.patient}</strong><br/>Doctor: ${b.doctor}</p>
      <table><tr><th>Item</th><th class="right">Amount</th></tr>
      <tr><td>Consultation Fee</td><td class="right">₹${b.consultation}</td></tr>
      <tr><td>Medicine</td><td class="right">₹${b.medicine}</td></tr>
      <tr><td>Lab Tests</td><td class="right">₹${b.lab}</td></tr>
      <tr class="total"><td>Total</td><td class="right">₹${total}</td></tr></table>
      <p style="margin-top:32px;color:#64748b;font-size:12px">Status: ${b.status} · Thank you for choosing MediCare AI Hospital.</p>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  }
  return (
    <>
      <DialogHeader><DialogTitle>Invoice {b.id}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{b.patient}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span>{b.doctor}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{b.date}</span></div>
        <div className="border-t border-border/60 pt-3 space-y-2">
          <Row label="Consultation Fee" v={b.consultation} />
          <Row label="Medicine" v={b.medicine} />
          <Row label="Lab Tests" v={b.lab} />
        </div>
        <div className="border-t border-border/60 pt-3 flex justify-between text-lg font-bold">
          <span>Total</span><span>₹{(b.consultation + b.medicine + b.lab).toLocaleString()}</span>
        </div>
        <Badge className={b.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}>{b.status}</Badge>
        <Button onClick={downloadPdf} className="w-full"><Download className="size-4 mr-1.5" />Download PDF</Button>
      </div>
    </>
  );
}
function Row({ label, v }: { label: string; v: number }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>₹{v.toLocaleString()}</span></div>;
}
