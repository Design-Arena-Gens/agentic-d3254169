import { NextResponse } from "next/server";
import { listOrders, createOrder } from "@/lib/actions/orders";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const data = await request.json();
  const order = await createOrder({
    reference: data.reference,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    address: data.address,
    cashOnDelivery: data.cashOnDelivery,
    status: "pending",
    assignedDriverId: null,
    promisedAt: data.promisedAt ?? new Date().toISOString(),
    notes: data.notes,
    barcode: data.barcode,
    cashCollected: 0
  });

  return NextResponse.json(order, { status: 201 });
}
