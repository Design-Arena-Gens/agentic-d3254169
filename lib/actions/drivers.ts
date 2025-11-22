import "server-only";

import { revalidatePath } from "next/cache";
import { getDrivers, saveDrivers } from "@/lib/data-store";
import { Driver } from "@/lib/types";

export async function listDrivers() {
  return getDrivers();
}

export async function updateDriverLocation(
  driverId: string,
  location: Driver["location"],
  cashOnHand?: number
) {
  const drivers = await getDrivers();
  const driver = drivers.find((item) => item.id === driverId);

  if (!driver) {
    throw new Error("Driver not found");
  }

  driver.location = location;
  driver.lastHeartbeat = new Date().toISOString();

  if (typeof cashOnHand === "number") {
    driver.cashOnHand = cashOnHand;
  }

  await saveDrivers(drivers);
  revalidatePath("/dashboard/drivers");
}

export async function setDriverAvailability(
  driverId: string,
  status: Driver["status"]
) {
  const drivers = await getDrivers();
  const driver = drivers.find((item) => item.id === driverId);

  if (!driver) {
    throw new Error("Driver not found");
  }

  driver.status = status;
  await saveDrivers(drivers);
  revalidatePath("/dashboard/drivers");
}
