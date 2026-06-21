import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RequireAuth } from "@/components/require-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3, FileText, Filter, MoreVertical, Plus, Search, Trash2, UserPlus, Eye, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { PATIENTS, type Patient } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — MediCare AI Hospital" }] }),
  component: () => <RequireAuth><PatientsPage /></RequireAuth>,
});

function PatientsPage() {
  const [list, setList] = useState<Patient[]>(PATIENTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => list.filter(p => {
    const q = query.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.disease.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || p.status === statusFilter;
    return matchQ && matchS;
  }), [list, query, statusFilter]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleDelete(p: Patient) {
    setList(prev => prev.filter(x => x.id !== p.id));
    toast.success(`Removed ${p.name}`);
  }
  function exportCsv() {
    const header = "ID,Name,Gender,Age,Blood,Phone,Disease,Doctor,Status\n";
    const rows = filtered.map(p => [p.id, p.name, p.gender, p.age, p.bloodGroup, p.phone, p.disease, p.doctor, p.status].join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "patients.csv"; a.click();
    toast.success("Patients exported");
  }

  return (
    <AppLayout title="Patients" subtitle="Manage patient records and medical history">
      <Card className="shadow-[var(--shadow-card)] border-border/60">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by name, ID or condition…" className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36"><Filter className="size-3.5 mr-1" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Admitted">Admitted</SelectItem>
                  <SelectItem value="Discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportCsv}><Download className="size-4 mr-1.5" />Export</Button>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button><UserPlus className="size-4 mr-1.5" />Add Patient</Button>
                </DialogTrigger>
                <PatientFormDialog
                  title="Register New Patient"
                  onSubmit={(p) => { setList(prev => [{ ...p, id: `P${String(prev.length + 1).padStart(3, "0")}` }, ...prev]); setAddOpen(false); toast.success("Patient registered"); }}
                />
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 px-3 font-medium">Patient</th>
                  <th className="py-3 px-3 font-medium hidden sm:table-cell">ID</th>
                  <th className="py-3 px-3 font-medium hidden md:table-cell">Age / Gender</th>
                  <th className="py-3 px-3 font-medium hidden md:table-cell">Blood</th>
                  <th className="py-3 px-3 font-medium hidden lg:table-cell">Phone</th>
                  <th className="py-3 px-3 font-medium">Condition</th>
                  <th className="py-3 px-3 font-medium hidden lg:table-cell">Doctor</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p, i) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50 animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt="" className="size-10 rounded-full bg-muted shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground sm:hidden">{p.id} · {p.gender}, {p.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell"><span className="text-xs font-mono text-muted-foreground">{p.id}</span></td>
                    <td className="py-3 px-3 hidden md:table-cell">{p.age} · {p.gender}</td>
                    <td className="py-3 px-3 hidden md:table-cell"><Badge variant="outline" className="font-mono">{p.bloodGroup}</Badge></td>
                    <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground">{p.phone}</td>
                    <td className="py-3 px-3">{p.disease}</td>
                    <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground">{p.doctor}</td>
                    <td className="py-3 px-3">
                      <Badge className={
                        p.status === "Active" ? "bg-success/15 text-success hover:bg-success/15" :
                        p.status === "Admitted" ? "bg-warning/15 text-warning hover:bg-warning/15" :
                        "bg-muted text-muted-foreground hover:bg-muted"
                      }>{p.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8"><MoreVertical className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewPatient(p)}><Eye className="size-4 mr-2" />View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditPatient(p)}><Edit3 className="size-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setHistoryPatient(p)}><FileText className="size-4 mr-2" />Medical History</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p)}><Trash2 className="size-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <p>Showing {paged.length} of {filtered.length} patients</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <span className="px-3 py-1.5 rounded-md bg-muted">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog open={!!viewPatient} onOpenChange={() => setViewPatient(null)}>
        <DialogContent>
          {viewPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img src={viewPatient.avatar} className="size-12 rounded-full bg-muted" alt="" />
                  <div><div>{viewPatient.name}</div><div className="text-xs font-normal text-muted-foreground">{viewPatient.id}</div></div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Age">{viewPatient.age}</Field>
                <Field label="Gender">{viewPatient.gender}</Field>
                <Field label="Blood Group">{viewPatient.bloodGroup}</Field>
                <Field label="Phone">{viewPatient.phone}</Field>
                <Field label="Condition">{viewPatient.disease}</Field>
                <Field label="Doctor">{viewPatient.doctor}</Field>
                <Field label="Status"><Badge>{viewPatient.status}</Badge></Field>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* History */}
      <Dialog open={!!historyPatient} onOpenChange={() => setHistoryPatient(null)}>
        <DialogContent>
          {historyPatient && (
            <>
              <DialogHeader>
                <DialogTitle>Medical History · {historyPatient.name}</DialogTitle>
                <DialogDescription>{historyPatient.id} · {historyPatient.disease}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {historyPatient.history.map((h, i) => (
                  <div key={i} className="border-l-2 border-primary pl-3 py-1">
                    <p className="text-xs text-muted-foreground">{h.date} · {h.doctor}</p>
                    <p className="text-sm mt-0.5">{h.note}</p>
                  </div>
                ))}
                {historyPatient.history.length === 0 && (
                  <p className="text-sm text-muted-foreground">No visits recorded.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editPatient} onOpenChange={(o) => !o && setEditPatient(null)}>
        {editPatient && (
          <PatientFormDialog
            title={`Edit ${editPatient.name}`}
            initial={editPatient}
            onSubmit={(p) => {
              setList(prev => prev.map(x => x.id === editPatient.id ? { ...editPatient, ...p } : x));
              setEditPatient(null);
              toast.success("Patient updated");
            }}
          />
        )}
      </Dialog>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-0.5">{children}</p></div>
  );
}

function PatientFormDialog({
  title, initial, onSubmit,
}: {
  title: string;
  initial?: Patient;
  onSubmit: (p: Omit<Patient, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    gender: (initial?.gender ?? "Male") as Patient["gender"],
    age: initial?.age ?? 0,
    bloodGroup: initial?.bloodGroup ?? "O+",
    phone: initial?.phone ?? "",
    disease: initial?.disease ?? "",
    doctor: initial?.doctor ?? "Dr. Priya",
    status: (initial?.status ?? "Active") as Patient["status"],
  });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          avatar: initial?.avatar ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(form.name || "Patient")}`,
          history: initial?.history ?? [],
        });
      }} className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Label>Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Age</Label><Input type="number" required value={form.age || ""} onChange={e => setForm({ ...form, age: +e.target.value })} /></div>
        <div><Label>Gender</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Patient["gender"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>Blood Group</Label><Input value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="col-span-2"><Label>Condition</Label><Input value={form.disease} onChange={e => setForm({ ...form, disease: e.target.value })} /></div>
        <div><Label>Doctor</Label><Input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} /></div>
        <div><Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Patient["status"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Admitted">Admitted</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <Button type="submit"><Plus className="size-4 mr-1.5" />Save</Button>
        </div>
      </form>
    </DialogContent>
  );
}
