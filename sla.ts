export type Priority = "P1" | "P2" | "P3" | "P4";

export const SLA: Record<Priority, { label: string; response: string; resolution: string; color: string }> = {
  P1: { label: "Critical", response: "5 seconds", resolution: "30 minutes", color: "destructive" },
  P2: { label: "High", response: "30 seconds", resolution: "2 hours", color: "warning" },
  P3: { label: "Medium", response: "2 minutes", resolution: "8 hours", color: "primary" },
  P4: { label: "Low", response: "5 minutes", resolution: "24 hours", color: "success" },
};

const RULES: { priority: Priority; patterns: RegExp[] }[] = [
  {
    priority: "P1",
    patterns: [
      /emergenc/i, /\bicu\b/i, /cardiac arrest/i, /chest pain/i, /heart attack/i,
      /stroke/i, /unconscious/i, /severe bleeding/i, /not breathing/i,
    ],
  },
  {
    priority: "P2",
    patterns: [/appointment (failure|failed|cancel)/i, /doctor (unavailable|not available)/i, /urgent/i],
  },
  {
    priority: "P3",
    patterns: [/billing/i, /invoice/i, /report/i, /test result/i, /payment/i],
  },
];

export function classifyPriority(text: string): Priority {
  for (const r of RULES) {
    if (r.patterns.some((p) => p.test(text))) return r.priority;
  }
  return "P4";
}

const EMERGENCY = [/chest pain/i, /heart attack/i, /stroke/i, /unconscious/i, /severe bleeding/i, /not breathing/i, /cardiac arrest/i];

export function isEmergency(text: string): boolean {
  return EMERGENCY.some((p) => p.test(text));
}
