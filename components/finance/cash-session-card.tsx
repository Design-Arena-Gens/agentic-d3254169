"use client";

import { useState, useTransition } from "react";
import { verifyCashSession } from "@/app/dashboard/finance/actions";
import { CashSession, Driver } from "@/lib/types";

interface Props {
  session: CashSession;
  driver?: Driver;
}

export function CashSessionCard({ session, driver }: Props) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState(session.verifierNote ?? "");
  const [declared, setDeclared] = useState(session.declaredAmount);
  const [status, setStatus] = useState<CashSession["status"]>(session.status);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      await verifyCashSession(session.id, {
        status,
        verifierId: "finance-1",
        note,
        declaredAmount: declared
      });
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {driver?.name ?? session.driverId.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-400">
            Session #{session.id} · {session.date}
          </p>
        </div>
        <div>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CashSession["status"])
            }
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs uppercase text-slate-200"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="discrepancy">Discrepancy</option>
          </select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
          <p className="text-xs uppercase text-slate-500">Declared</p>
          <input
            type="number"
            value={declared}
            onChange={(event) => setDeclared(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
          <p className="text-xs uppercase text-slate-500">Expected</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            ₹{session.expectedAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
          <p className="text-xs uppercase text-slate-500">Variance</p>
          <p className="mt-2 text-2xl font-semibold text-amber-300">
            ₹{(declared - session.expectedAmount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs font-semibold uppercase text-slate-400">
          Finance Note
        </label>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isPending ? "Saving..." : "Update Session"}
        </button>
      </div>
    </form>
  );
}
