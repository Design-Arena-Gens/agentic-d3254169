"use client";

import { useState, useTransition } from "react";
import { assignOrder } from "@/app/dashboard/orders/actions";
import { Driver } from "@/lib/types";

interface AssignOrderSheetProps {
  orderId: string;
  drivers: Driver[];
}

export function AssignOrderSheet({ orderId, drivers }: AssignOrderSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [driverId, setDriverId] = useState(drivers[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      action={(formData) => {
        startTransition(async () => {
          await assignOrder({
            orderId,
            driverId: formData.get("driverId") as string,
            actorId: "manager-1",
            note: formData.get("note") as string
          });
          setMessage("Assigned successfully.");
        });
      }}
    >
      <div>
        <label className="text-xs font-semibold uppercase text-slate-400">
          Assign to Driver
        </label>
        <select
          name="driverId"
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
        >
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} · {driver.vehicle}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-slate-400">
          Dispatch Note
        </label>
        <textarea
          name="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          rows={3}
          placeholder="Drop any specific delivery instructions for the driver."
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow hover:bg-brand-light disabled:cursor-wait disabled:bg-slate-700"
      >
        {isPending ? "Assigning..." : "Assign Order"}
      </button>
      {message && (
        <p className="text-xs text-emerald-400">
          {message}
        </p>
      )}
    </form>
  );
}
