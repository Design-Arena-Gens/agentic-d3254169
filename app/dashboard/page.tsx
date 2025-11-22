import { listOrders } from "@/lib/actions/orders";
import { listDrivers } from "@/lib/actions/drivers";
import { listCashSessions } from "@/lib/actions/cash";
import { format } from "date-fns";
import Link from "next/link";

function summarizeStatus(orders: Awaited<ReturnType<typeof listOrders>>) {
  return orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});
}

export default async function DashboardPage() {
  const [orders, drivers, cashSessions] = await Promise.all([
    listOrders(),
    listDrivers(),
    listCashSessions()
  ]);
  const stats = summarizeStatus(orders);

  const todaysAssignments = orders.filter((order) => {
    const date = new Date(order.promisedAt);
    const now = new Date();
    return (
      date.getUTCFullYear() === now.getUTCFullYear() &&
      date.getUTCMonth() === now.getUTCMonth() &&
      date.getUTCDate() === now.getUTCDate()
    );
  });

  const activeDrivers = drivers.filter(
    (driver) => driver.status === "on-task"
  );

  const pendingCash = cashSessions.filter(
    (session) => session.status === "pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mission Control</h1>
          <p className="text-sm text-slate-400">
            Track orders, drivers, and reconciliation in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/orders/new"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-brand-light"
          >
            New Order
          </Link>
          <Link
            href="/dashboard/drivers"
            className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand hover:bg-brand/10"
          >
            Dispatch Center
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-sm text-slate-400">Orders Today</p>
          <p className="mt-2 text-3xl font-bold">{todaysAssignments.length}</p>
          <p className="mt-4 text-xs text-slate-500">Across all hubs</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Active Drivers</p>
          <p className="mt-2 text-3xl font-bold">{activeDrivers.length}</p>
          <p className="mt-4 text-xs text-slate-500">
            {drivers.length} total drivers logged
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Cash Outstanding</p>
          <p className="mt-2 text-3xl font-bold">
            ₹
            {drivers
              .reduce((sum, driver) => sum + driver.cashOnHand, 0)
              .toLocaleString("en-IN")}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Includes assigned COD from drivers
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Pending Reconciliations</p>
          <p className="mt-2 text-3xl font-bold">{pendingCash.length}</p>
          <p className="mt-4 text-xs text-slate-500">Needs finance approval</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Live Orders</h2>
              <p className="text-xs text-slate-400">
                Status at a glance across the network
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold uppercase tracking-wide text-brand"
            >
              View All
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <p className="text-sm capitalize text-slate-400">{key}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold">Finance Queue</h2>
          <p className="text-xs text-slate-400">
            Cash handover verification pipeline.
          </p>
          <div className="mt-6 space-y-4">
            {pendingCash.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-4"
              >
                <p className="text-sm font-semibold text-amber-300">
                  Awaiting {session.driverId.toUpperCase()}
                </p>
                <p className="mt-2 text-xs text-amber-200">
                  Declared ₹{session.declaredAmount.toLocaleString("en-IN")} •
                  Expected ₹{session.expectedAmount.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-amber-400">
                  {format(new Date(session.date), "dd MMM yyyy")}
                </p>
              </div>
            ))}
            {pendingCash.length === 0 && (
              <p className="text-sm text-slate-400">
                All sessions reconciled for now.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
