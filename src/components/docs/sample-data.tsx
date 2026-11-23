import { Tag, type TagType } from "@scopesky/ui/feedback";
import type { DataTableColumn } from "@scopesky/ui/data";

/** Example records for the docs' data table demos and patterns. */
export interface ServiceRequest {
  id: string;
  customer: string;
  service: string;
  status: "Active" | "In progress" | "On hold" | "New";
  amount: number;
  date: string;
}

export const requests: ServiceRequest[] = [
  { id: "SR-20481", customer: "Al-Noor Clinic", service: "Business fiber 500", status: "Active", amount: 420, date: "2026-11-02" },
  { id: "SR-20477", customer: "Rafidain Logistics", service: "Dedicated line", status: "In progress", amount: 1250, date: "2026-10-28" },
  { id: "SR-20470", customer: "Dijla School", service: "Wi-Fi campus", status: "On hold", amount: 310, date: "2026-10-21" },
  { id: "SR-20466", customer: "Babel Pharmacy", service: "Business fiber 100", status: "Active", amount: 95, date: "2026-10-17" },
  { id: "SR-20459", customer: "Erbil Tech Hub", service: "Cloud backup", status: "New", amount: 180, date: "2026-10-09" },
  { id: "SR-20452", customer: "Kufa Hotel", service: "Guest Wi-Fi", status: "Active", amount: 260, date: "2026-10-03" },
];

const statusTag: Record<ServiceRequest["status"], TagType> = { Active: "green", "In progress": "warm", "On hold": "red", New: "blue" };

export const requestColumns = (t: (en: string, ar: string) => string): DataTableColumn<ServiceRequest>[] => [
  { key: "id", header: t("Request", "الطلب"), cell: (r) => <span className="font-mono text-[13px] text-ink">{r.id}</span> },
  { key: "customer", header: t("Customer", "العميل") },
  { key: "service", header: t("Service", "الخدمة") },
  { key: "status", header: t("Status", "الحالة"), cell: (r) => <Tag type={statusTag[r.status]}>{r.status}</Tag> },
  { key: "amount", header: t("Monthly (USD)", "شهرياً (دولار)"), align: "end", cell: (r) => r.amount.toLocaleString("en-US") },
];
