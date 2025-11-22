import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/actions/orders";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const data = await request.json();
  await updateOrderStatus({
    orderId: params.orderId,
    status: data.status,
    actorId: data.actorId ?? params.orderId,
    cashCollected: data.cashCollected,
    note: data.note
  });

  return NextResponse.json({ ok: true });
}
