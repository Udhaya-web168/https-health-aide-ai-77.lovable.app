import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ambulance, Hospital, MapPin, Phone, Siren, Stethoscope } from "lucide-react";
import { EMERGENCY_CONTACTS, EMERGENCY_DOCTORS } from "@/lib/hospital-data";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><EmergencyPage /></RequireAuth>,
});

function EmergencyPage() {
  return (
    <AppLayout title="Emergency Response" subtitle="Immediate help, contacts and emergency staff">
      {/* Alert banner */}
      <Card className="border-destructive/40 bg-destructive/5 mb-6 overflow-hidden">
        <CardContent className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="size-14 shrink-0 rounded-2xl bg-destructive text-destructive-foreground grid place-items-center animate-pulse-ring">
            <Siren className="size-7" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-destructive flex items-center gap-1.5"><AlertTriangle className="size-4" /> Emergency Mode</p>
            <p className="text-sm text-foreground/80 mt-0.5">For life-threatening situations call <strong>108</strong> immediately. Triage staff are on standby 24×7.</p>
          </div>
          <Button size="lg" variant="destructive" className="gap-2" onClick={() => window.location.href = "tel:108"}>
            <Ambulance className="size-5" /> Call Ambulance · 108
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="border-border/60"><CardContent className="p-5">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Phone className="size-4 text-destructive" />Emergency Contacts</p>
          <div className="space-y-2">
            {EMERGENCY_CONTACTS.map(c => (
              <div key={c.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/60 hover:bg-muted">
                <div><p className="font-medium text-sm">{c.label}</p><p className="text-xs text-muted-foreground">{c.phone}</p></div>
                <Button size="sm" variant="destructive" onClick={() => window.location.href = `tel:${c.phone.replace(/\s/g,"")}`}>
                  <Phone className="size-3.5 mr-1" />Call
                </Button>
              </div>
            ))}
          </div>
        </CardContent></Card>

        <Card className="border-border/60"><CardContent className="p-5">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Hospital className="size-4 text-primary" />Nearest Hospital</p>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
            <iframe
              title="map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.20,13.04,80.30,13.10&layer=mapnik"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm flex items-center gap-1.5"><MapPin className="size-3.5 text-destructive" />MediCare AI Hospital, Anna Salai</p>
              <p className="text-xs text-muted-foreground">2.4 km · Open 24×7 · 120 beds</p>
            </div>
            <Button size="sm" variant="outline">Get Directions</Button>
          </div>
        </CardContent></Card>
      </div>

      <Card className="border-border/60 mt-5"><CardContent className="p-5">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Stethoscope className="size-4 text-primary" />Emergency Doctors on Duty</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMERGENCY_DOCTORS.map(d => (
            <div key={d.name} className="p-4 rounded-xl border border-border/60 hover:border-destructive transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{d.name}</p>
                <Badge className="bg-success/15 text-success">On Duty</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{d.specialty}</p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => window.location.href = `tel:${d.phone.replace(/\s/g,"")}`}>
                <Phone className="size-3.5 mr-1.5" />{d.phone}
              </Button>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </AppLayout>
  );
}
