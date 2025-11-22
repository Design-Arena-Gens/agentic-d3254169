"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/dashboard/orders/actions";
import { Order, OrderStatus } from "@/lib/types";

const statusFlow: OrderStatus[] = [
  "pending",
  "assigned",
  "accepted",
  "picked-up",
  "in-transit",
  "delivered",
  "returned"
];

interface Props {
  order: Order;
}

export function OrderStatusUpdate({ order }: Props) {
  const [isPending, startTransition] = useTransition();

  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;

  const markDelivered = (status: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus({
        orderId: order.id,
        status,
        actorId: "manager-1",
        cashCollected: status === "delivered" ? order.cashOnDelivery : undefined
      });
    });
  };

  return (
    <div className="flex gap-2">
      {nextStatus ? (
        <button
          onClick={() => markDelivered(nextStatus)}
          disabled={isPending}
          className="rounded-lg border border-brand/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating..." : `Mark ${nextStatus.replace("-", " ")}`}
        </button>
      ) : null}
      {order.status !== "returned" && order.status !== "delivered" ? (
        <button
          onClick={() => markDelivered("returned")}
          disabled={isPending}
          className="rounded-lg border border-rose-500/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark Returned
        </button>
      ) : null}
    </div>
  );
}
