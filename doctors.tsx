import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Star, Stethoscope, CalendarPlus, MessageSquare } from "lucide-react";
import { useState } from "react";
import { DOCTORS } from "@/lib/hospital-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><DoctorsPage /></RequireAuth>,
});

const AVAIL_STYLES = {
  Available: "bg-success/15 text-success",
  Busy: "bg-warning/15 text-warning",
  "On Leave": "bg-muted text-muted-foreground",
} as const;

function DoctorsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "Available" | "Busy" | "On Leave">("all");
  const list = DOCTORS.filter(d =>
    (filter === "all" || d.availability === filter) &&
    (!q || d.name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <AppLayout title="Doctors" subtitle="Specialists and availability across departments">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors or specialty…" className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "Available", "Busy", "On Leave"] as const).map(f => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((d, i) => (
          <Card key={d.id} className="border-border/60 hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="p-5 text-center">
              <div className="relative inline-block">
                <img src={d.avatar} alt="" className="size-20 rounded-full bg-muted mx-auto" />
                <span className={`absolute bottom-0 right-0 size-4 rounded-full border-2 border-card ${
                  d.availability === "Available" ? "bg-success" : d.availability === "Busy" ? "bg-warning" : "bg-muted-foreground"
                }`} />
              </div>
              <p className="font-semibold mt-3">{d.name}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-0.5">
                <Stethoscope className="size-3" />{d.specialty}
              </p>
              <Badge className={`mt-2 ${AVAIL_STYLES[d.availability]}`}>{d.availability}</Badge>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="size-3 fill-warning text-warning" />{d.rating}</span>
                <span>{d.patients} patients</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-4">
                <Button size="sm" variant="outline"><CalendarPlus className="size-3.5 mr-1" />Book</Button>
                <Button size="sm" variant="ghost"><MessageSquare className="size-3.5 mr-1" />Chat</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
