import { listOrders } from "@/lib/actions/orders";
import { listDrivers } from "@/lib/actions/drivers";
import { StatusPill } from "@/components/status-pill";
import { OrderStatusUpdate } from "@/components/orders/order-status-update";
import { AssignOrderSheet } from "@/components/orders/assign-order-sheet";
import dynamic from "next/dynamic";
import Link from "next/link";

const OrderMap = dynamic(() => import("@/components/orders/order-map"), {
  ssr: false
});

export default async function OrdersPage() {
  const [orders, drivers] = await Promise.all([listOrders(), listDrivers()]);
  const unassigned = orders.filter((order) => !order.assignedDriverId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-slate-400">
            Manage delivery workflow, assignment, and status updates.
          </p>
        </div>
        <Link
          href="/dashboard/orders/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow hover:bg-brand-light"
        >
          Create Order
        </Link>
      </header>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Queue</h2>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {orders.length} total
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-400">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">COD</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((order) => {
                  const driver = drivers.find(
                    (item) => item.id === order.assignedDriverId
                  );
                  return (
                    <tr key={order.id} className="hover:bg-slate-900/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{order.reference}</div>
                        <div className="text-xs text-slate-400">
                          {order.address}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{order.customerName}</div>
                        <div className="text-xs text-slate-400">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        {driver ? (
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-xs text-slate-400">
                              {driver.vehicle}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-400">
                            Awaiting assignment
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-400">
                        ₹{order.cashOnDelivery.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <OrderStatusUpdate order={order} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="card">
          <h2 className="text-lg font-semibold">Assign Orders</h2>
          <p className="text-xs text-slate-400">
            Smart dispatch to the right drivers.
          </p>
          {unassigned.length === 0 ? (
            <p className="mt-4 text-sm text-emerald-300">
              All orders are currently assigned.
            </p>
          ) : (
            <div className="mt-4 space-y-6">
              {unassigned.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{order.reference}</p>
                      <p className="text-xs text-slate-400">{order.address}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      ₹{order.cashOnDelivery.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-3">
                    <AssignOrderSheet orderId={order.id} drivers={drivers} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Live Driver Map</h2>
        <p className="text-xs text-slate-400">
          Real-time location stream from Firebase (mocked for demo).
        </p>
        <div className="mt-4 h-[420px] overflow-hidden rounded-xl border border-slate-800">
          <OrderMap drivers={drivers} />
        </div>
      </section>
    </div>
  );
}
