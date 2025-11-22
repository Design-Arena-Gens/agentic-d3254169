import "server-only";

import { revalidatePath } from "next/cache";
import {
  getAssignmentLogs,
  getDrivers,
  getOrders,
  saveAssignmentLogs,
  saveDrivers,
  saveOrders
} from "@/lib/data-store";
import { uid } from "@/lib/ids";
import { Order, OrderStatus } from "@/lib/types";
import { sendAssignmentNotification } from "@/lib/actions/notifications";

interface AssignPayload {
  orderId: string;
  driverId: string;
  actorId: string;
  note?: string;
}

interface UpdateStatusPayload {
  orderId: string;
  actorId: string;
  status: OrderStatus;
  cashCollected?: number;
  note?: string;
}

export async function listOrders() {
  return getOrders();
}

export async function listOrdersByDriver(driverId: string) {
  const orders = await getOrders();
  return orders.filter((order) => order.assignedDriverId === driverId);
}

export async function assignOrder(payload: AssignPayload) {
  const { orderId, driverId, actorId, note } = payload;

  const orders = await getOrders();
  const drivers = await getDrivers();

  const order = orders.find((item) => item.id === orderId);
  const driver = drivers.find((item) => item.id === driverId);

  if (!order || !driver) {
    throw new Error("Invalid order or driver.");
  }

  if (!driver.currentOrderIds.includes(orderId)) {
    driver.currentOrderIds.push(orderId);
  }

  order.assignedDriverId = driverId;
  order.status = order.status === "pending" ? "assigned" : order.status;
  order.timeline.push({
    status: "assigned",
    at: new Date().toISOString(),
    actor: actorId,
    note
  });

  await saveOrders(orders);
  await saveDrivers(drivers);

  const assignments = await getAssignmentLogs();
  assignments.push({
    id: uid("asg"),
    orderId,
    driverId,
    assignedBy: actorId,
    assignedAt: new Date().toISOString(),
    note
  });
  await saveAssignmentLogs(assignments);

  await sendAssignmentNotification({
    driverPhone: driver.phone,
    orderReference: order.reference,
    address: order.address
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/drivers");
}

export async function updateOrderStatus(payload: UpdateStatusPayload) {
  const { orderId, actorId, status, cashCollected, note } = payload;
  const orders = await getOrders();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  order.status = status;
  if (typeof cashCollected === "number") {
    order.cashCollected = cashCollected;
  }

  order.timeline.push({
    status,
    at: new Date().toISOString(),
    actor: actorId,
    note
  });

  await saveOrders(orders);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/drivers");
}

export async function createOrder(data: Omit<Order, "id" | "timeline">) {
  const orders = await getOrders();
  const newOrder: Order = {
    ...data,
    id: uid("ord"),
    timeline: [
      {
        status: "pending",
        at: new Date().toISOString(),
        actor: "system"
      }
    ]
  };

  orders.unshift(newOrder);
  await saveOrders(orders);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  return newOrder;
}
