import { OrderStatus } from "@/lib/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-slate-800 text-slate-200",
  assigned: "bg-blue-600/20 text-blue-300",
  accepted: "bg-cyan-600/20 text-cyan-300",
  "picked-up": "bg-indigo-600/20 text-indigo-200",
  "in-transit": "bg-purple-600/20 text-purple-200",
  delivered: "bg-emerald-600/20 text-emerald-200",
  returned: "bg-rose-600/20 text-rose-200"
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`badge ${STATUS_COLORS[status] ?? "bg-slate-800 text-slate-200"}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
