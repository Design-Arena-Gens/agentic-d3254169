import { listCashSessions } from "@/lib/actions/cash";
import { listDrivers } from "@/lib/actions/drivers";
import { CashSessionCard } from "@/components/finance/cash-session-card";

export default async function FinancePage() {
  const [sessions, drivers] = await Promise.all([
    listCashSessions(),
    listDrivers()
  ]);

  const driverMap = new Map(drivers.map((driver) => [driver.id, driver]));
  const pending = sessions.filter((session) => session.status === "pending");
  const completed = sessions.filter((session) => session.status !== "pending");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Cash Desk</h1>
        <p className="text-sm text-slate-400">
          Reconcile COD and driver remittances with clear audit trail.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Pending Verification</h2>
        {pending.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((session) => (
              <CashSessionCard
                key={session.id}
                session={session}
                driver={driverMap.get(session.driverId)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            All caught up! No pending cash sessions right now.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">History</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {completed.map((session) => (
            <CashSessionCard
              key={session.id}
              session={session}
              driver={driverMap.get(session.driverId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
