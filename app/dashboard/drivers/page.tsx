import { listDrivers } from "@/lib/actions/drivers";
import { listOrdersByDriver } from "@/lib/actions/orders";
import { DriverAvailabilityToggle } from "@/components/drivers/driver-availability-toggle";
import dynamic from "next/dynamic";

const OrderMap = dynamic(() => import("@/components/orders/order-map"), {
  ssr: false
});

export default async function DriversPage() {
  const drivers = await listDrivers();
  const driverOrders = await Promise.all(
    drivers.map(async (driver) => ({
      driverId: driver.id,
      orders: await listOrdersByDriver(driver.id)
    }))
  );

  const orderLookup = Object.fromEntries(
    driverOrders.map((entry) => [entry.driverId, entry.orders])
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Driver Command Center</h1>
        <p className="text-sm text-slate-400">
          Monitor live positions, task queues, and operational readiness.
        </p>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold">Fleet Overview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Cash on Hand</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {drivers.map((driver) => {
                const orders = orderLookup[driver.id] ?? [];
                return (
                  <tr key={driver.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{driver.name}</div>
                      <div className="text-xs text-slate-400">
                        {driver.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{driver.vehicle}</div>
                      <div className="text-xs text-slate-400">
                        {driver.licensePlate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-400">
                        {orders.length
                          ? orders
                              .map((order) => order.reference)
                              .slice(0, 3)
                              .join(", ")
                          : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-400">
                      ₹{driver.cashOnHand.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-slate-800 text-slate-200">
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DriverAvailabilityToggle driver={driver} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Live Positions</h2>
        <p className="text-xs text-slate-400">
          Displayed using Firebase Realtime Database mirror.
        </p>
        <div className="mt-4 h-[500px] overflow-hidden rounded-xl border border-slate-800">
          <OrderMap drivers={drivers} />
        </div>
      </section>
    </div>
  );
}
