export type Role = "admin" | "doctor" | "receptionist";
export type AuthUser = { email: string; name: string; role: Role; avatar: string };

const KEY = "medicare:auth";

export const DEMO_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: "admin@medicare.com",
    password: "admin123",
    user: {
      email: "admin@medicare.com",
      name: "Dr. S. Administrator",
      role: "admin",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Admin&backgroundColor=dbeafe",
    },
  },
  {
    email: "doctor@medicare.com",
    password: "doctor123",
    user: {
      email: "doctor@medicare.com",
      name: "Dr. Priya Raman",
      role: "doctor",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya&backgroundColor=e0f2fe",
    },
  },
  {
    email: "reception@medicare.com",
    password: "recep123",
    user: {
      email: "reception@medicare.com",
      name: "Anitha Kumari",
      role: "receptionist",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Anitha&backgroundColor=ede9fe",
    },
  },
];

export function login(email: string, password: string): AuthUser | null {
  const match = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!match) return null;
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(match.user));
  return match.user;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
