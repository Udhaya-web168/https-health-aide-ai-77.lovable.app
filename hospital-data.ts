// Rich mock dataset for MediCare AI Hospital
export type PatientStatus = "Active" | "Discharged" | "Admitted";
export type ApptStatus = "Confirmed" | "Waiting" | "Completed" | "Cancelled";

export type Patient = {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: number;
  bloodGroup: string;
  phone: string;
  disease: string;
  doctor: string;
  status: PatientStatus;
  avatar: string;
  history: { date: string; note: string; doctor: string }[];
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availability: "Available" | "Busy" | "On Leave";
  rating: number;
  patients: number;
  avatar: string;
};

export type Appointment = {
  id: string;
  patient: string;
  gender: "Male" | "Female";
  time: string; // "09:00 AM"
  date: string; // YYYY-MM-DD
  department: string;
  doctor: string;
  status: ApptStatus;
};

export type Bill = {
  id: string;
  patient: string;
  doctor: string;
  consultation: number;
  medicine: number;
  lab: number;
  status: "Paid" | "Pending";
  date: string;
};

export type MedicalReport = {
  id: string;
  patient: string;
  type: "Blood Report" | "X-Ray" | "MRI" | "ECG";
  date: string;
  doctor: string;
  summary: string;
};

const today = new Date().toISOString().slice(0, 10);

export const PATIENTS: Patient[] = [
  {
    id: "P001",
    name: "Arun Kumar",
    gender: "Male",
    age: 28,
    bloodGroup: "O+",
    phone: "9876543210",
    disease: "Fever",
    doctor: "Dr. Priya",
    status: "Active",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arun&backgroundColor=dbeafe",
    history: [
      { date: "2026-06-15", note: "Reports mild fever, prescribed rest & fluids.", doctor: "Dr. Priya" },
      { date: "2026-05-02", note: "Routine check-up. All vitals normal.", doctor: "Dr. Priya" },
    ],
  },
  {
    id: "P002",
    name: "Lakshmi Devi",
    gender: "Female",
    age: 35,
    bloodGroup: "A+",
    phone: "9876500000",
    disease: "Diabetes",
    doctor: "Dr. Rajesh",
    status: "Active",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lakshmi&backgroundColor=fce7f3",
    history: [
      { date: "2026-06-10", note: "HbA1c 7.8 — diet plan updated.", doctor: "Dr. Rajesh" },
      { date: "2026-03-22", note: "Diabetes follow-up.", doctor: "Dr. Rajesh" },
    ],
  },
  {
    id: "P003",
    name: "Mohammed Ali",
    gender: "Male",
    age: 52,
    bloodGroup: "B+",
    phone: "9876512345",
    disease: "Hypertension",
    doctor: "Dr. Rajesh",
    status: "Admitted",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mohammed&backgroundColor=dbeafe",
    history: [
      { date: "2026-06-18", note: "BP 150/95 — admitted for observation.", doctor: "Dr. Rajesh" },
    ],
  },
  {
    id: "P004",
    name: "Priya Sharma",
    gender: "Female",
    age: 24,
    bloodGroup: "AB+",
    phone: "9876598765",
    disease: "Pregnancy Checkup",
    doctor: "Dr. Meena",
    status: "Active",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=fce7f3",
    history: [
      { date: "2026-06-12", note: "Routine 2nd trimester scan — normal.", doctor: "Dr. Meena" },
    ],
  },
  {
    id: "P005",
    name: "Rahul Verma",
    gender: "Male",
    age: 31,
    bloodGroup: "O-",
    phone: "9876511223",
    disease: "Knee Pain",
    doctor: "Dr. Arjun",
    status: "Active",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul&backgroundColor=dbeafe",
    history: [{ date: "2026-06-11", note: "MRI suggested mild ligament strain.", doctor: "Dr. Arjun" }],
  },
  {
    id: "P006",
    name: "Anitha Selvi",
    gender: "Female",
    age: 29,
    bloodGroup: "B+",
    phone: "9876523456",
    disease: "Skin Allergy",
    doctor: "Dr. Meena",
    status: "Discharged",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anitha&backgroundColor=fce7f3",
    history: [{ date: "2026-06-09", note: "Topical antihistamine prescribed.", doctor: "Dr. Meena" }],
  },
];

export const DOCTORS: Doctor[] = [
  { id: "D01", name: "Dr. Priya", specialty: "General Physician", availability: "Available", rating: 4.9, patients: 142, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrPriya&backgroundColor=e0f2fe" },
  { id: "D02", name: "Dr. Rajesh", specialty: "Cardiologist", availability: "Busy", rating: 4.8, patients: 210, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrRajesh&backgroundColor=dbeafe" },
  { id: "D03", name: "Dr. Meena", specialty: "Gynecologist", availability: "Available", rating: 4.9, patients: 178, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrMeena&backgroundColor=fce7f3" },
  { id: "D04", name: "Dr. Arjun", specialty: "Orthopedic", availability: "On Leave", rating: 4.7, patients: 96, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrArjun&backgroundColor=ede9fe" },
  { id: "D05", name: "Dr. Karthik", specialty: "Neurologist", availability: "Available", rating: 4.8, patients: 88, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrKarthik&backgroundColor=dcfce7" },
  { id: "D06", name: "Dr. Sneha", specialty: "Pediatrician", availability: "Available", rating: 4.9, patients: 132, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=DrSneha&backgroundColor=fef3c7" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "A1", patient: "Arun Kumar", gender: "Male", time: "09:00 AM", date: today, department: "General Medicine", doctor: "Dr. Priya", status: "Confirmed" },
  { id: "A2", patient: "Mohammed Ali", gender: "Male", time: "10:30 AM", date: today, department: "Cardiology", doctor: "Dr. Rajesh", status: "Waiting" },
  { id: "A3", patient: "Rahul Verma", gender: "Male", time: "11:15 AM", date: today, department: "Orthopedic", doctor: "Dr. Arjun", status: "Confirmed" },
  { id: "A4", patient: "Lakshmi Devi", gender: "Female", time: "09:30 AM", date: today, department: "Diabetes Clinic", doctor: "Dr. Rajesh", status: "Completed" },
  { id: "A5", patient: "Priya Sharma", gender: "Female", time: "10:45 AM", date: today, department: "Gynecology", doctor: "Dr. Meena", status: "Confirmed" },
  { id: "A6", patient: "Anitha Selvi", gender: "Female", time: "12:00 PM", date: today, department: "Dermatology", doctor: "Dr. Meena", status: "Cancelled" },
];

export const BILLS: Bill[] = [
  { id: "INV-001", patient: "Arun Kumar", doctor: "Dr. Priya", consultation: 500, medicine: 320, lab: 0, status: "Paid", date: today },
  { id: "INV-002", patient: "Mohammed Ali", doctor: "Dr. Rajesh", consultation: 800, medicine: 1240, lab: 1500, status: "Pending", date: today },
  { id: "INV-003", patient: "Lakshmi Devi", doctor: "Dr. Rajesh", consultation: 600, medicine: 980, lab: 750, status: "Paid", date: today },
  { id: "INV-004", patient: "Priya Sharma", doctor: "Dr. Meena", consultation: 700, medicine: 0, lab: 1800, status: "Pending", date: today },
  { id: "INV-005", patient: "Rahul Verma", doctor: "Dr. Arjun", consultation: 600, medicine: 450, lab: 2400, status: "Paid", date: today },
];

export const REPORTS: MedicalReport[] = [
  { id: "R-001", patient: "Mohammed Ali", type: "ECG", date: today, doctor: "Dr. Rajesh", summary: "Sinus rhythm. Mild ST elevation noted." },
  { id: "R-002", patient: "Rahul Verma", type: "MRI", date: today, doctor: "Dr. Arjun", summary: "Mild MCL strain, no fracture." },
  { id: "R-003", patient: "Arun Kumar", type: "Blood Report", date: today, doctor: "Dr. Priya", summary: "CBC normal. CRP slightly elevated." },
  { id: "R-004", patient: "Lakshmi Devi", type: "Blood Report", date: today, doctor: "Dr. Rajesh", summary: "HbA1c 7.8. FBS 142 mg/dL." },
  { id: "R-005", patient: "Priya Sharma", type: "X-Ray", date: today, doctor: "Dr. Meena", summary: "Chest X-ray clear." },
];

export const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Orthopedic", "Gynecology", "Dermatology",
  "Neurology", "Pediatrics", "Diabetes Clinic", "Emergency",
];

export const EMERGENCY_DOCTORS = [
  { name: "Dr. Karthik", specialty: "Neurology / Trauma", phone: "+91 99000 11111" },
  { name: "Dr. Rajesh", specialty: "Cardiology", phone: "+91 99000 22222" },
  { name: "Dr. Priya", specialty: "General Emergency", phone: "+91 99000 33333" },
];

export const EMERGENCY_CONTACTS = [
  { label: "Ambulance", phone: "108" },
  { label: "Hospital Emergency Desk", phone: "+91 44 4000 0000" },
  { label: "Blood Bank", phone: "+91 44 4000 0011" },
  { label: "Poison Control", phone: "1066" },
];
