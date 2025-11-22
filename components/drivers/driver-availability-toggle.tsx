"use client";

import { useTransition } from "react";
import { setDriverAvailability } from "@/app/dashboard/drivers/actions";
import { Driver } from "@/lib/types";

interface Props {
  driver: Driver;
}

export function DriverAvailabilityToggle({ driver }: Props) {
  const [isPending, startTransition] = useTransition();

  const cycleStatus = () => {
    const next =
      driver.status === "available"
        ? "on-task"
        : driver.status === "on-task"
          ? "offline"
          : "available";

    startTransition(async () => {
      await setDriverAvailability(driver.id, next);
    });
  };

  return (
    <button
      onClick={cycleStatus}
      disabled={isPending}
      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Updating..." : `Set ${driver.status} →`}
    </button>
  );
}
