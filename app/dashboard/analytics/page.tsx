import { listOrders } from "@/lib/actions/orders";
import { listDrivers } from "@/lib/actions/drivers";
import { format } from "date-fns";

export default async function AnalyticsPage() {
  const [orders, drivers] = await Promise.all([
    listOrders(),
    listDrivers()
  ]);

  const delivered = orders.filter((order) => order.status === "delivered");
  const returned = orders.filter((order) => order.status === "returned");
  const codRecovered = delivered.reduce((sum, order) => {
    return sum + (order.cashCollected ?? 0);
  }, 0);

  const assignmentsByDriver = drivers.map((driver) => ({
    driver,
    count: orders.filter((order) => order.assignedDriverId === driver.id).length
  }));

  const today = format(new Date(), "dd MMM yyyy");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-slate-400">
          Performance snapshots across orders, drivers, and COD.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase text-slate-400">Delivered</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            {delivered.length}
          </p>
          <p className="mt-2 text-xs text-slate-500">Across all cities · {today}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase text-slate-400">Returned</p>
          <p className="mt-2 text-3xl font-bold text-rose-300">
            {returned.length}
          </p>
          <p className="mt-2 text-xs text-slate-500">Follow-up required</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase text-slate-400">COD Recovered</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            ₹{codRecovered.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-slate-500">Verified collections</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase text-slate-400">Drivers Active</p>
          <p className="mt-2 text-3xl font-bold text-blue-300">
            {drivers.filter((driver) => driver.status !== "offline").length}
          </p>
          <p className="mt-2 text-xs text-slate-500">Out of {drivers.length} total</p>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Dispatch Load</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignmentsByDriver.map(({ driver, count }) => (
            <div
              key={driver.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <p className="text-sm font-semibold">{driver.name}</p>
              <p className="text-xs text-slate-400">{driver.vehicle}</p>
              <p className="mt-2 text-2xl font-bold text-slate-200">
                {count} <span className="text-xs text-slate-400">orders</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
