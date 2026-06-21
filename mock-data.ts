export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  condition: string;
  lastVisit: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string; // ISO
  status: "Scheduled" | "Completed" | "Cancelled";
};

export type Doctor = {
  id: string;
  name: string;
  department: string;
  available: boolean;
  patients: number;
};

export const seedPatients: Patient[] = [
  { id: "P-1001", name: "Aarav Sharma", age: 34, gender: "Male", phone: "+91 98200 11111", condition: "Hypertension", lastVisit: "2026-06-10" },
  { id: "P-1002", name: "Priya Iyer", age: 28, gender: "Female", phone: "+91 98200 22222", condition: "Migraine", lastVisit: "2026-06-15" },
  { id: "P-1003", name: "Rohan Mehta", age: 52, gender: "Male", phone: "+91 98200 33333", condition: "Type-2 Diabetes", lastVisit: "2026-05-29" },
  { id: "P-1004", name: "Sara Khan", age: 41, gender: "Female", phone: "+91 98200 44444", condition: "Asthma", lastVisit: "2026-06-18" },
  { id: "P-1005", name: "Daniel Park", age: 7, gender: "Male", phone: "+91 98200 55555", condition: "Fever (viral)", lastVisit: "2026-06-19" },
];

export const seedDoctors: Doctor[] = [
  { id: "D-01", name: "Dr. Anjali Rao", department: "Cardiology", available: true, patients: 12 },
  { id: "D-02", name: "Dr. Vikram Singh", department: "Neurology", available: true, patients: 8 },
  { id: "D-03", name: "Dr. Meera Patel", department: "Pediatrics", available: false, patients: 15 },
  { id: "D-04", name: "Dr. Arjun Nair", department: "General Medicine", available: true, patients: 20 },
];

export const seedAppointments: Appointment[] = [
  { id: "A-2001", patientName: "Aarav Sharma", doctor: "Dr. Anjali Rao", department: "Cardiology", date: "2026-06-22T10:00:00", status: "Scheduled" },
  { id: "A-2002", patientName: "Priya Iyer", doctor: "Dr. Vikram Singh", department: "Neurology", date: "2026-06-22T11:30:00", status: "Scheduled" },
  { id: "A-2003", patientName: "Daniel Park", doctor: "Dr. Meera Patel", department: "Pediatrics", date: "2026-06-21T15:00:00", status: "Completed" },
  { id: "A-2004", patientName: "Sara Khan", doctor: "Dr. Arjun Nair", department: "General Medicine", date: "2026-06-23T09:00:00", status: "Scheduled" },
];

const KEY = (k: string) => `mediai:${k}`;

export function loadStore<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY(name));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStore<T>(name: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(name), JSON.stringify(value));
}
