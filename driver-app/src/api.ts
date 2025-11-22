const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export interface ApiOrder {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: string;
  cashOnDelivery: number;
  notes?: string;
}

export async function fetchTasks(driverId: string) {
  const response = await fetch(`${API_URL}/api/drivers/${driverId}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }
  const data = await response.json();
  return data.orders as ApiOrder[];
}

export async function heartbeat(
  driverId: string,
  coords: { lat: number; lng: number }
) {
  await fetch(`${API_URL}/api/drivers/${driverId}/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coords)
  });
}

export async function pushStatus(payload: {
  orderId: string;
  status: string;
  actorId: string;
  cashCollected?: number;
  note?: string;
}) {
  const response = await fetch(
    `${API_URL}/api/orders/${payload.orderId}/status`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update status");
  }
}
